const app = getApp();
Page({
  data: {
    terminal:1,
    goodsList: [],
    cecommen:[],
    price:0,
   isShow:false,
  coupon:[]
  },
  onLoad(o) {
    this.data.terminal=o.terminal
    this.setData({price:o.price})
    app.api.request("couponDelivery", { orderNo:o.id},res=>{
      this.setData({ coupon: res.data.data, isShow: res.data.data.length>0})
    })
    app.api.request("selectCecommendProduct", { type:1},res=>{
      this.setData({ cecommen:res.data.data})
    })
  },
  cloeseBox(){
    this.setData({ isShow:false})
  },
  // 返回首页
  goHome() {
    wx.switchTab({
      url: '/pages/home/home',
    })
  },
  productDetails: function (e) {
    var res = e.currentTarget.dataset.index
    wx.redirectTo({
      url: '/pages/product-Details/product-Details?id=' + res.i + "&sou=" + res.sou,
    })
  },
  goOrder(){
    let url = this.data.terminal == 2 ? "/pages/offline-order/offline-order" :"/pages/MyOrder/MyOrder?target=0"
    wx.navigateTo({
      url: url,
    })
  },
  init(){
    app.api.request('addCart_api', {
      "mId": app.user.id,
    }, res => {
      console.log(res)
      if (res.data.code == 0) {
          
      }
    })
  },
  //加入购物车
  addCart(e) {
    if (app.user.openid) {
      app.api.request('addCart_api', {
        "pId": e.currentTarget.dataset.target.i,
        "mId": app.user.id,
        "num": 1

      }, res => {
        console.log(res)
        if (res.data.code == 0) {
          this.data.goodsList.forEach((res, index) => {
            if (res.i == e.currentTarget.dataset.target.i) {
              var o = "carts[" + index + "].sum"
              e.currentTarget.dataset.target.sss++
              this.setData({
                [o]: e.currentTarget.dataset.target.sss
              })
            }
          })
          wx.showToast({
            title: '加入购物车',
            icon: 'success',
            duration: 2000
          })
        }
      })
    } else {
      var box = this.selectComponent('#box');
      box._show();
    }

  },
  goDetails(e) {
    console.log(e)
    var res = e.currentTarget.dataset.target

    wx.navigateTo({
      url: '/pages/product-Details/product-Details?id=' + res.i + "&sou=" + res.sou,

    })
  },

})