// pages/offline-order/offline-order.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    limit: 6,
    details: [],
    total: 0
  },
  onLoad() {
    this.init();
  },
  init() {
    app.api.request('getOfflineOrder', {
      page: this.data.page,
      limit: this.data.limit
    }, res => {
    if(res.data.code == 0) {
      res.data.data.list.forEach(i=>{
           i['isR'] =  i.orderDetails.filter(o => o.status != 3 && o.status != 2).length > 0
      })
      this.setData({
        details: res.data.data.list,
        total: res.data.data.total
      })
    }
    })
  },
  handleContact(e) {
    console.log(e)
  },
  onReachBottom: function () {
    var that = this;
    if (that.data.details.length < this.data.total) {
      // 显示加载图标
      wx.showLoading({
        title: '玩命加载中',
      })
      // 页数+1
      that.data.page = that.data.page + 1;
      app.api.request('getOfflineOrder', {
        'limit': 6,
        'page': that.data.page
      }, res => {
        const newProListTmp = that.data.details.concat(res.data.data.list);
        that.setData({
          details: newProListTmp
        })
      })
      // wx.hideLoading();
    } else {
      wx.showToast({
        title: '已经没有了哦',
        icon: 'none',
      })
    }

  },
  appRefound(e){
    let data = e.currentTarget.dataset.item
    data.orderDesc = data.orderDetails
    wx.navigateTo({
      url: '/pages/APPREF/APPREF?item=' + encodeURIComponent(JSON.stringify(data)) + "&type=" + "offline",
    })
      console.log(e)
  },
  handleContact(e) {
console.log(e)
  }
})