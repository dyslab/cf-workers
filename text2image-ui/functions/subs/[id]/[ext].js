export async function onRequestGet(context) {
  try {
    const filename = context.env.SUBS_FILENAME.replace('{id}', context.params.id).replace('{ext}', context.params.ext);
    console.log(filename);
    const fileobj = await context.env.DEST_BUCKET.get(filename);
    if (fileobj === null) {
      return new Response(JSON.stringify(`File "${filename}" not found!`), { status: 404 });
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
