export default {
	async fetch(request, env) {
		const allow_keys = env.ALLOW_KEYS;
		let return_flag = false;
		
		try {
			const par = {};
			if (request.method === 'GET') {
				const params = new URL(request.url).searchParams;
				for (const entry of params) {
					par[entry[0]] = entry[1];
				}
			} else if (request.method === 'POST') {
				const contentType = request.headers.get('content-type');
				if (contentType.includes('form')) {
					const formData = await request.formData();
					for (const entry of formData.entries()) {
						par[entry[0]] = entry[1];
					}
				}
			}

			if (Object.keys(par).indexOf('key') >=0) {
				for (const key of allow_keys) {
					if (par['key'].indexOf(key) >= 0) {
						console.log(`"${par['key']}" matches "${key}"`);
						return_flag = true;
						break;
					}
				}
			}
	
			return new Response.json({
				statusCode: 200,
				authorized: return_flag
			});	
		} catch(err) {
			console.log(err)
			return new Response.json({
				statusCode: 401,
				authorized: false
			});
		}
	},
};
