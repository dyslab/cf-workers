export async function onRequestGet(context) {
  try {
    const output_html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        background: #6e28d9;
        padding: 0 24px;
        margin: 0;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      input {
        font-size: 2rem;
      }
    </style>
  </head>
  <body>
    <form action="/secretlink/redirect" method="post">
      <input type="text" name="passcode" placeholder="your passcode" size="10" maxlength="16" required>
      <input type="hidden" name="secret" value="${context.params.secret}">
      <input type="submit" value="Unlock">
    </form>
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
