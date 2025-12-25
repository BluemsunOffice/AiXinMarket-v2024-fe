import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import Axios from '../views/Axios';
import { useRouter } from 'vue-router';

export const useCartStore = defineStore('cartStore', () => {

    const cartItems: any = ref([]);
    const filteredItems: any = ref([...cartItems.value]);
    const selectedItems: any = ref([]);
    const userBalance: any = ref([]);
    const checkoutInfo: any = ref(false);  // 用于控制弹窗的显示
    const isAllSelected: any = ref(false);
    const isSettling: any = ref(false);
    const isLoading: any = ref(true);  // 添加加载状态变量，默认为加载中

    // 定义路由
    const router = useRouter(); 
    
    const toHome = () => {
        console.log('跳转');
        router.push('/home');
    };

    // 获取用户购物车商品
    async function getItem() {
        isLoading.value = true; // 开始加载
        try {
            const response = await Axios.get('http://59.110.62.188:8080/market/cart/list');
            console.log('getItem', response.data.data);
            
            // 整理购物车数据，将相同商品合并
            if (response.data.data && Array.isArray(response.data.data)) {
                const mergedItems: any[] = [];
                const itemMap = new Map<number, any>();
                
                // 遍历所有项目，将相同goodsId的项目合并
                response.data.data.forEach((item: any) => {
                    if (itemMap.has(item.goodsId)) {
                        // 如果已经存在相同商品，更新数量
                        const existingItem = itemMap.get(item.goodsId);
                        existingItem.num += item.num;
                        
                        // 确保数量不超过限制
                        if (existingItem.num > existingItem.limitNum) {
                            existingItem.num = existingItem.limitNum;
                        }
                    } else {
                        // 否则添加新项目
                        itemMap.set(item.goodsId, {...item});
                        mergedItems.push(itemMap.get(item.goodsId));
                    }
                });
                
                cartItems.value = mergedItems;
                
                // 使用Promise.all等待所有库存信息获取完成
                const stockPromises = cartItems.value.map(async (item: any) => {
                    try {
                        const stockResponse = await Axios.get(`http://59.110.62.188:8080/market/goods/${item.goodsId}`);
                        if (stockResponse.data.code === 200 && stockResponse.data.data) {
                            const currentStock = stockResponse.data.data.amount;
                            item.limitNum = currentStock; // 更新库存信息
                            
                            // 如果当前数量超过库存，则调整数量
                            if (item.num > currentStock) {
                                item.num = currentStock;
                            }
                        }
                    } catch (error) {
                        console.error(`获取商品 ${item.goodsId} 的库存信息失败:`, error);
                    }
                });
                
                // 等待所有库存信息获取完成
                await Promise.all(stockPromises);
            } else {
                cartItems.value = response.data.data || [];
            }
            
            // 在所有库存信息更新后再设置filteredItems
            filteredItems.value = [...cartItems.value];
        } catch (error) {
            console.log(error);
        } finally {
            isLoading.value = false; // 无论成功与否，加载结束
        }
    }

    // 获取用户余额
    async function getCurrency() {      
        Axios.get('http://59.110.62.188:8080/market/balance')
        .then(function (response) {
            userBalance.value = response.data.data;
            console.log('userBalance', userBalance.value);
        })
        .catch(function (error) {
            console.log(error);
        }); 
    }

    // 计算服装币和日用币的总价
    const clothingTotal = computed(() => {
        return selectedItems.value.reduce((total: number, id: any) => {
            const item = cartItems.value.find((item: { goodsId: any; currencyType: string; }) => item.goodsId === id && item.currencyType === '1');
            return total + (item ? item.price * item.num : 0);
        }, 0);
    });

    const dailyTotal = computed(() => {
        return selectedItems.value.reduce((total: number, id: any) => {
            const item = cartItems.value.find((item: { goodsId: any; currencyType: string; }) => item.goodsId === id && item.currencyType === '0');
            return total + (item ? item.price * item.num : 0);
        }, 0);
    });

    // 移除选中的商品
    const removeSelectedItems = async (itemId: any) => {
        var removeItem = { ids: [itemId] };
        try {
            const response = await Axios.delete(`http://59.110.62.188:8080/market/cart/${removeItem.ids.join(',')}`);
        
    
            if (response.data.code == 200) {
                cartItems.value = cartItems.value.filter((item: { goodsId: any; }) => item.goodsId !== itemId);
                filteredItems.value = filteredItems.value.filter((item: { goodsId: any; }) => item.goodsId !== itemId);
                ElMessage.success('选中商品删除成功');
            } else {
                ElMessage.warning('删除商品失败，请稍后重试！');
            }
        } catch (error) {
            console.error('删除商品时出错:', error);
            ElMessage.error('删除商品时出现错误！');
        }
    };

    // 更新选中商品的总价
    const updateSelectedTotalPrice = () => {
        // 计算总价会自动更新，因为使用了计算属性
    };

    // 格式化价格
    const formatPrice = (row: { price: number; }) => {
        return `¥${row.price.toFixed(2)}`;
    };

    // 显示结算信息（打开弹窗）
    const checkout = () => {
        if (selectedItems.value.length > 0) {
            checkoutInfo.value = true;  // 显示弹窗
        } else {
            ElMessage.warning('购物车没有选中的商品，无法结算！');
        }
    };

    // 结算防抖定时器
    let settleDebounceTimer: ReturnType<typeof setTimeout> | null = null;
    // 上次结算请求时间
    let lastSettleTime = 0;
    // 结算防抖时间间隔(毫秒)
    const settleDebounceInterval = 2000;

    // 确认结算
    const reCheckout = async () => {
        // 如果已经在处理结算，直接返回
        if (isSettling.value) {
            return;
        }

        // 检查是否在防抖时间内
        const now = Date.now();
        if (now - lastSettleTime < settleDebounceInterval) {
      
            return;
        }

        // 设置最后结算时间
        lastSettleTime = now;

        // 准备要结算的商品
        const selectedItemsData = selectedItems.value.map((id: any) => {
            const item = cartItems.value.find((item: { goodsId: any; }) => item.goodsId === id);
            return {
                goodsId: item.goodsId,
                num: item.num,
            };
        });
    
        const payload = {
            carts: selectedItemsData, // 形成请求体
        };

        // 本地先更新UI，标记为处理中
        isSettling.value = true;

        // 如果有前一个定时器，取消它
        if (settleDebounceTimer) {
            clearTimeout(settleDebounceTimer);
        }

        try {
            // 发送结算请求
            const response = await Axios.post('http://59.110.62.188:8080/market/cart/settle', payload);
            console.log('结算response', response); 
            console.log('response.data.code', response.data.code);
            
            if (response.data.code == 200) {
                // 结算成功的处理逻辑
                userBalance.value.clothingBalance -= clothingTotal.value;
                userBalance.value.generalBalance -= dailyTotal.value;
                
                // 移除选中的商品
                const successIds = selectedItems.value;
                cartItems.value = cartItems.value.filter((item: { goodsId: any; }) => 
                    !successIds.includes(item.goodsId));
                filteredItems.value = [...cartItems.value];
                
                selectedItems.value = [];
                checkoutInfo.value = false; // 结算后关闭弹窗
                
                ElMessage.success('结算成功');
                
                // 刷新用户余额和购物车数据
                getCurrency();
                getItem();
    
                isAllSelected.value = false; // 取消全选状态
            } else if (response.data.code == 500) {  
                const warning = response.data.msg;
                // 使用更引人注意的方式显示错误消息
                ElMessageBox.alert(warning, '结算失败', {
                    confirmButtonText: '确定',
                    type: 'warning',
                });
            } else {
                ElMessage.warning('结算失败，请稍后重试');
            }
        } catch (error) {
            console.error(error);
            ElMessage.error('结算过程中出现错误！');
        } finally {
            // 无论成功失败，在2秒后才结束处理状态，防止用户频繁点击
            settleDebounceTimer = setTimeout(() => {
                isSettling.value = false;
                settleDebounceTimer = null;
            }, settleDebounceInterval);
        }
    };

    // 切换全选状态
    const toggleSelectAll = () => {
        if (isAllSelected.value) {
            selectedItems.value = filteredItems.value.map((item: { goodsId: any; }) => item.goodsId);
        } else {
            selectedItems.value = [];
        }
    };

    // 监听 selectedItems 变化，更新全选按钮的状态
    watch(selectedItems, (newSelectedItems) => {
        isAllSelected.value = newSelectedItems.length === filteredItems.value.length;
    });  

    // 使用一个Map来存储每个商品最后一次发送请求的时间
    const lastUpdateTimeMap = new Map<number, number>();
    // 使用一个Map来存储每个商品的更新请求队列
    const pendingUpdates = new Map<number, {quantity: number, timestamp: number}>();
    // 防抖时间间隔（毫秒）
    const debounceInterval = 2000;

    // 更新商品数量的方法
    const updateItemQuantity = async (itemId: number, newQuantity: number) => {
        try {
            // 找到对应的商品
            const item = cartItems.value.find((item: { goodsId: number }) => item.goodsId === itemId);
            if (!item) {
                ElMessage.warning('商品不存在');
                return;
            }

            // 检查是否超过库存限制
            if (newQuantity > item.limitNum) {
                newQuantity = item.limitNum;
                ElMessage.warning(`商品数量已调整为库存上限: ${item.limitNum}`);
            }

            // 立即在本地更新数量
            item.num = newQuantity;
            
            // 记录当前时间
            const now = Date.now();
            
            // 添加到待更新队列
            pendingUpdates.set(itemId, {
                quantity: newQuantity,
                timestamp: now
            });
            
            // 检查是否需要发送请求
            const lastUpdateTime = lastUpdateTimeMap.get(itemId) || 0;
            if (now - lastUpdateTime >= debounceInterval) {
                // 可以发送请求，更新最后发送时间
                lastUpdateTimeMap.set(itemId, now);
                
                // 发送请求
                await syncItemToServer(itemId);
            } else {
                // 设置一个定时器，在间隔结束后发送请求
                setTimeout(async () => {
                    // 检查是否仍需要发送请求
                    const pendingUpdate = pendingUpdates.get(itemId);
                    if (pendingUpdate && now === pendingUpdate.timestamp) {
                        // 更新最后发送时间
                        lastUpdateTimeMap.set(itemId, Date.now());
                        
                        // 发送请求
                        await syncItemToServer(itemId);
                    }
                }, debounceInterval - (now - lastUpdateTime));
            }
        } catch (error) {
            console.error('更新商品数量时出错:', error);
            ElMessage.error('更新商品数量时出现错误！');
        }
    };
    
    // 将商品数据同步到服务器
    const syncItemToServer = async (itemId: number) => {
        try {
            // 获取最新的待更新数据
            const pendingUpdate = pendingUpdates.get(itemId);
            if (!pendingUpdate) return;
            
            // 清除此商品的待更新记录
            pendingUpdates.delete(itemId);
            
            // 找到对应的商品
            const item = cartItems.value.find((item: { goodsId: number }) => item.goodsId === itemId);
            if (!item) return;
            
            // 请求体结构
            const payload = {
                goodsId: item.goodsId,
                num: pendingUpdate.quantity,
                imgUrl: item.imageUrlUrl,
                goodsName: item.goodsName,
            };
            
            // 获取最新的商品库存信息（可选，因为我们已经在本地进行了限制）
            try {
                const stockResponse = await Axios.get(`http://59.110.62.188:8080/market/goods/${item.goodsId}`);
                if (stockResponse.data.code === 200 && stockResponse.data.data) {
                    const currentStock = stockResponse.data.data.amount;
                    
                    // 更新本地库存限制
                    item.limitNum = currentStock;
                    
                    // 如果请求的数量超过最新库存，调整数量
                    if (payload.num > currentStock) {
                        payload.num = currentStock;
                        item.num = currentStock;
                        ElMessage.warning(`商品库存已更新，数量已调整为${currentStock}`);
                    }
                }
            } catch (error) {
                console.error('获取最新库存信息失败:', error);
            }

            // 调用后端接口更新数量
            const response = await Axios.put('http://59.110.62.188:8080/market/cart', payload);

            if (response.data.code === 200) {
                // 显示成功提示消息
                
                console.log('商品数量已同步到服务器');
            } else {
                ElMessage.warning(response.data.msg || '更新商品数量失败，请稍后重试！');
            }
        } catch (error) {
            console.error('同步商品数量到服务器时出错:', error);
        }
    };

    return {
        router,
        cartItems, 
        filteredItems,
        selectedItems,
        userBalance,
        clothingTotal,
        dailyTotal,
        checkoutInfo,
        isAllSelected,
        isSettling,
        isLoading,
        getItem,
        getCurrency,
        removeSelectedItems,
        checkout,
        reCheckout,
        toggleSelectAll, 
        updateSelectedTotalPrice,
        formatPrice,
        toHome,
        updateItemQuantity,
    }
});
