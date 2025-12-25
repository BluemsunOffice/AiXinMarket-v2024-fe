// useNavBarData.ts
import { ref, onMounted } from 'vue';
import Axios from '../views/Axios/index'
export function useNavBarData(token: string) {
  const generalBalance = ref(0);
  const clothingBalance = ref(0);
  const campusName = ref('');
  const avatarUrl = ref('');

  const fetchData = async () => {
    try {
      // 获取校区名称
      const campusResponse = await Axios.get('http://59.110.62.188:8080/system/user/profile', {

      });
      if (campusResponse.data.code === 200 && campusResponse.data.data) {
        campusName.value = campusResponse.data.data.user.deptName;
        avatarUrl.value = campusResponse.data.data.user.avatar;
      } else {
        console.error('Failed to fetch user profile:', campusResponse.data.msg);
      }

      // 获取爱心币
      const balanceResponse = await Axios.get('http://59.110.62.188:8080/market/balance', {
       
      });
      if (balanceResponse.data.code === 200 && balanceResponse.data.data) {
        generalBalance.value = balanceResponse.data.data.generalBalance;
        clothingBalance.value = balanceResponse.data.data.clothingBalance;
      } else {
        console.error('Failed to fetch balance:', balanceResponse.data.msg);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  onMounted(() => {
    fetchData();
  });

  return {
    generalBalance,
    clothingBalance,
    campusName,
    avatarUrl
  };
}