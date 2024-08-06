/**
 * 处理 HTTP GET 请求的异步函数，返回指定存储桶中文件列表的 JSON 格式数据
 * 这个列表是通过过滤对象键值来生成的，每个文件对象包含如 id、ext、key、size 和 datetime 属性
 * @param context - 请求上下文，包含环境变量和与请求相关的对象
 * @param context.env.DEST_BUCKET - 存储桶名称
 * @param context.env.SUBS_FILENAME - 文件名字模板（用于自动文件）
 * @param context.env.SUBS_FILENAME_MANUAL - 文件名字模板（用于手动文件）
 * @returns 所有符合条件文件的列表，以 JSON 格式返回，或者在出错时返回错误消息的 JSON 字符串
 * @throws 若在获取文件列表或处理请求的过程中发生错误，会记录错误到控制台，并返回包含错误消息的响应
 */
export async function onRequestGet(context) {

  /**
   * 获取指定存储桶中与正则表达式匹配的文件列表，并转换为指定格式的对象数组
   * @param bucket - 存储桶对象，用于获取文件列表
   * @param prefix - 列出文件时使用的前缀，用于筛选特定目录下的文件
   * @param regex - 用于匹配文件名的正则表达式，用来提取文件的 id 和扩展名
   * @param timezone - 用于格式化日期的时区偏移
   * @returns 文件列表，每个文件对象包括 id、ext、key、size 和根据 timezone 格式化后的 datetime
   * @throws 若在获取文件列表或处理请求的过程中发生错误，会记录错误到控制台，并返回包含错误消息的响应
   */
  async function getBucketFileList(bucket, prefix, regex, timezone) {

    /**
     * 从键值（通常是文件名）中通过正则表达式提取 id 和扩展名
     * @param key - 原始键值，可以是文件名或其他字符串
     * @param regex - 正则表达式模式，用于提取文件名中的 id 和扩展名
     * @returns 返回提取到的 id 和扩展名组成的对象，如果没有匹配则返回 null
     */
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
      limit: 20,
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
            year: 'numeric',
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
    // console.log(timezone);  // For debug
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
