/**
 * Welcome to Cloudflare Workers!
 *
 * This is a template for a Scheduled Worker: a Worker that can run on a
 * configurable interval:
 * https://developers.cloudflare.com/workers/platform/triggers/cron-triggers/
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Run `curl "http://localhost:8787/__scheduled?cron=*+*+*+*+*"` to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(req, env) {
		const url = new URL(req.url)
		url.pathname = "/__scheduled";
		url.searchParams.append("cron", "* * * * *");
		return new Response(`To test the scheduled handler, ensure you have used the "--test-scheduled" then try running "curl ${url.href}".`);
	},

	// The scheduled handler is invoked at the interval set in our wrangler.toml's
	// [[triggers]] configuration.
	async scheduled(event, env) {
		let subs_url = env.SUBS_URL;
		let task_index = parseInt(await env.SUBS2BUCKET_KV.get('task_index'));
		console.log(task_index);

		if (task_index !== null && task_index >=0 && task_index < subs_url.length) {
			let s_time = new Date(event.scheduledTime).toLocaleString('zh-CN', {timeZone: 'Asia/Shanghai'});
			let resp = await fetch(subs_url[task_index]);
			if (resp.ok) {
				let file_ext = '.txt';
				const check_sub_url = subs_url[task_index].toLowerCase();
				if (check_sub_url.endsWith('.yml')) {
					file_ext = '.yml';
				} else if (check_sub_url.endsWith('.yaml')) {
					file_ext = '.yaml';
				}
				let file_key = `subs_url_${task_index}${file_ext}`;
				let r2_obj = await env.DEST_BUCKET.put(file_key, await resp.text());
				if (r2_obj !== null) {
					await env.SUBS2BUCKET_KV.put(
						file_key,
						`Last updated at ${s_time}, size: ${r2_obj.size} bytes.`
					);
				}
			}
			task_index ++;
			if (task_index >= subs_url.length) task_index = 0;
		} else {
			task_index = 0;
		}
		await env.SUBS2BUCKET_KV.put('task_index', task_index);
	},
};
