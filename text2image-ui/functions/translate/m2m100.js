export async function onRequestPost(context) {
  try {
    const contentType = await context.request.headers.get("content-type");
    if (contentType.includes("application/json")) {
      const request_json = await context.request.json();
      if (request_json.includes('from_content')) {
        request_json.to_content = `Translate from: ${request_json.from_content}, to: developing!`;
      } else {
        request_json.to_content = `JSON key 'from_content' does not exist!`;
      }
      return new Response(JSON.stringify(request_json));
    } else {
      return new Response(JSON.stringify(`Invalid content type!`));
    }
  } catch(err) {
    console.log(err);
    return new Response(JSON.stringify(`Error occured! Message: "${err}"`));
  }
}