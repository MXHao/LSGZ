const app = getApp();
var WxParse = require('../../assets/wxParse/wxParse.js');
var groupedCountTime=null;
var aId;
import {
  restTime, restTime2
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
    id: '',
    // input默认是1  
    num: 1,
    // 使用data数据对象设置样式名  
    minusStatus: 'disabled',
    cardCur: 0,
    detail: {},
    groupRemainTime: '', //团购剩余时间
    groupedCountTime:[],//拼团剩余时间
    groupedMoreCountTime:[],//团购查看更多列表倒计时
    userMap: {},
    timeId: '',
    // spikeFunction: null,
    swiperList: [],
    isTimeShow: true,
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    isGroupedBoxShow: false,
    isGroupBuyingShow: false,
    page: 1,
    limit: 10,
    moreList:[],//查看更多列表
    groupId:null,
    mId:null,
    arr: [],
    arr2: [],
    serviceIntro: '',
    evList: []
  },
  onLoad(o) {
    console.log(o)
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
    this.setData({
      id: o.id,
      groupId: o.groupId,
      mId:o.mId
    })
    var box = this.selectComponent('#box');
    box._hide();
    this.setData({
      userMap: o
    })
    console.log(this.data.userMap)
    this.towerSwiper('swiperList');
    // 初始化towerSwiper 传已有的数组名即可

    this.render();



  },
  render() { //授权成功后调用的方法
    // console.log(app.user)
    if (this.data.userMap['id']) {
      this.init(this.data.userMap)

    } else {

    }
  },
  init(o) {
    app.api.request('getGroupDetail_api', {
      'id': o.id,
      'groupId':this.data.groupId
    }, res => {
      this.data.userMap['pId'] = res.data.data.productId;
      res.data.data.buyCount=parseInt(res.data.data.buyCount);
      this.setData({
        detail: res.data.data,
        swiperList: res.data.data.imgUrls,
        evList: res.data.data.evals
      })
      // console.log(this.data.detail.buyCount >= this.data.detail.groupLimitNumber && this.data.detail.groupLimit == 1)
      if (res.data.data.group.length != 0) {
        this.setData({
          isGroupBuyingShow: true
        })
      }
      var that = this
      WxParse.wxParse('article1', 'html', this.data.detail.seckillNedd, that, 5) //团购须知
      WxParse.wxParse('article2', 'html', this.data.detail.productDesc, that, 5) //商品详情
      WxParse.wxParse('article3', 'html', this.data.detail.activityParams, that, 5) //活动参数
      WxParse.wxParse('article4', 'html', this.data.detail.activityDesc, that, 5) //活动详情
      // if (newValue == "00:00:01") {
      //   var that = this
      //   setTimeout(res => {
      //     // that.getAllSpike()
      //     wx.navigateBack({
      //       delta: 1
      //     })
      //   }, 2000)
      // }
      //列表倒计时组

      // let arr = ["2019-11-29 16:19:40", "2019-12-01 14:18:12", "2019-12-02 14:18:12"];
      // let arr2 = ["2019-11-29 16:19:40", "2019-12-29 14:18:12", "2019-12-30 14:18:12"];
      // if (newValue == "00:00:01") {
      //   var that = this
      //   setTimeout(res => {
      //     // that.getAllSpike()
      //     wx.navigateBack({
      //       delta: 1
      //     })
      //   }, 2000)
      // }
      //列表倒计时组
      // let arr = ["2019-11-29 16:19:40", "2019-12-01 14:18:12", "2019-12-02 14:18:12"];
      // let arr2 = ["2019-11-29 16:19:40", "2019-12-29 14:18:12", "2019-12-30 14:18:12"];
      let arr =[];
      that.data.detail.group.forEach(o => arr.push(o.createDate))
      // clearInterval(groupRemainTime)
      var groupRemainTime = setInterval(function() {//轮播图部分倒计时
        that.setData({
          groupRemainTime: restTime2(that.data.detail.endTime),
          groupedCountTime: restTime(arr),
          groupedMoreCountTime: restTime(that.data.arr2)
        })
        if (that.data.groupRemainTime.str == '00时00分00秒' && that.data.detail.group.length == 0 && that.data.groupMoreRemainTime.str == '00时00分00秒'){
          that.setData({
            isTimeShow: false
          })
          clearInterval(groupRemainTime)
          wx.navigateBack({
             delta: 1
           })
        }
      }, 1000)
      if (this.data.groupId && this.data.mId != app.user.id && res.data.data.isBuy == "1") {
        aId = this.data.groupId
        this.setData({
          modalName: 'join'
        })
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
  showModal(e) {
    aId = e.currentTarget.dataset['id'] ? e.currentTarget.dataset['id']:null
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
    
  },

  joinGroup(e){
    var list = [{
      num: this.data.num,
      pId: this.data.detail.productId,
      pim: this.data.detail.productImg,
      pn: this.data.detail.productName,
      pp: this.data.detail.groupPrice,
      id: this.data.detail.id,
      // si:this.data.datsils.
      sou: this.data.detail.source,
    }]
    this.setData({
      modalName: null,
      num: 1
    })
    wx.navigateTo({
      url: '/pages/ConfirmOrder/ConfirmOrder?aId=' + aId + '&group=2&type=2&data=' + encodeURIComponent(JSON.stringify(list)),
    })
  },
  openGroup(e) { 
    var list = [{
      num: this.data.num,
      pId: this.data.detail.productId,
      pim: this.data.detail.productImg,
      pn: this.data.detail.productName,
      pp: this.data.detail.groupPrice,
      id: this.data.detail.id,
      sou: this.data.detail.source,
    }]
    this.setData({
      modalName: null,
      num: 1
    })
    wx.navigateTo({
      url: '/pages/ConfirmOrder/ConfirmOrder?group=1&type=2&data=' + encodeURIComponent(JSON.stringify(list)),
    })
  },


  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },
  // 团购列表查看更多
  openGroupedBox() {
    this.setData({
      isGroupedBoxShow: true
    })
    app.api.request('getGroupDetailMore_api', {
      "id": this.data.detail.id,
      "page": this.data.page,
      "limit": this.data.limit,
    }, res => {
      if (res.data.code == 0) {
        this.setData({
          moreList: res.data.data.list
        })
        let arr2 = [];
        this.data.moreList.forEach(o => arr2.push(o.createDate))
        this.setData({arr2:arr2})
      }
    })
  },
  cloeseBox() {
    this.setData({
      isGroupedBoxShow:false
    })
  },
  // 评论详情
  commentList: function() {
    wx.navigateTo({
      url: '/pages/comment-list/comment-list?id=' + JSON.stringify(this.data.userMap),

    })
  },
  clickImg(e) { //点击评论图片
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
    if (this.data.detail.groupLimit==1&&num >= this.data.detail.groupLimitNum){
        return false;
    }
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
  backHome() {
    console.log(123)
    wx.switchTab({

      url: '/pages/home/home',

    })
  },
  onShareAppMessage() {
    return {
      title: this.data.detail.productName,
      img: this.data.detail.productImg,
      path: '/pages/Group-details/Group-details?id=' + this.data.detail.id,
      success(e) {
        console.log(e)
      }
    }
  },
  toBrandDetails() { //进入品牌详情
    wx.navigateTo({
      url: '/pages/brand-details/brand-details?id=' + this.data.detail.bId,
    })
  },
})