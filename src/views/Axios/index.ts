import axios from 'axios';

// 创建一个 axios 实例
const instance = axios.create({
  timeout: 10000  // 设置超时时间
});

// 请求拦截器：在请求发送之前附加 Authorization 头
instance.interceptors.request.use(
  config => {
    // 直接从localStorage获取client_id
    const clientId = localStorage.getItem('client_id');
    const token = localStorage.getItem('token');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      config.headers['Content-Type'] = 'application/json';
      // 如果存在client_id，则使用它
      if (clientId) {
        config.headers["clientid"] = clientId;
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器：处理响应数据或错误
instance.interceptors.response.use(
  response => response,
  error => {
    // 处理错误
    if (error.response && error.response.status === 401) {
      // 如果 token 过期或无效，可以在这里处理，例如跳转到登录页

    }
    return Promise.reject(error);
  }
);

export default instance;