import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({


    data: {
        goods: [],
        isFocus: false,
        inpValue: ''
    },
    TimeTd: -1,
    handleInput(e) {
        const { value } = e.detail;
        if (!value.trim()) {
            this.setData({
                goods: [],
                isFocus: false
            })
            return;
        }
        this.setData({
            isFocus: true
        })
        clearTimeout(this.TimeTd);
        this.TimeTd = setTimeout(() => {
            this.qsearch(value);
        }, 1000);

    },
    async qsearch(query) {
        const res = await request({ url: "/goods/qsearch", data: { query } });
        this.setData({
            goods: res
        })

    },
    handleCancel() {
        this.setData({
            inpValue: "",
            isFocus: false,
            goods: []
        })
    }
})