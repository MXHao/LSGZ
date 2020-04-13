const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        defalultMap: {},
        who: '', //猫还是狗
        oneList: [],
        twoList: [],
        threeList: [],
        recList: [], //推荐商品
        imgUrl: '',
        homeIcon: ''
    },
    onLoad: function(o) {
      let baseUrl = app.api.imgUrl
      this.setData({
          imgUrl: baseUrl,
        homeIcon: baseUrl + '/img/home/home-icon.png'
      })
      var param = wx.getStorageSync('sysParam');
      var banner = wx.getStorageSync('bannerInfo');
      var catMap = {
        place: param.cat_search,
        oneTitle: '猫咪主粮',
        twoTitle: '猫咪零食',
        threeTitle: '猫咪其他',
        bannerList: banner[1],
        oneF: banner[7][0],
        twoF: banner[8][0],
        threeF: banner[9][0],

      }
      var dogMap = {
        place: param.dog_search,
        oneTitle: '狗狗主粮',
        twoTitle: '狗狗零食',
        threeTitle: '狗狗其他',
        bannerList:banner[2],
        oneF: banner[10][0],
        twoF: banner[11][0],
        threeF: banner[12][0],
      }
      if (o.who == "1") {
        this.setData({
            defalultMap: catMap
        })
        wx.setNavigationBarTitle({
            title: '猫猫主页'
        })
      } else {
        this.setData({
            defalultMap: dogMap
        })
        wx.setNavigationBarTitle({
            title: '狗狗主页'
        })
      }
      // this.data.who = o.who
      this.setData({
        who: o.who
      })
      this.init()
    },
    init() {
        app.api.request('dogAndCartList_api', {
            "type": this.data.who
        }, res => {
            if (res.data.code == 0) {
                this.setData({
                    oneList: res.data.data.food,
                    twoList: res.data.data.snacks,
                    threeList: res.data.data.toy,
                })
            }
        })
    },
    goLink: function (o) {
      app.util.goAdsLink(o)
    },
    productDetails(e) {
        var res = e.currentTarget.dataset.index
        wx.navigateTo({
            url: '/pages/product-Details/product-Details?id=' + res.i + "&sou=" + res.sou,
        })
    },
    selectMore(e) { // 查看更多
    console.log(e);
        wx.navigateTo({
          url: '/pages/search-list/search-list?flag=4&keyWord=' + e.currentTarget.dataset.keyword+'&obj=' + this.data.who+"&type="+e.currentTarget.dataset.target
        })

    },
    goSearch: function() {
        var type = this.data.who
        wx.navigateTo({
          url: "/pages/search-show/search-show?keyWord=" + this.data.defalultMap.place  + '&flag=' + ''

        })
    }
})