/**
 * Welcome to Cloudflare Workers!
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import { defaultResponseText, defaultResponseHTML } from './default-response.js'

export default {
	async fetch(request, env) {	
		try {
			let params = new URL(request.url).searchParams;

			let id = params.get("id");
			let int_id = parseInt(id);
			let subs_item = null;
			if (int_id.toString() === id) {
				subs_item = env.V2RAY_SUBS[int_id];
			}

			let subs_response = await fetch(subs_item.url);

			let download = params.get("download");
			let bool_download = false;
			if (download !== null) {
				bool_download = download.toLowerCase() == 'true';
			}

			let headers = {
				'Content-Type': 'text/plain; charset=UTF-8',
			};
			if (bool_download) {
				headers = {
					'Content-Type': 'text/plain; charset=UTF-8',
					'Content-Disposition': 'attachment; filename=' + subs_item.name + '.txt'
				};
			}
			return new Response(
				await subs_response.text(),
				{ headers: headers },
			);
		} catch(err) {
			console.log(`[Caught Exception] No url params or url path not existed, Respond with default html.`);
			// Opt 1, default html response
			return new Response(defaultResponseHTML(env.V2RAY_SUBS), {
				headers: {
					'Content-Type': 'text/html; charset=UTF-8',
				}
			});
			// Opt 2, default text response
			// return new Response(defaultResponseText(env.V2RAY_SUBS));
		};
	},
};
