export function isLoggedIn() {
    const token = localStorage.getItem('token'); // 从 localStorage 中获取 token
    return !!token; // 如果 token 存在且有效，返回 true
  }
  