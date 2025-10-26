# My Cloudflare Workers Demo Compilation

[![Cloudflare](./assets/cloudflare.svg)](https://dash.cloudflare.com/) &nbsp;[![Vue3](./assets/vue3.svg)](https://vuejs.org/)

## Project Installation

Each subfolder of this project connects to a cloudflare worker/page demo. Example:

```bash
# Go to the specific project folder
cd ./text2image-ui

# Install project packages
npm install
```

## Information about Wrangler installation or upgrade 💭

In order to avoid network issues such as like "network connection failed" or "proxy ..." error occurs, [npm offical registry](https://registry.npmjs.org) is recomended to be set as default registry when installing or upgrading  [Wrangler](https://developers.cloudflare.com/workers/wrangler/) package.

```bash
# Set to the offcial npm registry
npm config set registry https://registry.npmjs.org  
npm install -D wrangler@latest

OR: 🔄

# Npm cli with '--registry' parameter
npm install -D wrangler@latest --registry=https://registry.npmjs.org    
```
