const app = getApp();
// pages/bargain/bargain.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    access: {
      title: "获取授权",
      msg: '进行下一步操作需要',
      msg2: '获得您的公开信息(昵称、头像等)',
      cancle: '取消',
      confirm: '允许'
    },
    imgUrl: '',
    goodsList: [{
      imgSrc: 'https://petinfo.oss-cn-hangzhou.aliyuncs.com/20191216/79d8ae30b7744288ac306411c084e105.jpg',
      title: '小佩智能饮水机3代',
      i: '1207192622774915073',
      sou: '0',
      redPrice: '199.00',
      grayPrice: '298.00'
    },
    {
      imgSrc: 'https://petinfo.oss-cn-hangzhou.aliyuncs.com/20191216/d1ff176b075a49f28292638d93b30ab3.jpg',
      title: '网红仙女逗猫棒',
      i: '1207193224900808706',
      sou: '0',
      redPrice: '10.00',
      grayPrice: '20.00'
    },
    {
      imgSrc: 'https://petinfo.oss-cn-hangzhou.aliyuncs.com/20191219/45adc606484a4b1b98c33ab5e4f356b8.jpg',
      title: '多格漫DMB妙鲜包/盒',
      i: '1207331845041590274',
      sou: '0',
      redPrice: '36.00',
      grayPrice: '45.00'
    },
    // {
    //   imgSrc: 'https://petinfo.oss-cn-hangzhou.aliyuncs.com/20191119/1c89739166244698b6f93e98752c2c8f.jpg',
    //   title: '红狗犬营养膏120g/支',
    //   i: '1207190857148592129',
    //   sou: '0',
    //   redPrice: '68.00',
    //   grayPrice: '75.00'
    // },
      {
        imgSrc: 'https://petinfo.oss-cn-hangzhou.aliyuncs.com/20191219/10a0aa6dd1314ade86f0dd7ddc364dfd.jpg',
        title: '齿一生/包',
        i: '1207346641401069569',
        sou: '0',
        redPrice: '12.00',
        grayPrice: '20.00'
      },
      {
        imgSrc: 'https://petinfo.oss-cn-hangzhou.aliyuncs.com/20191119/3a801a43e23a41d1861b6ec7d27f2cd8.jpg',
        title: '麦富迪日常营养鸡肉干400g',
        i: '1207192594362699777',
        sou: '0',
        redPrice: '29.90',
        grayPrice: '35.00'
      }
    ]
  },
  //发起砍价按钮
  productDetails(e) {
    var res = e.currentTarget.dataset.index
    if (app.user.openid) {
      wx.navigateTo({
        url: '/pages/product-Details/product-Details?id=' + res.i + "&sou=" + res.sou,
      })
    }else {
      // console.log(123)
      this.login()
    }
    
  },
  login: function () {
    if (!app.user.openid) {
      var box = this.selectComponent('#box');
      box._show();
    }
  },
  onLoad(options) {
    app.shopId = options.shopId;
    let baseUrl = app.api.imgUrl
    this.setData({
      imgUrl: baseUrl
    })
  }
})