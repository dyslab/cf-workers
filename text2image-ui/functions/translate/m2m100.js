export async function onRequestPost(context) {
  try {
    const contentType = await context.request.headers.get("content-type");
    if (contentType.includes("application/json")) {
      const requestJson = await context.request.json();
      requestJson.to_content = `Translating text "${requestJson.from_content}"`;
      return Response.json(requestJson);
    } else {
      return new Response(JSON.stringify(`Invalid content type!`));
    }
  } catch(err) {
    console.log(err);
    return new Response(JSON.stringify(`Error occured! Message: "${err}"`));
  }
}