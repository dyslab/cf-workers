export async function onRequestPost(context) {
  try {
    const cf = await context.request.cf;
    console.log(cf);
    for (const prefix of context.env.SUBS_FILES_SEARCH_PATH_PREFIX) {
      console.log(prefix);
    }
    return Response.json(JSON.stringify('hello, this is listall.js'));
  } catch(err) {
    console.log(err);
    return new Response(JSON.stringify(`Error occured! Message: "${err}"`));
  }
}
