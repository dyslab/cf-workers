export async function onRequestPost(context) {
  async function invokeM2M100(AI_worker, from_lang, to_lang, from_content) {
    const AI_resp = await AI_worker.run(
      "@cf/meta/m2m100-1.2b",
      {
        text: from_content,
        source_lang: from_lang, // defaults to English
        target_lang: to_lang,
      }
    );
    try {
      return AI_resp.translated_text;
    } catch (err) {
      console.log(err);
      return `Error occured! Message: "${err}"`;
    }
  }

  try {
    const contentType = await context.request.headers.get("content-type");
    if (contentType.includes("application/json")) {
      const requestJson = await context.request.json();
      requestJson.to_content = await invokeM2M100(
        context.env.AI,
        requestJson.from_lang,
        requestJson.to_lang,
        requestJson.from_content
      );
      return Response.json(requestJson);
    } else {
      return new Response(JSON.stringify(`Invalid content type!`));
    }
  } catch(err) {
    console.log(err);
    return new Response(JSON.stringify(`Error occured! Message: "${err}"`));
  }
}