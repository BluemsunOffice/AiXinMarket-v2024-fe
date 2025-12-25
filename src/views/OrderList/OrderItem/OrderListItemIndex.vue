<template>
  <button @click="cancelOrder">取消订单</button>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      orderId: "", // 这里替换成实际的订单ID
      token: "", // 这里替换成实际的Token
      clientId: "", // 这里替换成实际的Client ID
    };
  },
  methods: {
    cancelOrder() {
      const url = `/market/order/cancel/{orderId}`;

      axios
        .post(
          url,
          {},
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
              clientid: this.clientId,
            },
          }
        )
        .then((response) => {
          if (response.status === 200) {
            this.$router.replace({ path: "./index" });
            // 处理成功的逻辑，例如显示消息、更新状态等
          } else {
            console.error("Error:", response.data.message);
            // 处理错误情况
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          // 处理请求错误
        });
    },
  },
};
</script>
