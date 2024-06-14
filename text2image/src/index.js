// src/template/index.js
var template_default = {
  async fetch(request, env) {
    const is_authorized = false;
    try {
      const resp = await env.D_AUTH.fetch(request);
      const auth = await resp.json();
      if (auth !== null) is_authorized = auth.authorized;  
    } catch(err) {
      console.log(err);
    }

    if (is_authorized) {
      console.log('app authorized.')
    } else {
      console.log('app unauthorized')
    }

    const inputs = {
      prompt: "imagine movie poster for a (korean) romantic comedy that revolves around a young man living a luxurious life who meets a young woman in the countryside and decides to leave his riches behind to pursue a simpler life --ar 2:3 --v 5"
    };
    const response = await env.AI.run(
      "@cf/stabilityai/stable-diffusion-xl-base-1.0",
      inputs
    );
    return new Response(response, {
      headers: {
        "content-type": "image/png"
      }
    });
  }
};
export {
  template_default as default
};
