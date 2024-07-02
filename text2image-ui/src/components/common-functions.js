/**
 * 将文件大小格式化为可读的字符串格式
 * @param {Number} size - 文件大小（以字节为单位）
 * @returns {String} 格式化后的文件大小字符串
 */
export const formatFileSize = (size) => {
  if (size < 1024) {
    return `${size} B`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  } else {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }
};

/**
 * 格式化本地时间日期
 * @param {number} ms - 时间戳（以毫秒为单位）
 * @return {string} 格式化后的日期时间字符串
 */
export const formatLocaleDatetime = (ms) => {
  return new Date(ms).toLocaleString('zh-CN', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit', 
    timeZone: 'Asia/Shanghai' 
  });
};
