const app = getApp();
var WxParse = require('../../assets/wxParse/wxParse.js');                  
Page({

  /**
   * 页面的初始数据
   */
  data: {
      url:'',
      type:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({'type':options.type})
    if(options.type==2){
      app.api.request('selectBannerInfo', {
        "site": 0,
        "mid": app.user.id,
        "bid": options.id
      }, res => {
        WxParse.wxParse('article', 'html', res.data.data.v, that, 5)
      })
    }else{
      that.setData({ 'url': options.url })
    }
    

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

})