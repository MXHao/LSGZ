// pages/super-brand/super-brand.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    brandList: [],
    goodsList: [],
    bannerList:[],
    imgUrl: '',
    homeIcon: '',
    page: 1,
    limit: 6,
    total: 0
  },
  toBrandDetails: function(e) {
      wx.navigateTo({
        url: '/pages/brand-details/brand-details?id=' + e.currentTarget.dataset.id,
      })
  },
  productDetails:function(e){
    wx.navigateTo({
      url: '/pages/product-Details/product-Details?id=' + e.currentTarget.dataset.id + "&sou=" + e.currentTarget.dataset.sou
    })
  },
  onLoad(){
    let baseUrl = app.api.imgUrl
    var banner = wx.getStorageSync('bannerInfo');
    this.setData({
      imgUrl: baseUrl,
      bannerList:banner[3],
      homeIcon: baseUrl + '/img/home/home-icon.png'
    })
    let that = this;
    app.api.request("getBrand", {
      page: that.data.page,
      limit: that.data.limit
    }, res => {
      that.setData({
        brandList: res.data.data.list,
        total: res.data.data.total
      })
    })
  },
  onShow(){
    
  },
  onReachBottom: function () {
    var that = this;
    if (that.data.brandList.length < that.data.total) {
      wx.showLoading({
        title: '玩命加载中',
      })
      // 页数+1
      that.data.page = that.data.page + 1;
      app.api.request('getBrand', {
        "page": this.data.page,
        "limit": this.data.limit,
      }, res => {
        const goodsListTmp = that.data.brandList.concat(res.data.data.list);
        that.setData({
          brandList: goodsListTmp
        })
      })
      wx.hideLoading();
    } else {
      wx.showToast({
        title: '已经没有了哦',
        icon: 'none',
      })
    }
  },
})