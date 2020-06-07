import { getSetting, chooseAddress, openSetting, showModal, showToast } from "../../utils/asyncWx.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
    data: {
        address: {},
        cart: [],
        allchecked: false,
        totalPrice: 0,
        totalNum: 0
    },
    onShow() {
        const address = wx.getStorageSync("address");
        const cart = wx.getStorageSync("cart") || [];
        //const allchecked = cart.length ? cart.every(v => v.checked) : false;
        this.setData({
            address
        })
        this.setCart(cart);
    },
    async handleChooseAddress() {

        try {
            const res1 = await getSetting();
            const scopeAddress = res1.authSetting["scope.address"];
            if (scopeAddress === false) {
                await openSetting();
            }
            let address = await chooseAddress();
            address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
            wx.setStorageSync("address", address)
        } catch (error) {
            console.log(error);
        }
    },
    handleItemChange(e) {
        const goods_id = e.currentTarget.dataset.id;

        let { cart } = this.data;
        let index = cart.findIndex(v => v.goods_id === goods_id);
        cart[index].checked = !cart[index].checked;
        this.setCart(cart);

    },
    setCart(cart) {
        let totalPrice = 0;
        let totalNum = 0;
        let allchecked = true;
        cart.forEach(v => {
            if (v.checked) {
                totalPrice += v.num * v.goods_price;
                totalNum += v.num;
            } else {
                allchecked = false;
            }
        })
        allchecked = cart.length != 0 ? allchecked : false;
        this.setData({
            cart,
            totalPrice,
            totalNum,
            allchecked
        });
        wx.setStorageSync("cart", cart);
    },
    handleItemAllCheck() {
        let { cart, allchecked } = this.data;
        allchecked = !allchecked;
        cart.forEach(v => v.checked = allchecked);
        this.setCart(cart);

    },
    async handleItemNumEdit(e) {


        const { operation, id } = e.currentTarget.dataset;
        let { cart } = this.data;
        const index = cart.findIndex(v => v.goods_id === id);
        if (cart[index].num === 1 && operation === -1) {

            const res = await showModal({ content: "你是否要删除？" });
            if (res.confirm) {
                cart.splice(index, 1);
                this.setCart(cart);
            }
        } else {
            cart[index].num += operation;
            this.setCart(cart);
        }

    },
    async handlePay() {
        const { address, totalNum } = this.data;
        if (!address.userName) {
            await showToast({ title: "您还没有选择收货地址" });
            return;
        }
        if (totalNum === 0) {
            await showToast({ title: "您还没有选购商品" });
            return;
        }
        wx.navigateTo({
            url: '/pages/pay/index',

        });
    }
})