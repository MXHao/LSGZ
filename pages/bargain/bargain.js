const app = getApp();
// pages/bargain/bargain.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      imgUrl: '',
        goodsList: [{
          imgSrc: '/img/searchlist/searchlist-item1.png',
                title: '卫仕化毛膏120g',
                number: '10',
                redPrice: '98.00',
                grayPrice: '198.00'
            },
            {
              imgSrc: '/img/searchlist/searchlist-item1.png',
                title: '卫仕化毛膏卫仕化毛膏卫仕化毛膏120g',
                number: '20',
                redPrice: '48.00',
                grayPrice: '98.00'
            },
            {
              imgSrc: '/img/searchlist/searchlist-item1.png',
                title: '卫仕化毛膏卫仕化毛膏卫仕化毛膏120g',
                number: '2000',
                redPrice: '48.00',
                grayPrice: '98.00'
            },
            {
              imgSrc: '/img/searchlist/searchlist-item1.png',
                title: '卫仕化毛膏卫仕化毛膏卫仕化毛膏120g',
                number: '20',
                redPrice: '48.00',
                grayPrice: '98.00'
            }
        ]
    },
    //发起砍价按钮
    initiateBargain() {
        wx.navigateTo({
            url: '',
        })
    },
    onLoad() {
      let baseUrl = app.api.imgUrl
      this.setData({
        imgUrl: baseUrl
      })
      console.log(this.data.imgUrl)
      app.api.request("servicePage", this.data.params, res => {
        console.log(res)
      })
    }
})