// pages/dog/dog.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  goSearch: function () {
    wx.navigateTo({
      url: '/pages/search-show/search-show',

    })
  },
  goSearchList: function () {
    wx.navigateTo({
      url: '/pages/search-list/search-list',

    })
  }
})