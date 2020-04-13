const app = getApp();
var WxParse = require('../../assets/wxParse/wxParse.js');
import {
  getCurrentDate,
  intervalTime
} from '../../assets/js/initTime.js'
import {
  setWatcher,
  observe
} from '../../assets/js/watch.js'
Page({
  data: {
    access: {
      title: "获取授权",
      msg: '进行下一步操作需要',
      msg2: '获得您的公开信息(昵称、头像等)',
      cancle: '取消',
      confirm: '允许'
    },
    bId: '',
    timeId: '',
    spikeLastTime: '', //秒杀剩余时间
    spikeFunction: null,
    num: 1,
    // 使用data数据对象设置样式名  
    minusStatus: 'disabled',
    addminusStatus: 'normal',
    cardCur: 0,
    userMap: {},
    details: {},
    swiperList: [],
    isStart: 0,
    serviceIntro: '',
    evList: []
  },
  openCard() { //开卡
    wx.navigateTo({
      url: '/pages/membership-open/membership-open',
    })
  },
  onLoad(o) {
    wx.getStorage({
      key: "sysParam",
      success: (res) => {
        // console.log(res.data.service_intro)
        if (res.errMsg == "getStorage:ok") {
          let myIntro = res.data.service_intro;
          if (myIntro) {
            this.setData({
              serviceIntro: myIntro
            })
          }
        }
      }
    })
    this.setData({
      bId: o.id
    })
    setWatcher(this)
    this.spikeFunction = intervalTime
    var box = this.selectComponent('#box');
    box._hide();
    this.setData({
      userMap: o
    })
    this.towerSwiper('swiperList');
    // 初始化towerSwiper 传已有的数组名即可
    this.render()
  },
  render() { //授权成功后调用的方法
    if (this.data.userMap['id']) {
      this.init(this.data.userMap)

    } else {

    }
  },
  init(o) {
    app.api.request('spikeProDeta_api', o, res => {
      if (res.data.code == "0") {
        console.log(res)
        this.data.userMap['pId'] = res.data.data.pId;
        this.setData({
          userMap: this.data.userMap
        })
        this.setData({
          sysParam: app.sysParam,
          user: app.user,
          isBuyCount: parseInt(res.data.data.buyCount) >= parseInt(res.data.data.purchaseTime),
          details: res.data.data,
          swiperList: res.data.data.sm,
          evList: res.data.data.ev
        })
        let s = parseInt(new Date().getHours());
        let c = parseInt(res.data.data.t.slice(0, 2));
        if (c > s) {
          this.setData({
            isStart: 1
          })
        } else if (s > c) {
          this.setData({
            isStart: 2
          })
        }
        if (this.data.isStart != 2) {
          let endTime = new Date(getCurrentDate() + " " + this.data.details.t).getTime() + 1000 * 60 * 60
          this.data.timeId = this.spikeFunction(endTime, new Date(), this.endPro)
        }
        var that = this
        WxParse.wxParse('article', 'html', this.data.details.d, that, 5)
        WxParse.wxParse('article1', 'html', this.data.details.des, that, 5)
        WxParse.wxParse('article2', 'html', this.data.details.nd, that, 5) //秒杀须知
        WxParse.wxParse('article3', 'html', this.data.details.ps, that, 5) //参数
      }
    })
  },
  endPro() {
    this.init(this.data.userMap)
  },
  watch: {

  },
  onHide: function() {

  },
  onUnload: function() {
    clearInterval(this.data.timeId)
  },
  toBrandDetails() { //进入品牌详情
    wx.navigateTo({
      url: '/pages/brand-details/brand-details?id=' + this.data.details.bra.i,
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
  groupBuy(e) {
    if (app.user.openid) {
      app.api.request('addCart_api', {
        "pId": this.data.details.i,
        "mId": app.user.id,
        "num": this.data.num,
      }, res => {
        if (res.data.code == 0) {
          var list = [{
            num: this.data.num,
            id: this.data.details.i,
            pId: this.data.details.pId,
            pim: this.data.details.pim,
            pn: this.data.details.n,
            pp: this.data.details.sp,
            sou: this.data.details.sou,
          }]
          this.setData({
            modalName: null,
            num: 1
          })
          wx.navigateTo({
            url: '/pages/ConfirmOrder/ConfirmOrder?type=2&data=' + encodeURIComponent(JSON.stringify(list)),
          })
        }
      })
    } else {
      var box = this.selectComponent('#box');
      box._show();
    }


    // wx.navigateBack({
    //   delta: 1
    // })
  },
  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },
  // 评论详情
  commentList: function() {
    // wx.navigateTo({
    //   url: '/pages/comment-list/comment-list',

    // })
    wx.navigateTo({
      url: '/pages/comment-list/comment-list?id=' + JSON.stringify(this.data.userMap)
    })
  },
  clickImg(e) { //点击评论图片
    // console.log(this.data.evList[e.currentTarget.dataset.ddid].evM)
    wx.previewImage({

      urls: this.data.evList[e.currentTarget.dataset.ddid].evM,
      current: this.data.evList[e.currentTarget.dataset.ddid].evM[e.currentTarget.dataset.id]
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
  bindMinus: function() {
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
  bindPlus: function() {
    var num = this.data.num;
    // 不作过多考虑自增1  
    if (this.data.details.purchaseQuantity && this.data.details.purchaseStatus == "0") {
      if (num < this.data.details.purchaseQuantity && this.data.details.purchaseStatus == "0") {
        num++;
      }
    } else {
      num++;
    }

    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    var addminusStatus = num <= this.data.details.purchaseQuantity && this.data.details.purchaseStatus == "0" ? 'normal' : 'disabled';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus,
      addminusStatus: addminusStatus
    });
  },
  /* 输入框事件 */
  bindManual: function(e) {
    var num = e.detail.value;
    // 将数值与状态写回  
    this.setData({
      num: num
    });
  },
  // 购物车按钮
  goShopCart() {
    wx.switchTab({
      url: '/pages/shop-cart/shop-cart',
    })
  },
  onShareAppMessage() {
    return {
      title: this.data.details.n,
      img: this.data.details.pim,
      path: '/pages/seckillDetails/seckillDetails?id=' + this.data.details.id + "&sou=" + this.data.details.sou,
      success(e) {
        console.log(e)
      }
    }
  },
  backHome() {
    wx.switchTab({

      url: '/pages/home/home',

    })
  },
})