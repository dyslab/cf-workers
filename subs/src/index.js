/**
 * Welcome to Cloudflare Workers!
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request) {
		const v2ray_subs = [
			{ name: 'V2ray Configs', url: 'https://raw.githubusercontent.com/barry-far/V2ray-Configs/main/All_Configs_Sub.txt' },
			{ name: 'Pawdroid', url: 'https://proxy.v2gh.com/https://raw.githubusercontent.com/Pawdroid/Free-servers/main/sub' },
			{ name: 'Pawdroid(Mirror)', url: 'https://mirror.v2gh.com/https://raw.githubusercontent.com/Pawdroid/Free-servers/main/sub' },
			{ name: 'v2rayfree', url: 'https://raw.githubusercontent.com/aiboboxx/v2rayfree/main/v2' },
			{ name: 'Barabama FreeNodes', url: 'https://mirror.ghproxy.com/https://raw.githubusercontent.com/Barabama/FreeNodes/master/nodes/merged.txt' },
			{ name: 'ermaozi v2ray', url: 'https://raw.githubusercontent.com/ermaozi/get_subscribe/main/subscribe/v2ray.txt' },
			{ name: 'chengaopan Nodes@github', url: 'https://raw.githubusercontent.com/chengaopan/AutoMergePublicNodes/master/list.txt' },
			{ name: 'chengaopan Nodes@jsdelivr 1', url: 'https://cdn.jsdelivr.us/gh/chengaopan/AutoMergePublicNodes@master/list.txt' },
			{ name: 'chengaopan Nodes@jsdelivr 2', url: 'https://fastly.jsdelivr.net/gh/chengaopan/AutoMergePublicNodes@master/list.txt' },
			{ name: 'chengaopan Nodes@jsdelivr 3', url: 'https://testingcf.jsdelivr.net/gh/chengaopan/AutoMergePublicNodes@master/list.txt' },
			{ name: 'chengaopan Nodes@kkgithub', url: 'https://raw.kkgithub.com/chengaopan/AutoMergePublicNodes/master/list.txt' },
			{ name: 'chengaopan Nodes@fgit', url: 'https://raw.fgit.cf/chengaopan/AutoMergePublicNodes/master/list.txt' },
			{ name: 'SSAggregator', url: 'https://raw.githubusercontent.com/mahdibland/SSAggregator/master/sub/sub_merge_base64.txt' }
		];

		async function defaultResponseText(subs_list) {
			let return_text = 'Here is the list for V2RAY subscription.\n' +
			'--------------------------------------------\n';
			subs_list.forEach((element, index) => {
				return_text += 'id: ' + index + ', ' + element.name + ', ' + element.url + '\n';
			});
			return return_text;
		};

		let default_response = await defaultResponseText(v2ray_subs);

		try {
			let params = new URL(request.url).searchParams;

			let id = params.get("id");
			let int_id = parseInt(id);
			let subs_item = null;
			if (int_id.toString() === id) {
				subs_item = v2ray_subs[int_id];
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
			console.log(err);
			return new Response(default_response);
		};
	},
};
