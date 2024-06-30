export async function onRequestGet(context) {
  const list_count = parseInt(context.env.D1_FILES_LIST_COUNT);
  const stmt = context.env.FILES_DB.prepare('SELECT id, key, type, size FROM files ORDER BY id DESC LIMIT ?1').bind(list_count);
  const d1_result = await stmt.all();
  console.log(d1_result);
  const db_rows = d1_result.result;
  /*
  // Note: timeZone names refer to 'https://nodatime.org/TimeZones', and can be get from context.request.cf.timezone
  new Date(db_rows[n].id).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })	// file upload time
  db_rows[n].key	// file name
  db_rows[n].type	// file type, set file icon 
  db_rows[n].size	// file size in bytes
  */
  return Response.json(db_rows);
}
