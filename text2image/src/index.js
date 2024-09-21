var template_default = {
  async fetch(request, env) {
    console.log(`Request method: ${request.method}`);
    let request_data = {};
    let is_authorized = false;
    try {
      let resp = await env.D_AUTH.fetch(request);
      let resp_json = await resp.json();
      // console.log(resp_json);  // For debugging
      is_authorized = resp_json.authorized;
      request_data = resp_json.requestData;
    } catch(err) {
      console.log(err); // For debugging
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
      model_id: '',
      message: '',
      imageUrl: '',
    };

    if (is_authorized) {
      response_json.message = 'Authorized.';
      // console.log(`App authorized. Request Data: ${JSON.stringify(request_data)}`); // For debugging
      let model_id = '@cf/stabilityai/stable-diffusion-xl-base-1.0';
      if ('model_id' in request_data) {
        model_id = request_data.model_id;
        delete request_data.model_id;
      }
      if ('image' in request_data) request_data.image = JSON.parse(request_data.image);
      if ('mask' in request_data) request_data.mask = JSON.parse(request_data.mask);
      try {
        const ai_resp = await env.AI.run(
          model_id,
          request_data
        );
        const image_resp = new Response(ai_resp, {
          headers: {
            "content-type": "image/png",
            'Access-Control-Allow-Origin': '*',
          }
        });
        if (env.OUTPUT_IMAGE_TO === 'response') {
          // Response as a png file.
          return image_resp;
        } else if (env.OUTPUT_IMAGE_TO === 'bucket') {
          // Response json and save to bucket as a png file.
          const file_key = `text2image_${new Date(Date.now()).toISOString()}.png`;
          const pngFile = await env.DEST_BUCKET.put(file_key, await image_resp.blob());
          if (pngFile !== null) {
            response_json.imageUrl = `${env.PUBLIC_BUCKET_URL}${file_key}`;
            response_json.message += ` Image saved to ${file_key}.`;  
          }  
        }
      } catch(err) {
        console.log(err);
        response_json.message += ` Though, exception caught. Error message: ${err}`;
      }
      response_json.statusCode = 200;
      response_json.model_id = model_id;
      return setResponseJson(response_json);
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
