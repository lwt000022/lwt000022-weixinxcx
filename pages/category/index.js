import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

    data: {
        leftMenuList: [],
        rightContent: [],
        currentIndex: 0,
        scrollTop: 0
    },
    Cates: [],


    onLoad: function(options) {
        //this.getCates();
        const Cates = wx.getStorageSync('cates');
        if (!Cates) {
            this.getCates();
        } else {
            if (Date.now() - Cates.time > 1000 * 10) {
                this.getCates();
            } else {
                this.Cates = Cates.data;
                let leftMenuList = this.Cates.map(v => v.cat_name);
                let rightContent = this.Cates[0].children;
                this.setData({
                    leftMenuList,
                    rightContent
                })
            }
        }
    },
    async getCates() {
        // request({
        //         url: "/categories"
        //     })
        //     .then(res => {
        //         this.Cates = res.data.message;
        //         wx.setStorageSync('cates', { time: Date.now(), data: this.Cates });
        //         let leftMenuList = this.Cates.map(v => v.cat_name);
        //         let rightContent = this.Cates[0].children;
        //         this.setData({
        //             leftMenuList,
        //             rightContent
        //         })
        //     })
        const res = await request({ url: "/categories" });
        this.Cates = res;
        wx.setStorageSync('cates', { time: Date.now(), data: this.Cates });
        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
            leftMenuList,
            rightContent
        })
    },
    handleItemTap(e) {
        //console.log(e);
        const { index } = e.currentTarget.dataset;

        let rightContent = this.Cates[index].children;
        this.setData({
            currentIndex: index,
            rightContent,
            scrollTop: 0
        })

    }
})