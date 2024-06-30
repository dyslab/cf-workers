export async function onRequestGet(context) {
  let params = new URLSearchParams(context.request.url);
  let id = 0;
  try {
    id = parseInt(params.get("id"));
  } catch(err) {
    pass
  }
  console.log(id);
  const stmt = context.env.FILES_DB.prepare('SELECT key, type, blob FROM files WHERE id=?1').bind(id);
  const d1_result = await stmt.all();
  const rows_count = parseInt(d1_result.meta.rows_read);
  console.log(rows_count);
  if (rows_count === 1) {
    const db_rows = d1_result.results;
    // Return response with headers to download file
    return new Response(db_rows[0].blob, {
      headers: {
        'Content-Type': `${db_rows[0].type}; charset=UTF-8`,
        'Content-Disposition': `attachment; filename=${db_rows[0].key}`
      }
    });
  }
}

export async function onRequestPost(context) {
  try {
    const file_size_limit = parseInt(context.env.FILE_SIZE_LIMIT_BYTES);
    const req_data = await context.request.formData();
    const file_id = req_data.get('file_id');
    const file = req_data.get('file');
    const file_name = file.name;
    const file_type = file.type;
    const file_size = file.size;
    const file_blob = await file.bytes();
    if (file_size > file_size_limit) {
      return Response.json({
        status: 400,
        id: file_id, 
        name: file_name,
        type: file_type,
        size: file_size,
        message: `File size is too large. Max size is ${file_size_limit} bytes.`
      });
    } else {
      // Insert new row(file) to D1 Table 'files'
      const new_row_info = await context.env.FILES_DB.prepare(
        'INSERT INTO files (id, uid, key, type, blob, size) VALUES (?1, ?2, ?3, ?4, ?5, ?6)'
      ).bind(
        parseInt(Date.now()), 
        'user',
        file_name,
        file_type,
        file_blob,
        file_size
      ).run();
      console.log(new_row_info);
      if (new_row_info.success) {
        const rows_limit = parseInt(context.env.D1_FILES_ROWS_LIMIT);
        const stmt = context.env.FILES_DB.prepare('SELECT id FROM files ORDER BY id DESC LIMIT ?1').bind(rows_limit);
        const d1_result = await stmt.all();
        const rows_count = parseInt(d1_result.meta.rows_read);
        console.log(rows_count);
        if (rows_count >= rows_limit) {
          const db_rows = d1_result.results;
          const temp_id = db_rows[rows_count-1].id;
          // Delete outdated rows(files)
          const delete_rows_info = await context.env.FILES_DB.prepare('DELETE FROM files WHERE ID<?1').bind(temp_id).run();
          console.log(delete_rows_info);
        }
        return Response.json({
          status: 200,
          id: file_id, 
          name: file_name,
          type: file_type,
          size: file_size,
          message: new_row_info 
        });
      } else {
        return Response.json({
          status: 400,
          id: file_id, 
          name: file_name,
          type: file_type,
          size: file_size,
          message: new_row_info
        });
      }
    }
  } catch (err) {
    return Response.json({
      status: 500,
      message: `${err.message}\n${err.stack}`
    });
  }
}
