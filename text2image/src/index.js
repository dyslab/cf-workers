// src/template/index.js
var template_default = {
  async fetch(request, env) {
    console.log(`Request method: ${request.method}`);
    let request_data = {};
    let is_authorized = false;
    try {
      let resp = await env.D_AUTH.fetch(request);
      let resp_json = await resp.json();
      console.log(resp_json);
      is_authorized = resp_json.authorized;
      request_data = resp_json.requestData;
    } catch(err) {
      console.log(err);
    }

  const setResponseJson = async (json_data) => {
    const resp = Response.json(json_data);
    resp.headers.set('Access-Control-Allow-Origin', '*');
    resp.headers.set('Access-Control-Allow-Methods', 'GET,HEAD,POST,OPTIONS');
    resp.headers.set('Access-Control-Max-Age', '86400');
    return resp;
  }

  const response_json = { 
    statusCode: 0,
    message: '',
    imageUrl: '',
  };

  if (is_authorized) {
      console.log(`App authorized. Request Data: ${JSON.stringify(request_data)}`);
      response_json.statusCode = 200;
      response_json.message = 'Authorized.';
      if ('prompt' in request_data) {
        try {
          const inputs = {
            prompt: request_data.prompt
          };
          const ai_resp = await env.AI.run(
            "@cf/stabilityai/stable-diffusion-xl-base-1.0",
            inputs
          );
          const file_key = `text2image_${new Date(Date.now()).toISOString()}.png`;
          const pngFile = await env.DEST_BUCKET.put(file_key, ai_resp.body);
          if (pngFile !== null) {
            console.log(pngFile.httpMetadata);
            response_json.imageUrl = pngFile.httpMetadata;
            response_json.message += ` Image saved to ${file_key}.`;  
          }
        } catch(err) {
          console.log(err);
          response_json.message += ` Though, exception caught. Error message: ${err}`;
        }
        return setResponseJson(response_json);
      }
      /* 
      // Response as a png file.
      return new Response(ai_resp, {
        headers: {
          "content-type": "image/png"
        }
      });
      */
    } else {
      console.log(`App unauthorized. Request Data: ${JSON.stringify(request_data)}`);
      response_json.statusCode = 401;
      response_json.message = 'Unauthorized.';
      return setResponseJson(response_json);
    }
  }
};

export {
  template_default as default
};
