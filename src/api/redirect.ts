import { useRouter } from "vue-router";
function redirect()
{   
      const router=useRouter();
    const query = new URLSearchParams(window.location.search);
const redirect = query.get('redirect') || '/home'; // 默认重定向到首页
if (redirect.startsWith('http')) {
window.location.href = redirect; // 如果是完整 URL，使用 `window.location.href` 跳转
            } 
            
            else {
                        router.push(redirect); // 如果是相对路径，使用 Vue Router 跳转
                } 
}
export default redirect;