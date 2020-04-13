// pages/home/swiper/swiper.js
Component({
  
  /**
   * 页面的初始数据
   */
  properties: {
    imgList: {
      type: Array,//类型
      value: ''//默认值
    }
  },
  data: {
    swiperH: '',//swiper高度
    nowIdx: 0,//当前swiper索引
  },

  methods:{
    /**
       * 生命周期函数--监听页面加载
       */
    onLoad: function (options) {
      console.log(this.data.imgList)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
      console.log(this.data.imgList)
    },
    //获取swiper高度
    getHeight: function (e) {
      var winWid = wx.getSystemInfoSync().windowWidth - 1.2 * 50;//获取当前屏幕的宽度
      var imgh = e.detail.height;//图片高度
      var imgw = e.detail.width;
      // var sH = winWid * imgh / imgw + "px"
      var sH = 300 + "rpx"
      this.setData({
        swiperH: sH//设置高度
      })
    },
    //swiper滑动事件
    swiperChange: function (e) {
      this.setData({
        nowIdx: e.detail.current

      })
    },
    go(o){
      console.log(o.currentTarget.dataset.item.t)
      const obj=o.currentTarget.dataset.item;
      switch(parseInt(obj.t)) {
        case 0:
          wx.navigateTo({
            url: '/pages/seckillDetails/seckillDetails?id=' + obj.v,
          })
          break;
        case 1:
          wx.navigateTo({
            url: '/pages/Group-details/Group-details?id='+obj.v,
          })
          break;
        case 2:
          wx.navigateTo({
            url: '/pages/product-Details/product-Details?id=' + obj.v + "&sou=1",
          })
          break;
        case 3:
          wx.navigateTo({
            url: '/pages/product-Details/product-Details?id=' + obj.v + "&sou=0",
          })
          break;
        case 4:
          wx.navigateTo({
            url: '/pages/product-Details/product-Details?id=' + obj.v + "&sou=1",
          })
          break;
        case 5:
          wx.navigateTo({
            url: '/pages/membership-open/membership-open',
          })
          break;
        case 6:
          wx.navigateTo({
            url: '/pages/Spike/Spike',
          })
          break;
        case 7:
          wx.navigateTo({
            url: '/pages/NewGroup/NewGroup',
          })
          break;
        case 8:
          wx.navigateTo({
            url: '/pages/super-brand/super-brand',
          })
          break;
        case 9:
          wx.navigateTo({
            url: '/pages/product-Details/product-Details?id=' + obj.v + "&sou=0",
          })
          break;
        case 10:
          wx.navigateTo({
            url: '/pages/deviceList/deviceList',
          })
          break;
      }
    }
  }
  
})