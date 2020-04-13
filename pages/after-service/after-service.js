// pages/after-service/after service.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [{
      name: '卫仕化毛膏120g猫咪营养膏卫仕化毛膏120g猫咪营养膏卫仕化毛膏120g猫咪营养膏', price: 98.00, count: 1
    },
      {
        name: '卫仕化毛膏120g猫咪营养膏卫仕化毛膏120g猫咪营养膏卫仕化毛膏120g猫咪营养膏', price: 98.00, count: 1
      },
      {
        name: '卫仕化毛膏120g猫咪营养膏卫仕化毛膏120g猫咪营养膏卫仕化毛膏120g猫咪营养膏', price: 98.00, count: 1
      }],
    currentIndex: 0
  },
  toAPPREF() {
    wx.navigateTo({
      url: '/pages/APPREF/APPREF',
    })
  },
  handleClickChange(e) {
    console.log(e.currentTarget.dataset.index)
    const _index = e.currentTarget.dataset.index
    this.setData({
      currentIndex: _index
    })
  }
})