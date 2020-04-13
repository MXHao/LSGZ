const app = getApp();
var page = {
    page: 1,
    limit: 5,
    total: 0,
    pages: 0,
    params: { index: 0 },
    
}
Page({
    data: {
        isAll: false,
        isShow: false,
        list: [
            '全部', '已使用', '未使用'
        ],
        coupons: [],
        conpon: [],
        usedImg: '/assets/img/home/used.png',
        currentIndex: 0
    },
    onShow() {

    },
    goBuy() {
      wx.navigateTo({
        url: '/pages/search-list/search-list',
      })
    },
    onLoad() {
        this.getData();
    },
    lower(e) {
        if (page.pages == page.page) {
            return this.setData({ isAll: true });
        }
        page.page += 1;
        this.getData();
    },
    touchItem(event) {
        // 1.取出index
        const index = event.currentTarget.dataset.index
            //2.过滤
        page.params.index = index;
        page.page = 1;
        this.setData({ isAll: false, coupons: [],currentIndex: index })
        this.getData();
    },
    getData() {
        let that = this;
        app.api.request("conpons_api", page, (res) => {
            that.setData({ coupons: this.data.coupons.concat(res.data.data.records), isAll: parseInt(res.data.data.current) >= parseInt(res.data.data.pages) })
            page.pages = res.data.data.pages;
        })
    },
  toSearchList() {
    
  }
})