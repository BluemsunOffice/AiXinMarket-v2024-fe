import Axios from "../views/Axios/index";  

async function isLogin() {
    try {
        const res = await Axios.get('http://59.110.62.188:8080/auth/isLogin');
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

export default isLogin;