export async function onRequestGet(context) {
  try {
    const req_id = Number(context.params.id);
    let filename = null;
    if (isNaN(req_id)) {
      filename = context.env.SUBS_FILENAME_MANUAL.replace('{id}', context.params.id).replace('{ext}', context.params.ext);
    } else {
      filename = context.env.SUBS_FILENAME.replace('{id}', context.params.id).replace('{ext}', context.params.ext);
    }
    console.log(filename);
    if (filename !== null) {
      const fileobj = await context.env.DEST_BUCKET.get(filename);
      if (fileobj === null) {
        return new Response(JSON.stringify(`File "${filename}" not found!`), { status: 404 });
      }
    }
    return new Response(fileobj.body, {
      headers: {
        'Content-Type': 'text/plain; charset=UTF-8',
        'Content-Disposition': `attachment; filename=${filename}`
      }
    });
  } catch(err) {
    console.log(err);
    return new Response(JSON.stringify(`Error occured! Message: "${err}"`));
  }
}
