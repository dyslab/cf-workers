const html_template = `
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
          {%TABLE_TBODY_CONTENT%}
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
`


function defaultResponseText(subs_list) {
  let return_text = 'V2ray Subscription List\n';
  return_text += `${new Array(80).join('-')}\n`;
  subs_list.forEach((element, index) => {
    return_text += 'id: ' + index + ', ' + element.name + ', ' + element.url + '\n';
  });
  return_text += `${new Array(80).join('-')}\n`;
  return return_text;
}

function defaultResponseHTML(subs_list) {
  const subs_html_content = subs_list.map((element, index) => {
    return `<tr><td>${index}</td><td>${element.name}</td><td>${element.url}</td><td><a href="?id=${index}" title="Raw data of '${element.name}'">📄</a></td><td><a href="?id=${index}&download=true" title="Download file from '${element.name}'">📥</a></td></tr>`;
  }).join(''); 
  return html_template.replace('{%TABLE_TBODY_CONTENT%}', subs_html_content);
}

export { defaultResponseText, defaultResponseHTML }