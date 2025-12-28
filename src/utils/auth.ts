
import axios from 'axios';

export async function isLogin() {
  try {
    const res = await axios.get('http://59.110.62.188:8080/auth/isLogin');
    console.log('isLogin status:', res);

    // 判断登录状态
    if (res.data.code === 200) {
      console.log('用户已登录');
      return true; // 已登录
    } else {
      console.log('用户未登录');
      return false; // 未登录
    }
  } catch (error) {
    console.log('请求出错:', error);
    return false; // 默认视为未登录
  }
}

export function isLoggedIn() {
  const token = localStorage.getItem('token'); // 从 localStorage 中获取 token
  return !!token; // 如果 token 存在且有效，返回 true
}
