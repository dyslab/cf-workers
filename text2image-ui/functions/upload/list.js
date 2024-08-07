export async function onRequestGet(context) {
  const list_count = parseInt(context.env.D1_FILES_LIST_COUNT);
  const stmt = context.env.FILES_DB.prepare('SELECT id, key, type, size FROM files ORDER BY id DESC LIMIT ?1').bind(list_count);
  const d1_result = await stmt.all();
  // console.log(d1_result); // For debug
  const db_rows = d1_result.results;
  /*
  // Note: timeZone names refer to 'https://nodatime.org/TimeZones', and can be get from context.request.cf.timezone
  new Date(db_rows[n].id).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })	// file upload time
  db_rows[n].key	// file name
  db_rows[n].type	// file type, set file icon 
  db_rows[n].size	// file size in bytes
  */
  const timezone = await context.request.cf.timezone;
  // console.log(timezone); // For debug
  const resp_list = [];
  for (const item of db_rows) {
    resp_list.push({
      key: item.key,
      type: item.type,
      size: item.size,
      datetime: new Date(item.id).toLocaleString('zh-CN', { timeZone: timezone }),
    });
  }

  return Response.json(resp_list);
}
