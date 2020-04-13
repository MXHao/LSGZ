// pages/APPREF/APPREF.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: null,
    orderType: '',
    orderType: ''
  },
  onLoad(e) {
    console.log(e)
    this.setData({
      item: e.item,
      orderType: e.type
    })
    let product = JSON.parse(decodeURIComponent(e.item));
  },
  toAfterServiceWrite1(e) {
    wx.redirectTo({
      url: "/pages/after-service-write/after-service-write?isShow=" + 1 + "&item=" + this.data.item + "&type=" + this.data.orderType,
    })
  },
  toAfterServiceWrite2(e) {
    wx.redirectTo({
      url: "/pages/after-service-write/after-service-write?isShow=" + 0 + "&item=" + this.data.item + "&type=" + this.data.orderType,
    })
  }
})