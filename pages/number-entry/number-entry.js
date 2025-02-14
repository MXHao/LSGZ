// pages/number-entry/number-entry.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{},
    text:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data= JSON.parse(decodeURIComponent(options.obj))
    this.data.info=data;
  },
  inputT(e){
    this.data.text= e.detail.value
  },
  submit(){
    if(this.data.text.length==0){
      return app.util.showToast('快递单号不能为空')
    }
    app.api.request("updateRefund", { fId: this.data.info.fId, transCode:this.data.text},res=>{
      wx.navigateBack({
        delta:1
      })
    })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})