export async function onRequestPost(context) {
  const contentType = context.request.headers.get('content-type');
  const par = {};

  if (contentType.includes('form')) {
    try {
      const formData = await context.request.formData();
      for (const entry of formData.entries()) {
        par[entry[0]] = entry[1];
      }
    } catch(error) {
      return Response.json({
        status: 400,
        message: `Invalid form data! ${error}`
      });
    }
    // Verify url's length
    if (par.url.length > 1000) {
      par.url = par.url.substring(0, 1000);
    }
    // Insert new row(file) to D1 Table 'secretlinks'
    const new_row_info = await context.env.FILES_DB.prepare(
      'INSERT INTO secretlinks (id, secret, passcode, url) VALUES (?1, ?2, ?3, ?4)'
    ).bind(
      parseInt(Date.now()), 
      par.secret,
      par.passcode,
      par.url
    ).run();
    if (new_row_info.success) {
      try {
        const count = parseInt(await context.env.SECRETLINK_KV.get('count'));
        const auto_remove_threshold = parseInt(await context.env.SECRETLINK_KV.get('auto_remove_threshold'));
        if (count < auto_remove_threshold) {
					await context.env.SECRETLINK_KV.put('count', count + 1);
        } else {
          const limit = parseInt(await context.env.SECRETLINK_KV.get('limit'));
          const stmt = context.env.FILES_DB.prepare(
            'SELECT id FROM secretlinks ORDER BY id DESC LIMIT 1 OFFSET ?1'
          ).bind(limit - 1);
          const d1_result = await stmt.all();
          if (d1_result.success) {
            const db_rows = d1_result.results;
            if (db_rows.length > 0) {
              const temp_id = db_rows[0].id;
              // Delete outdated row(file) from D1 Table 'secretlinks'
              const delete_rows_info = await context.env.FILES_DB.prepare(
                'DELETE FROM secretlinks WHERE ID<?1'
              ).bind(temp_id).run();
              // console.log(delete_rows_info); // For debug
            }
          }
          await context.env.SECRETLINK_KV.put('count', limit);
        }
      } catch(error) {
        return Response.json({
          status: 500,
          message: `KV or D1 table 'secretlinks' read/write failed! ${error}`
        });
      }
      return Response.json({
        status: 200,
        message: new_row_info
      });
    } else {
      return Response.json({
        status: 500,
        message: `Insert record failed! ${new_row_info}`
      });
    }
  } else {
    return Response.json({
      status: 400,
      message: 'No form data!'
    });
  }
}
