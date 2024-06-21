export async function onRequestPost(context) {
  try {
    const req_json = await context.request.json();
    const res_json = [];
    for (const item of req_json) {
      let fname = context.env.SUBS_FILENAME.replace('{id}', item.id).replace('{ext}', item.ext);
      let finfo = await context.env.SUBS2BUCKET_KV.get(fname);
      if (finfo === null) {
        finfo = `KV Key "${fname}" not found!`;
      }
      const res_item = {};
      res_item.id = item.id;
      res_item.ext = item.ext;
      res_item.name = fname;
      res_item.info = finfo;
      res_json.push(res_item);
    }
    console.log(res_json);
    return Response.json(res_json);
  } catch(err) {
    console.log(err);
    return new Response(JSON.stringify(`Error occured! Message: "${err}"`));
  }
}
