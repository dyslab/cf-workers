import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src';

describe('subs worker', () => {
	it('V2ray Subscription List', async () => {
		const request = new Request('https://subs.zhdys.workers.dev/');
		// Create an empty context to pass to `worker.fetch()`.
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		// Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
		await waitOnExecutionContext(ctx);
		expect(await response.text()).toMatchInlineSnapshot(`
			"
			<!doctype html>
			<html>
			  <head>
			    <title>V2ray Subscription List</title>
			    <style>
			      body {
			        font-family: "Lucida Console", Monaco, monospace;
			        font-size: 1rem;
			        line-height: 1.5rem;
			      }

			      a {
			        text-decoration: none;
			        text-shadow: none;
			      }
			      a:hover {
			        text-shadow: #142bff 0 0 1rem;
			      }

			      .container {
			        display: flex;
			        justify-content: center;
			        align-items: center;
			        flex-direction: column;
			        width: 100%;
			      }

			      table {
			        width: auto;
			      }

			      table.paleBlueRows {
			        /* font-family: "Times New Roman", Times, serif; */
			        border: 1px solid #FFFFFF;
			        text-align: center;
			        border-collapse: collapse;
			      }
			      table.paleBlueRows caption {
			        font-size: 1.5rem;
			        font-weight: bold;
			        color: #000000;
			        padding: 1rem 0;
			      }
			      table.paleBlueRows td, table.paleBlueRows th {
			        border: 1px solid #FFFFFF;
			        padding: 0.35rem 0.5rem;
			        word-break: break-all;
			      }
			      table.paleBlueRows tbody td {
			        font-size: 1rem;
			      }
			      table.paleBlueRows tr:nth-child(even) {
			        background: #dfecfb;
			      }
			      table.paleBlueRows thead {
			        background: #0B6FA4;
			        border-bottom: 5px solid #FFFFFF;
			      }
			      table.paleBlueRows thead th {
			        font-size: 1.1rem;
			        font-weight: bold;
			        color: #FFFFFF;
			        text-align: center;
			        border-left: 2px solid #FFFFFF;
			      }
			      table.paleBlueRows thead th:first-child {
			        border-left: none;
			      }

			      table.paleBlueRows tfoot {
			        font-size: 1rem;
			        font-weight: bold;
			        color: #333333;
			        background: #D0E4F5;
			        border-top: 3px solid #444444;
			      }
			      table.paleBlueRows tfoot td {
			        font-size: 1rem;
			      }

			      blockquote {
			        background: #f9f9f9;
			        border-left: 0.75rem solid #ccc;
			        margin: 2rem 1rem;
			        padding: 1rem 1rem 1rem 0;
			      }
			      blockquote:before {
			        color: #ccc;
			        content: open-quote;
			        font-size: 3em;
			        line-height: 0.1em;
			        margin-right: 0.25em;
			        vertical-align: -0.4em;
			      }
			      blockquote p {
			        display: inline;
			      }
			    </style>
			  </head>
			  <body>
			    <div class="container">
			      <table class="paleBlueRows">
			        <caption>
			          V2Ray Subscription List
			        </caption>
			        <thead>
			          <tr>
			            <th>ID</th>
			            <th>Name</th>
			            <th>Link</th>
			            <th colspan="2">Actions</th>
			          </tr>
			        </thead>
			        <tbody>
			          <tr><td>0</td><td>Barabama FreeNodes</td><td>https://raw.githubusercontent.com/Barabama/FreeNodes/master/nodes/merged.txt</td><td><a href="?id=0" title="Raw data of 'Barabama FreeNodes'">📄</a></td><td><a href="?id=0&download=true" title="Download file from 'Barabama FreeNodes'">📥</a></td></tr><tr><td>1</td><td>chengaopan Nodes</td><td>https://raw.githubusercontent.com/chengaopan/AutoMergePublicNodes/master/list.txt</td><td><a href="?id=1" title="Raw data of 'chengaopan Nodes'">📄</a></td><td><a href="?id=1&download=true" title="Download file from 'chengaopan Nodes'">📥</a></td></tr><tr><td>2</td><td>ermaozi v2ray</td><td>https://raw.githubusercontent.com/ermaozi/get_subscribe/main/subscribe/v2ray.txt</td><td><a href="?id=2" title="Raw data of 'ermaozi v2ray'">📄</a></td><td><a href="?id=2&download=true" title="Download file from 'ermaozi v2ray'">📥</a></td></tr><tr><td>3</td><td>mfuu</td><td>https://raw.githubusercontent.com/mfuu/v2ray/master/v2ray</td><td><a href="?id=3" title="Raw data of 'mfuu'">📄</a></td><td><a href="?id=3&download=true" title="Download file from 'mfuu'">📥</a></td></tr><tr><td>4</td><td>Pawdroid</td><td>https://proxy.v2gh.com/https://raw.githubusercontent.com/Pawdroid/Free-servers/main/sub</td><td><a href="?id=4" title="Raw data of 'Pawdroid'">📄</a></td><td><a href="?id=4&download=true" title="Download file from 'Pawdroid'">📥</a></td></tr><tr><td>5</td><td>SSAggregator</td><td>https://raw.githubusercontent.com/mahdibland/SSAggregator/master/sub/sub_merge_base64.txt</td><td><a href="?id=5" title="Raw data of 'SSAggregator'">📄</a></td><td><a href="?id=5&download=true" title="Download file from 'SSAggregator'">📥</a></td></tr><tr><td>6</td><td>Surfboardv2ray Mixed</td><td>https://raw.githubusercontent.com/Surfboardv2ray/TGParse/main/splitted/mixed</td><td><a href="?id=6" title="Raw data of 'Surfboardv2ray Mixed'">📄</a></td><td><a href="?id=6&download=true" title="Download file from 'Surfboardv2ray Mixed'">📥</a></td></tr><tr><td>7</td><td>V2ray Configs</td><td>https://raw.githubusercontent.com/barry-far/V2ray-Configs/main/All_Configs_Sub.txt</td><td><a href="?id=7" title="Raw data of 'V2ray Configs'">📄</a></td><td><a href="?id=7&download=true" title="Download file from 'V2ray Configs'">📥</a></td></tr><tr><td>8</td><td>v2rayfree</td><td>https://raw.githubusercontent.com/aiboboxx/v2rayfree/main/v2</td><td><a href="?id=8" title="Raw data of 'v2rayfree'">📄</a></td><td><a href="?id=8&download=true" title="Download file from 'v2rayfree'">📥</a></td></tr>
			        </tbody>
			      </table>
			      <blockquote>
			        <strong>Disclaimer & Notes</strong>
			        <ul>
			          <li>This is a data porter for Github raw content. It purpose to be a cloudflare's worker demo.</li>
			          <li>The link of raw data 📄 can be used as a v2ray subscription source directly with update proxy setting ON.</li>
			          <li>The downloaded file 📥 can be imported to v2ray client as a local config file.</li>
			        </ul>
			      </blockquote>
			    </div>
			  </body>
			</html>
			"
		`);
	});
});
