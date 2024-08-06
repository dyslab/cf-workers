export async function onRequestGet(context) {

  async function getBucketFileList(bucket, prefix, regex, timezone) {

    function getIdExtFromKey(key, regex) {
      const ie = key.match(regex);
      if (ie !== null) {
        return {
          id: ie[1],
          ext: ie[2],
        };
      } else {
        return null;
      }
    }

    const files = [];
    const objects = await bucket.list({
      limit: 100,
      prefix: prefix,
    });
    for (const object of objects.objects) {
      const id_ext = getIdExtFromKey(object.key, regex);
      if (id_ext !== null) {
        files.push({
          id: id_ext.id,
          ext: id_ext.ext,
          key: object.key,
          size: object.size,
          datetime: object.uploaded.toLocaleString('zh-CN', {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit', 
            timeZone: timezone 
          }),
        });  
      }
    }
    return files;
  }

  try {
    const timezone = await context.request.cf.timezone;
    console.log(timezone);
    const auto_files = await getBucketFileList(
      context.env.DEST_BUCKET,
      context.env.SUBS_FILENAME.replace('{id}.{ext}', ''),
      `^${context.env.SUBS_FILENAME.replace('{id}.{ext}', '([0-9]+).(txt|yaml|yml)')}$`,
      timezone
    );
    const manual_files = await getBucketFileList(
      context.env.DEST_BUCKET,
      context.env.SUBS_FILENAME_MANUAL.replace('{id}.{ext}', ''),
      `^${context.env.SUBS_FILENAME_MANUAL.replace('{id}.{ext}', '([a-zA-Z0-9+-_]+).(txt|yaml|yml)')}$`,
      timezone
    );
    return Response.json(auto_files.concat(manual_files));
  } catch(err) {
    console.log(err);
    return new Response(JSON.stringify(`Error occured! Message: "${err}"`));
  }
}
