// pages/NewOffer/NewOffer.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    limit: 9,
    page: 1,
    page2: 1,
    titleImg: '',
    salesPrice: 9.9,
    details: [],
    goodsList: []
  },
  onLoad(o) {
    this.getSalePrice();
    var banner = wx.getStorageSync('bannerInfo');
    this.setData({
      titleImg: banner[15][0]
    })
  },
  tabSelect(e) {
    var id = e.currentTarget.dataset.id
    this.setData({
      currentIndex: id
    })
    switch (id) {
      case 0:
        this.setData({
          salesPrice: 9.9,
          page: 1
        })
        this.getSalePrice()
        break;
      case 1:
        this.setData({
          salesPrice: 19.9,
          page: 1
        })
        this.getSalePrice()
        break;
      case 2:
        this.setData({
          salesPrice: 29.9,
          page: 1
        })
        this.getSalePrice()
        break;
      case 3:
        this.getCompose();
        break;
    }



  },
  getSalePrice() { //特价商品
    app.api.request('getVeryCheap', {
      salesPrice: this.data.salesPrice,
      limit: this.data.limit,
      page: this.data.page,
    }, res => {
      var value = wx.getStorageSync('VeryCheap')
      if (res.data.code == 0) {
          this.setData({
            details: res.data.data,
            goodsList: res.data.data.list
          })
        
      }
    })
  },



  getCompose() { //组合商品
    app.api.request('getComposeList', {
      limit: this.data.limit,
      page: this.data.page2,
    }, res => {
      if(res.data.code == 0) {
        console.log(res)
        this.setData({
          goodsList: res.data.data.list
        })
      }
    })
  },
  // 上拉加载更多
  onReachBottom: function() {
    var that = this;
    if (that.data.goodsList.length < that.data.details.total) {
      // 显示加载图标
      wx.showLoading({
        title: '玩命加载中',
      })
      // 页数+1
      that.data.page = that.data.page + 1;
      app.api.request('getVeryCheap', {
        salesPrice: this.data.salesPrice,
        limit: this.data.limit,
        page: this.data.page,
      }, res => {
        // console.log(res)
        const newProListTmp = that.data.goodsList.concat(res.data.data.list);

        that.setData({
          goodsList: newProListTmp
        })
      })
      // wx.hideLoading();
    } else {
      wx.showToast({
        title: '已经没有了哦',
        icon: 'none',
      })
    }
    // wx.setStorage({
    //   key: 'VeryCheap',
    //   data: {
    //     list: that.data.goodsList,
    //     page: that.data.page
    //     }
    // })
  },
  toProductDetails(e) {//跳转商品详情
    var res = e.currentTarget.dataset.index
    console.log(res)
    wx.navigateTo({
      url: '/pages/veryCheap-details/veryCheap-details?id=' + res.id + "&sou=" + 5,
    })
  },
  toCpsProductDetails(e) {
    var res = e.currentTarget.dataset.index
    console.log(res)
    wx.navigateTo({
      url: '/pages/product-Details/product-Details?id=' + res.i + "&sou=" + 2,
    })
  }
})