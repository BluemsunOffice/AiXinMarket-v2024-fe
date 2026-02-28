import { computed, reactive, ref } from "vue";
import { defineStore } from "pinia";
import { ElMessage } from "element-plus";
import {
    manageGoodsApi,
    type GoodsCurrencyType,
    type GoodsLimitType,
    type GoodsStatus,
    type GoodsType,
    type ManageGoodsItem,
    type SaveGoodsPayload,
} from "@/api/manage-goods.api";

interface GoodsFormModel {
    id?: string;
    name: string;
    price: number | null;
    currencyType: GoodsCurrencyType;
    type: GoodsType;
    status: GoodsStatus;
    intro: string;
    limitNum: number | null;
    limitType: GoodsLimitType;
    imageUrl: string;
    imageUrlUrl: string;
    amount: number | null;
}

const defaultForm = (): GoodsFormModel => ({
    id: undefined,
    name: "",
    price: null,
    currencyType: "0",
    type: "0",
    status: "0",
    intro: "",
    limitNum: 1,
    limitType: "0",
    imageUrl: "",
    imageUrlUrl: "",
    amount: null,
});

export const useManageGoodsStore = defineStore("manageGoods", () => {
    const goodsList = ref<ManageGoodsItem[]>([]);
    const loading = ref(false);
    const total = ref(0);
    const selectedIds = ref<string[]>([]);

    const pager = reactive({
        pageNum: 1,
        pageSize: 8,
    });

    const formDialogVisible = ref(false);
    const restockDialogVisible = ref(false);
    const submitting = ref(false);

    const formModel = reactive<GoodsFormModel>(defaultForm());
    const currentEditId = ref<string>("");
    const restockGoodsId = ref("");
    const restockGoodsName = ref("");
    const restockAmount = ref<number | null>(null);

    const isEditing = computed(() => Boolean(currentEditId.value));

    const resetFormModel = () => {
        Object.assign(formModel, defaultForm());
        currentEditId.value = "";
    };

    const fetchGoods = async () => {
        loading.value = true;
        try {
            const response = await manageGoodsApi.getGoodsList({
                pageNum: pager.pageNum,
                pageSize: pager.pageSize,
            });
            if (response.code === 200) {
                goodsList.value = response.rows || [];
                total.value = response.total || 0;
                return;
            }
            goodsList.value = [];
            total.value = 0;
            ElMessage.error(response.message || response.msg || "商品列表加载失败");
        } catch (error) {
            goodsList.value = [];
            total.value = 0;
            ElMessage.error("商品列表加载失败，请稍后重试");
        } finally {
            loading.value = false;
        }
    };

    const changePage = async (pageNum: number) => {
        pager.pageNum = pageNum;
        await fetchGoods();
    };

    const setSelectedRows = (rows: ManageGoodsItem[]) => {
        selectedIds.value = rows.map((row) => row.id);
    };

    const deleteGoods = async (ids: string[]) => {
        if (!ids.length) {
            ElMessage.warning("请选择要删除的商品");
            return;
        }

        try {
            const response = await manageGoodsApi.deleteGoods(ids);
            if (response.code === 200) {
                ElMessage.success("删除成功");
                selectedIds.value = [];
                await fetchGoods();
                return;
            }
            ElMessage.error(response.message || response.msg || "删除失败");
        } catch (error) {
            ElMessage.error("删除失败，请稍后重试");
        }
    };

    const openCreateDialog = () => {
        resetFormModel();
        formDialogVisible.value = true;
    };

    const openEditDialog = async (item: ManageGoodsItem) => {
        try {
            const response = await manageGoodsApi.getGoodsDetail(item.id);
            if (response.code !== 200) {
                ElMessage.error(response.message || response.msg || "加载商品详情失败");
                return;
            }

            const detail = response.data;
            currentEditId.value = detail.id;
            formModel.id = detail.id;
            formModel.name = detail.name;
            formModel.price = Number(detail.price);
            formModel.currencyType = String(detail.currencyType) as GoodsCurrencyType;
            formModel.type = String(detail.type) as GoodsType;
            formModel.status = String(detail.status) as GoodsStatus;
            formModel.intro = detail.intro || "";
            formModel.limitNum = Number(detail.limitNum ?? 1);
            formModel.limitType = String(detail.limitType ?? "0") as GoodsLimitType;
            formModel.imageUrl = detail.imageUrl;
            formModel.imageUrlUrl = detail.imageUrlUrl || "";
            formModel.amount = Number(detail.amount ?? 0);

            formDialogVisible.value = true;
        } catch (error) {
            ElMessage.error("加载商品详情失败");
        }
    };

    const uploadImage = async (file: File) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            ElMessage.error("仅支持 JPG/PNG/GIF/WEBP 图片");
            return;
        }

        try {
            const uploadResponse = await manageGoodsApi.uploadImage(file);
            if (uploadResponse.code !== 200 || !uploadResponse.data?.ossId) {
                ElMessage.error(uploadResponse.message || uploadResponse.msg || "上传失败");
                return;
            }

            formModel.imageUrl = uploadResponse.data.ossId;

            const imageResponse = await manageGoodsApi.getOssAssets(uploadResponse.data.ossId);
            if (imageResponse.code === 200 && imageResponse.data?.length) {
                formModel.imageUrlUrl = imageResponse.data[0].url;
            }
            ElMessage.success("图片上传成功");
        } catch (error) {
            ElMessage.error("图片上传失败，请稍后重试");
        }
    };

    const submitGoods = async () => {
        if (!formModel.name.trim()) {
            ElMessage.warning("请输入商品名称");
            return false;
        }
        if (formModel.price === null || Number(formModel.price) < 0) {
            ElMessage.warning("请输入有效的商品价格");
            return false;
        }
        if (!formModel.imageUrl) {
            ElMessage.warning("请先上传商品图片");
            return false;
        }

        submitting.value = true;
        try {
            const payload: SaveGoodsPayload = {
                id: currentEditId.value || undefined,
                name: formModel.name.trim(),
                price: Number(formModel.price),
                currencyType: formModel.currencyType,
                type: formModel.type,
                status: formModel.status,
                barcode: "1",
                intro: formModel.intro.trim(),
                limitNum: Number(formModel.limitNum || 1),
                limitType: formModel.limitType,
                quantifier: "1",
                imageUrl: formModel.imageUrl,
                amount: isEditing.value ? Number(formModel.amount || 0) : undefined,
            };

            const response = isEditing.value
                ? await manageGoodsApi.updateGoods(payload)
                : await manageGoodsApi.createGoods(payload);

            if (response.code === 200) {
                ElMessage.success(isEditing.value ? "修改成功" : "新增成功");
                formDialogVisible.value = false;
                await fetchGoods();
                return true;
            }

            ElMessage.error(response.message || response.msg || "保存失败");
            return false;
        } catch (error) {
            ElMessage.error("保存失败，请稍后重试");
            return false;
        } finally {
            submitting.value = false;
        }
    };

    const openRestockDialog = (item: ManageGoodsItem) => {
        restockGoodsId.value = item.id;
        restockGoodsName.value = item.name;
        restockAmount.value = null;
        restockDialogVisible.value = true;
    };

    const submitRestock = async () => {
        if (!restockGoodsId.value) {
            return false;
        }
        if (!restockAmount.value || restockAmount.value <= 0) {
            ElMessage.warning("请输入大于 0 的进货数量");
            return false;
        }

        try {
            const response = await manageGoodsApi.restockGoods({
                goodsId: restockGoodsId.value,
                amount: Number(restockAmount.value),
            });
            if (response.code === 200) {
                ElMessage.success("进货成功");
                restockDialogVisible.value = false;
                await fetchGoods();
                return true;
            }
            ElMessage.error(response.message || response.msg || "进货失败");
            return false;
        } catch (error) {
            ElMessage.error("进货失败，请稍后重试");
            return false;
        }
    };

    return {
        goodsList,
        loading,
        total,
        selectedIds,
        pager,
        formDialogVisible,
        restockDialogVisible,
        submitting,
        formModel,
        restockGoodsName,
        restockAmount,
        isEditing,

        fetchGoods,
        changePage,
        setSelectedRows,
        deleteGoods,
        openCreateDialog,
        openEditDialog,
        uploadImage,
        submitGoods,
        openRestockDialog,
        submitRestock,
    };
});
