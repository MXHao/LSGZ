const app = getApp();
var WxParse = require('../../assets/wxParse/wxParse.js');
import { getCurrentDate1 } from '../../assets/js/initTime.js'
Page({

  data: {
    sysParam: {},
    access: {
      title: "获取授权",
      msg: '进行下一步操作需要',
      msg2: '获得您的公开信息(昵称、头像等)',
      cancle: '取消',
      confirm: '允许'
    },
    modalName: '',
    num: 1,
    userMap: {},
    // 使用data数据对象设置样式名  
    minusStatus: 'disabled',
    details: {},
    swiperList: [],
    article: '',
    evList: [],
    serviceIntro: '',
    isPreview: false//判断触发onshow的场景，当wx.previewImage事件进行时不触发onshow
  },

  onLoad(o) {
    // console.log(o)
    wx.getStorage({
      key: "sysParam",
      success: (res) => {
        // console.log(res.data.service_intro)
        if (res.errMsg == "getStorage:ok") {
          let myIntro = res.data.service_intro;
          if (myIntro) {
            this.setData({ serviceIntro: myIntro })
          }
        }
      }
    })
    var box = this.selectComponent('#box');
    box._hide();
    this.setData({
      userMap: o
    })

    // this.init(this.data.userMap)
  },
  onShow(e) {
    if (this.data.isPreview == false) {
      this.render();
    }
  },
  render() { //授权成功后调用的方法
    if (this.data.userMap['id']) {
      this.init(this.data.userMap)
    } else {

    }
  },
  init(o) {
    
    o.mId = app.user.id ? app.user.id : ''
    console.log(o)
    app.api.request('getVCDetails', o, res => {
      if (res.data.code == "0") {
        console.log(res.data.data)
        this.data.userMap['pId'] = res.data.data.productId;
        this.setData({
          details: res.data.data,
          sysParam: app.sysParam,
          user: app.user,
          evList: res.data.data.evals
        })
        var that = this
        WxParse.wxParse('article', 'html', this.data.details.productDesc, that, 5)
      }
    })
  },
  DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value
    })
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  // towerSwiper
  // 初始化towerSwiper
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
    })
  },
  // towerSwiper触摸开始
  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX
    })
  },
  addCart(e) { //加入购物车
    if (app.user.openid) {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      var box = this.selectComponent('#box');
      box._show();
    }
  },

  // 优惠券领取
  getCoupon(e) {
    console.log(e)
    app.api.request('getCoupon_api', {
      "mId": app.user.id,
      "id": e.currentTarget.dataset.target.id,
      "cDate": getCurrentDate1()
    }, res => {
      if (res.data.code == 0) {
        wx.showToast({
          title: '领取成功',
          duration: 2000
        })

      } else {
        wx.showToast({
          title: res.data.msg,
          duration: 2000
        })
      }
    })
  },
  addCart_Y() {
    app.api.request('addCart_api', {
      "pId": this.data.details.id,
      "mId": app.user.id,
      "num": parseInt(this.data.num) + parseInt(this.data.details.sss)

    }, res => {
      if (res.data.code == 0) {
        var num = this.data.details.sss + Number(this.data.num)
        this.setData({
          modalName: null,
          ["details.sss"]: num,
          num: 1
        })
        wx.showToast({
          title: '加入购物车',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  buy(e) { //立即购买
    if (app.user.openid) {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      var box = this.selectComponent('#box');
      box._show();
    }


  },
  buy_A() { //确认购买生成订单
    var list = [{
      num: this.data.num,
      pId: this.data.details.id,
      pim: this.data.details.productImg,
      pn: this.data.details.productName,
      pp: this.data.details.salesPrice,
      // si:this.data.datsils.
      sou: this.data.details.sou,
    }]
    this.setData({
      modalName: null,
      num: 1
    })
    wx.navigateTo({
      url: '/pages/ConfirmOrder/ConfirmOrder?type=1&data=' + encodeURIComponent(JSON.stringify(list)),
    })
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })

  },
  hideModal(e) {
    this.setData({
      modalName: null,
      num: 1
    })
  },
  closePayDialog() { //关闭购买弹框
    this.setData({
      modalName: null,
    })
  },
  closeCartDialog() { //关闭加入购物车弹框
    this.setData({
      modalName: null,
    })
  },
  geCoupon() { //关闭优惠券弹框
    this.setData({
      modalName: null,
    })

  },
  openCard() { //开卡
    wx.navigateTo({
      url: '/pages/membership-open/membership-open',
    })
  },
  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },
  // 评论详情
  commentList: function () {
    wx.navigateTo({
      url: '/pages/comment-list/comment-list?id=' + JSON.stringify(this.data.userMap),

    })
  },
  clickImg(e) { //点击评论图片
    this.setData({
      isPreview: true
    })
    var newArray = this.data.evList[e.currentTarget.dataset.ddid].imgUrls
    var newArray2 = [];
    for (var i = 0; i < newArray.length; i++) {
      var arr3 = [];
      arr3 = newArray[i].imgUrl;
      newArray2.push(arr3);

    }
    console.log(newArray2)
    wx.previewImage({
      urls: newArray2,
      current: newArray2[e.currentTarget.dataset.id]
    })
  },
  toBrandDetails() {
    console.log(this.data.details)
    wx.navigateTo({
      url: '/pages/brand-details/brand-details?id=' + this.data.details.bId,
    })
  },
  // towerSwiper计算滚动
  towerEnd(e) {
    let direction = this.data.direction;
    let list = this.data.swiperList;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    }
  },
  /* 点击减号 */
  bindMinus: function () {
    var num = this.data.num;
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 点击加号 */
  bindPlus: function () {
    var num = this.data.num;
    // 不作过多考虑自增1  
    num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 输入框事件 */
  bindManual: function (e) {
    var num = e.detail.value;
    // 将数值与状态写回  
    this.setData({
      num: num
    });
  },
  // 跳转购物车
  goShopCart() {
    if (app.user.openid) {
      // console.log(this.data.userMap)

      // this.data.userMap
      wx.switchTab({
        url: '/pages/shop-cart/shop-cart?id=' + JSON.stringify(this.data.userMap),
      })
    } else {
      var box = this.selectComponent('#box');
      box._show();
    }

  }


})