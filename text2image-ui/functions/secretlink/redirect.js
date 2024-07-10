export async function onRequestPost(context) {
  const contentType = context.request.headers.get('content-type');
  const par = {};
  let return_message = '';
  let return_url = new URL(context.request.url).origin;

  if (contentType.includes('form')) {
    try {
      const formData = await context.request.formData();
      for (const entry of formData.entries()) {
        par[entry[0]] = entry[1];
      }
      if (Object.keys(par).includes('secret')) {
        return_url = `${return_url}/secretlink/web/${par.secret}`;
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
        return_message = encodeURIComponent('[Invalid passcode] URL not found.');
        return Response.redirect(`${return_url}?message=${return_message}`, 302);
      }
    } catch(error) {
      return_message = encodeURIComponent(`[Invalid form data] ${error.message}`);
      return Response.redirect(`${return_url}?message=${return_message}`, 302);
    }
  } else {
    return_message = encodeURIComponent(`[Bad Request] contentType: ${contentType}`);
    return Response.redirect(`${return_url}?message=${return_message}`, 302);
  }
}