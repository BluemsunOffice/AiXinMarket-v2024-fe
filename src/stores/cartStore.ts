import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import { cartApi, type CartBalance, type CartItem } from "@/api/cart.api";

interface PendingQuantityUpdate {
  quantity: number;
  timer: ReturnType<typeof setTimeout> | null;
}

const UPDATE_DEBOUNCE_MS = 400;

export const useCartStore = defineStore("cartStore", () => {
  const router = useRouter();

  const cartItems = ref<CartItem[]>([]);
  const filteredItems = computed(() => cartItems.value);
  const selectedItems = ref<string[]>([]);
  const userBalance = ref<CartBalance>({
    generalBalance: 0,
    clothingBalance: 0,
  });

  const checkoutDialogVisible = ref(false);
  const isLoading = ref(true);
  const isSettling = ref(false);

  const pendingQuantityUpdates = new Map<string, PendingQuantityUpdate>();

  const isAllSelected = computed({
    get: () => {
      if (filteredItems.value.length === 0) {
        return false;
      }
      return selectedItems.value.length === filteredItems.value.length;
    },
    set: (checked: boolean) => {
      selectedItems.value = checked
        ? filteredItems.value.map((item) => item.goodsId)
        : [];
    },
  });

  const selectedCartItems = computed(() => {
    return cartItems.value.filter((item) => selectedItems.value.includes(item.goodsId));
  });

  const clothingTotal = computed(() => {
    return selectedCartItems.value.reduce((total, item) => {
      if (item.currencyType === "1") {
        return total + item.price * item.num;
      }
      return total;
    }, 0);
  });

  const dailyTotal = computed(() => {
    return selectedCartItems.value.reduce((total, item) => {
      if (item.currencyType === "0") {
        return total + item.price * item.num;
      }
      return total;
    }, 0);
  });

  const formatPrice = (row: { price: number }) => `¥${row.price.toFixed(2)}`;

  const toHome = () => {
    router.push("/home");
  };

  const mergeCartItems = (items: CartItem[]) => {
    const itemMap = new Map<string, CartItem>();

    items.forEach((item) => {
      const goodsId = item.goodsId;
      const existing = itemMap.get(goodsId);

      if (existing) {
        existing.num += item.num;
      } else {
        itemMap.set(goodsId, {
          ...item,
          goodsId,
        });
      }
    });

    return Array.from(itemMap.values());
  };

  const refreshStockLimit = async (item: CartItem) => {
    console.log(`正在刷新商品 ${item.goodsId} 的库存限制...`);
    try {
      const detailResp = await cartApi.goodsDetail(item.goodsId);
      console.log(`商品 ${item.goodsId} 库存信息:`, detailResp.data);
      const latestAmount = Number(detailResp.data?.amount ?? item.limitNum ?? 0);
      item.limitNum = latestAmount;
      if (item.num > latestAmount) {
        item.num = latestAmount;
      }
    } catch (error) {
      console.error(`获取商品 ${item.goodsId} 库存失败:`, error);
    }
  };

  const getItem = async () => {
    isLoading.value = true;
    try {
      const listResp = await cartApi.list();
      const list = Array.isArray(listResp.data) ? listResp.data : [];
      console.log("原始购物车数据:", list);

      const mergedItems = mergeCartItems(list);
      await Promise.all(mergedItems.map((item) => refreshStockLimit(item)));

      cartItems.value = mergedItems;
      console.log("购物车商品列表:", cartItems.value);

      const validIds = new Set(mergedItems.map((item) => item.goodsId));
      selectedItems.value = selectedItems.value.filter((id) => validIds.has(id));
    } catch (error) {
      console.error("获取购物车失败:", error);
      ElMessage.error("获取购物车失败，请稍后重试");
    } finally {
      isLoading.value = false;
    }
  };

  const getCurrency = async () => {
    try {
      const balanceResp = await cartApi.balance();
      userBalance.value = {
        generalBalance: Number(balanceResp.data?.generalBalance ?? 0),
        clothingBalance: Number(balanceResp.data?.clothingBalance ?? 0),
      };
    } catch (error) {
      console.error("获取余额失败:", error);
    }
  };

  const initCartPage = async () => {
    await Promise.allSettled([getItem(), getCurrency()]);
  };

  const toggleSelectAll = (checked: boolean) => {
    isAllSelected.value = checked;
  };

  const updateSelectedTotalPrice = () => {
    return;
  };

  const removeSelectedItems = async (itemId: string) => {
    try {
      const response = await cartApi.remove([itemId]);
      if (response.code === 200) {
        cartItems.value = cartItems.value.filter((item) => item.goodsId !== itemId);
        selectedItems.value = selectedItems.value.filter((id) => id !== itemId);
        ElMessage.success("商品移除成功");
      } else {
        ElMessage.warning("删除商品失败，请稍后重试");
      }
    } catch (error) {
      console.error("删除商品失败:", error);
      ElMessage.error("删除商品失败，请稍后重试");
    }
  };

  const checkout = () => {
    if (selectedItems.value.length === 0) {
      ElMessage.warning("请先选择商品再结算");
      return;
    }
    checkoutDialogVisible.value = true;
  };

  const reCheckout = async () => {
    if (isSettling.value || selectedItems.value.length === 0) {
      return;
    }

    isSettling.value = true;
    try {
      const carts = selectedCartItems.value.map((item) => ({
        goodsId: item.goodsId,
        num: item.num,
      }));

      const response = await cartApi.settle({ carts });
      if (response.code === 200) {
        ElMessage.success("结算成功");
        selectedItems.value = [];
        checkoutDialogVisible.value = false;
        await initCartPage();
        return;
      }

      if (response.code === 500) {
        await ElMessageBox.alert(response.message || "结算失败", "结算失败", {
          confirmButtonText: "确定",
          type: "warning",
        });
        return;
      }

      ElMessage.warning(response.message || "结算失败，请稍后重试");
    } catch (error) {
      console.error("结算失败:", error);
      ElMessage.error("结算失败，请稍后重试");
    } finally {
      isSettling.value = false;
    }
  };

  const syncItemToServer = async (itemId: string, quantity: number) => {
    const item = cartItems.value.find((cartItem) => cartItem.goodsId === itemId);
    if (!item) {
      return;
    }

    await refreshStockLimit(item);
    const finalQuantity = Math.min(quantity, item.limitNum);
    item.num = finalQuantity;

    const payload = {
      goodsId: item.goodsId,
      num: finalQuantity,
      imgUrl: item.imageUrlUrl,
      goodsName: item.goodsName,
    };

    const response = await cartApi.update(payload);
    if (response.code !== 200) {
      ElMessage.warning(response.message || "更新商品数量失败，请稍后重试");
    }
  };

  const updateItemQuantity = async (itemId: string, newQuantity: number) => {
    const item = cartItems.value.find((cartItem) => cartItem.goodsId === itemId);
    if (!item) {
      return;
    }

    const normalizedQuantity = Math.max(0, Math.min(newQuantity, item.limitNum));
    item.num = normalizedQuantity;

    const pending = pendingQuantityUpdates.get(itemId);
    if (pending?.timer) {
      clearTimeout(pending.timer);
    }

    const timer = setTimeout(async () => {
      const latest = pendingQuantityUpdates.get(itemId);
      if (!latest) {
        return;
      }

      try {
        await syncItemToServer(itemId, latest.quantity);
      } catch (error) {
        console.error("同步商品数量失败:", error);
      } finally {
        pendingQuantityUpdates.delete(itemId);
      }
    }, UPDATE_DEBOUNCE_MS);

    pendingQuantityUpdates.set(itemId, {
      quantity: normalizedQuantity,
      timer,
    });
  };

  return {
    router,
    cartItems,
    filteredItems,
    selectedItems,
    userBalance,
    checkoutDialogVisible,
    isAllSelected,
    isSettling,
    isLoading,
    clothingTotal,
    dailyTotal,
    getItem,
    getCurrency,
    initCartPage,
    removeSelectedItems,
    checkout,
    reCheckout,
    toggleSelectAll,
    updateSelectedTotalPrice,
    formatPrice,
    toHome,
    updateItemQuantity,
  };
});
