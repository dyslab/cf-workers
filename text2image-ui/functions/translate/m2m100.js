export async function onRequestPost(context) {
  try {
    const contentType = await context.request.headers.get("content-type");
    if (contentType.includes("application/json")) {
      const request_json = await context.request.json();
      request_json.to_content = `Translate from: ${request_json.from_content}, to: developing!`;
      return new Response(JSON.stringify(request_json));
    } else {
      return new Response(JSON.stringify(`Invalid content type!`));
    }
  } catch(err) {
    console.log(err);
    return new Response(JSON.stringify(`Error occured! Message: "${err}"`));
  }
}