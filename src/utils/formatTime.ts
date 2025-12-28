import dayjs from 'dayjs';

/**
 * 格式化到天级别的时间（只显示年月日）
 * @param timestamp 时间戳（秒级或毫秒级）
 * @param format 格式化字符串，默认 'YYYY-MM-DD'
 * @returns 格式化后的时间字符串
 */
export function formatDay(
  timestamp: number | string | Date,
  format: string = 'YYYY-MM-DD'
): string {
  if (!timestamp && timestamp !== 0) return '';

  if(isNaN(Number(timestamp))) {
    const date = dayjs(timestamp);
    return date.format(format);
  }
  const ts = Number(timestamp);
  // 自动判断时间戳是秒级还是毫秒级（大于10位数为毫秒级）
  const date = ts > 9999999999 ? dayjs(ts) : dayjs(ts * 1000);

  return date.format(format);
}

/**
 * 通用格式化函数，可自定义格式
 * @param timestamp 时间戳（秒级或毫秒级）
 * @param format 格式化字符串
 * @returns 格式化后的时间字符串
 */
export function formatTime(
  timestamp: number | string | Date,
  format: string = 'YYYY-MM-DD HH:mm:ss'
): string {
  if (!timestamp && timestamp !== 0) return '';

  const ts = Number(timestamp);
  // 自动判断时间戳是秒级还是毫秒级（大于10位数为毫秒级）
  const date = ts > 9999999999 ? dayjs(ts) : dayjs(ts * 1000);

  return date.format(format);
}
