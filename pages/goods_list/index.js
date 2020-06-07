import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

    data: {
        tabs: [{
                id: 0,
                value: "综合",
                isActive: true
            },
            {
                id: 1,
                value: "销量",
                isActive: false
            },
            {
                id: 2,
                value: "价格",
                isActive: false
            }
        ],
        goodsList: []
    },
    QueryParams: {
        query: "",
        cid: "",
        pagenum: 1,
        pagesize: 10
    },
    totalPages: 1,

    onLoad: function(options) {
        //console.log(options);
        this.QueryParams.cid = options.cid || "";
        this.QueryParams.query = options.query || "";
        this.getGoodsList();
        wx.showLoading({
            title: '加载中',
        })

        setTimeout(function() {
            wx.hideLoading()
        }, 5000)
    },
    async getGoodsList() {
        const res = await request({ url: "/goods/search", data: this.QueryParams });
        //console.log(res);
        const total = res.total;
        this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
        //console.log(this.totalPages);
        this.setData({
            goodsList: [...this.data.goodsList, ...res.goods]
        })
        wx.stopPullDownRefresh();
    },
    handleTabsItemChange(e) {
        //console.log(e);
        const { index } = e.detail;
        let { tabs } = this.data;
        tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
        this.setData({
            tabs
        })

    },
    onReachBottom() {
        //console.log('页面触底');
        if (this.QueryParams.pagenum >= this.totalPages) {
            wx.showToast({
                title: '没有下一页数据'

            });
        } else {
            this.QueryParams.pagenum++;
            this.getGoodsList();
        }

    },
    onPullDownRefresh() {
        //Console.log('刷新');
        this.setData({
            goodsList: []

        })
        this.QueryParams.pagenum = 1;
        this.getGoodsList();
    }

})