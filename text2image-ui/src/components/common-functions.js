/**
 * 将文件大小格式化为可读的字符串格式
 * @param {Number} size - 文件大小（以字节为单位）
 * @returns {String} 格式化后的文件大小字符串
 */
export const formatFileSize = (size) => {
  if (size < 1024) {
    return `${size} bytes`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  } else {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }
};

export const formatLocaleDatetime = (ms) => {
  return new Date(ms).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
};
