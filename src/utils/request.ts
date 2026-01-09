// utils/request.ts
import { RequestCore } from "@/core/request.core";
import { requestConfig } from "@/config/request.config";

// 创建请求实例单例
const requestInstance = new RequestCore(requestConfig);

// 导出常用的请求方法
export const request = requestInstance;

// 快捷方法导出
export const get = requestInstance.get.bind(requestInstance);
export const post = requestInstance.post.bind(requestInstance);
export const put = requestInstance.put.bind(requestInstance);
export const del = requestInstance.delete.bind(requestInstance);
export const patch = requestInstance.patch.bind(requestInstance);

// 默认导出请求实例
export default requestInstance;
