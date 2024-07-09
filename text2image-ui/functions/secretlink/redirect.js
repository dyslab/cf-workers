export async function onRequestPost(context) {
  const contentType = context.request.headers.get('content-type');
  const par = {};

  if (contentType.includes('form')) {
    try {
      const formData = await context.request.formData();
      for (const entry of formData.entries()) {
        par[entry[0]] = entry[1];
      }
      // Select row data by passcode and secret from D1 Table 'secretlinks'
      const stmt = context.env.FILES_DB.prepare(
        'SELECT url FROM secretlinks WHERE passcode = ?1 AND secret = ?2'
      ).bind(par.passcode, par.secret);
      const d1_result = await stmt.all();
      if (d1_result.success && d1_result.results.length > 0) {
        const url = d1_result.results[0].url;
        return Response.redirect(url, 302);
      } else {
        return Response.json({
          status: 404,
          message: `URL not found! ${JSON.stringify(d1_result)}`
        });
      }
    } catch(error) {
      return Response.json({
        status: 400,
        message: `Invalid form data! ${error}`
      });
    }
  } else {
    return Response.json({
      status: 400,
      message: `Invalid Request! ${contentType}`
    });
  }
}