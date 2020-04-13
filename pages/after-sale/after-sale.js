// pages/after sale/after sale.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    info: [],
    tabIndex: 0,
    page: 1,
    limit: 3,
    total: 0,
    pages: 1,
  },
  lower() {
    if (this.data.page == this.data.pages) {
      return app.util.showToast("已经没有了哦");
    }
    this.data.page += 1;
    this.show();
  },
  touchItem(e) {
    this.setData({
      tabIndex: e.currentTarget.dataset.index
    })
    this.data.page = 1;
    this.data.info = [];
    this.data.total = 0;
    this.show();
  },
  onShow(){
    this.data.page = 1;
    this.data.info = [];
    this.data.total = 0;
    this.show();
  },
  show() {
    app.api.request("selectRefund", {
      type: this.data.tabIndex == 0 ? 1 : -1,
      ...this.data
    }, res => {
      res.data.data.list.forEach(o => {
        let count = 0;
        let countPrice = 0;
        o.product.forEach(i => {
          count += i.num;
          countPrice += i.num * i.price
          switch (parseInt(i.status)) {
            case 0:
              i.statusText = '买家发起申请'
              break;
            case 1:
              i.statusText = '卖家同意申请'
              break;
            case 2:
              i.statusText = '卖家不同意申请'
              break;
            case 3:
              i.statusText = '买家发货'
              break;
            case 4:
              i.statusText = '卖家同意退款'
              break;
            case 5:
              i.statusText = '取消退款'
              break;
          }
        })
        o.count = count;
        o.countPrice = countPrice;
      })
      this.setData({
        info: [...this.data.info, ...res.data.data.list],
        pages: parseInt((res.data.data.total + this.data.limit - 1) / this.data.limit)
      })
    })
  },
  toNumberEntry(e) {
    wx.navigateTo({
      url: '/pages/number-entry/number-entry?obj=' + encodeURIComponent(JSON.stringify(e.currentTarget.dataset.item)),
    })
  }
})