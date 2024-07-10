export async function onRequestGet(context) {
  const params = new URL(context.request.url).searchParams;
  let message = params.get("message");
  if (message === null) {
    message = '';
  } else {
    message = decodeURIComponent(message);
  }
  try {
    const output_html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/1.0.1/css/bulma.min.css">
    <style>
      body {
        background: #8c4af0;
        height: 100vh;
      }
    </style>
  </head>
  <body class="p-3">
    <section class="section pt-6">
      <h1 class="title has-text-light">Unlock Secret Link</h1>
      <div class="block is-flex is-justify-content-start">
        <form action="/secretlink/redirect" method="post">
          <input type="hidden" name="secret" value="${context.params.secret}">
          <div class="field has-addons">
            <div class="control">
              <input class="input is-large" type="text" name="passcode" placeholder="your passcode" size="12" maxlength="12" required>
            </div>
            <div class="control">
              <button class="button is-primary is-light is-large" type="submit">
                <span class="icon">
                  <img src="/image/unlock.svg" />
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
      <div class="block has-text-danger-80 is-size-6">${message}</div>
    </section>
  </body>
</html>`;
    return new Response(output_html, {
      headers: {
        'Content-Type': 'text/html; charset=UTF-8'
      }
    });
  } catch(err) {
    console.log(err);
    return new Response(JSON.stringify(`Error occured! Message: "${err}"`));
  }
}
