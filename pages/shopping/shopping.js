const app = getApp();
// pages/NewOffer/NewOffer.js
Page({
      
  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    scrollLeft: 0,
    tabs: ['猫主粮', '狗主粮', '猫零食', '狗零食', '其他'],
    tailList: [],
    detail: {},
    imgUrl: ''
    
  },
  tabSelect(e) {
    console.log(e.currentTarget.dataset.id)
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  GroupDetails: function() {
    wx.navigateTo({
      url: '/pages/product-Details/product-Details',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let baseUrl = app.api.imgUrl
    this.setData({
      imgUrl: baseUrl
    })
    console.log(this.data.imgUrl)
    app.api.request('getTailGoods_api', {}, res => {
      console.log(res)
      this.setData({
        tailList: res.data.data.tailList
      })
    })
  }
})