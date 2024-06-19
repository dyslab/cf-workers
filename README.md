# My Cloudflare Workers Demo Compilation

[![Cloudflare](./assets/cloudflare.svg)](https://dash.cloudflare.com/) &nbsp;[![Vue3](./assets/vue3.svg)](https://vuejs.org/)

Each subfolder of this project connects to a cloudflare worker/page demo.

## Cloudflare Workers & Pages Development CLI Tools C3 / Wrangler Installation

> Note:
>
> To Avoid "network connection failed" or "proxy ..." error occurs while installing cloudflare C3 / Wrangler CLI tools, npm offical registry url <https://registry.npmjs.org> is recomended to be set as default registry.

```bash
npm config set registry https://registry.npmjs.org  # Set to the offcial npm registry

npm install -D wrangler@latest

# or

npm install -D wrangler@latest --registry=https://registry.npmjs.org    # Npm cli with '--registry' parameter
```
