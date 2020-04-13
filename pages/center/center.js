const app = getApp();

Page({
  data: {
    access: {
      title: "获取授权",
      msg: '进行下一步操作需要',
      msg2: '获得您的公开信息(昵称、头像等)',
      cancle: '取消',
      confirm: '允许'
    },
    imgUrl: app.api.imgUrl,
    payable: 150, //待付款
    collected: 10, //待收货
    evaluated: 1,//待评价
    userInfo:{},
    isPlus: ''
  },
  toCoupon: function() {
    if (app.user.openid) {
      wx.navigateTo({
        url: '/pages/coupon/coupon',
      })
    } else {
      var box = this.selectComponent('#box');
      box._show();
    }
  },
  render(){
    if (app.user.openid) {
      this.getUrserInfo()
    }
  },
  preventTouchMove() {

  },
  onLoad: function (options) {
    // this.getUrserInfo()
    
  },
  toExperienceServiceTicket(){
    wx.navigateTo({
      url: '/pages/offline-service/offline-service'
    })
  },
  test(){
    if (wx.chooseAddress) {
      wx.chooseAddress({
        success: function (res) {
          console.log(JSON.stringify(res))
        },
        fail: function (err) {
          console.log(JSON.stringify(err))
        }
      })
    } else {
      console.log('当前微信版本不支持chooseAddress');
    }
  },
  onShow(){
    var box = this.selectComponent('#box');
    box._hide();
    this.render()
    // this.getUrserInfo()
  },
  getUrserInfo(){
    app.api.request('myInformation_api', {mId:app.user.id}, res => {
      if (res.data.code == 0) {
        this.setData({
          userInfo:res.data.data,
          isPlus: res.data.data.mInfo.plus
        })
      }
    })
  },  
  init(){

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  login:function(){
    if (!app.user.openid) {
      var box = this.selectComponent('#box');
      box._show();
    }
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

  // 地址管理
  address: function () {
    if (app.user.openid) {
      wx.navigateTo({
        url: '/pages/address/address'
      })
    }else{
      var box = this.selectComponent('#box');
      box._show();
    }
  },
  // 我的订单
  MyOrder: function (o) {
    console.log(o)
    if (app.user.openid) {
      wx.navigateTo({
        url: '/pages/MyOrder/MyOrder?target=' + o.currentTarget.dataset.target
      })
    }else{
      var box = this.selectComponent('#box');
      box._show();
    }
    
  },
  afterSale() {
    wx.navigateTo({
      url: '/pages/after-sale/after-sale',
    })
  },
  toOpenMember() {
    wx.navigateTo({
      url: '/pages/membership-open/membership-open?isPlus=' + this.data.isPlus,
    })
  },
  // 客服按钮
  serviceBtn() {
console.log(123)
  },
  toOfflineOrder() {
    wx.navigateTo({
      url: '/pages/offline-order/offline-order',
    })
  },
  toExperienceTicket() {
    wx.navigateTo({
      url: '/pages/experience-ticket/experience-ticket',
    })
  }
})