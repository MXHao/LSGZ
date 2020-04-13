const app = getApp();
import {
  setWatcher,
  observe
} from '../../assets/js/watch.js'
import {
  initPrice
} from '../../assets/js/initPrice.js'
Page({
  data: {
    access: {
      title: "获取授权",
      msg: '进行下一步操作需要',
      msg2: '获得您的公开信息(昵称、头像等)',
      cancle: '取消',
      confirm: '允许'
    },
    selectPlusIndex: "",
    start: 0, //render 和 onload 哪个先执行  0:start先执行  1:onload先执行
    clientId: null,
    type: null,
    delivery: 1, //0 自提  1 快递
    pageType: false, //true从购物车进入得    false 扫码进入的 
    // 使用data数据对象设置样式名  
    minusStatus: 'disabled',
    cardCur: 0,
    plusDiscount: '',
    selfMention: {},
    popus:[],
    defaultAddress: null, //订单选中的地址
    productList: [],
    selectCoupon: {}, //选中的优惠券
    couponList: [], //所有优惠券
    couponMoney: 0.00, //选择的优惠券面额
    popuPro:null,
    remarks: '', //备注
    sumPrice: 0.00,
    isSelfMention: true, //自提派送切换按钮
    freight: 0,
    contactPerson: '请选择收货地址',
    flag2: true,
    productPrice: 0,
    isCancelSelect: false,
    flag3: true,
    isShow: false,
    currentIndex: null
  },

  onLoad: function(o) {
    setWatcher(this)
    this.setData({
      sysParam: app.sysParam,
    })
      this.setData({
        productList: JSON.parse(decodeURIComponent(o.data)),
        pageType: true,
      })
    this.render(o)
  },
  checkboxChange(e) {
    console.log(e)
    this.setData({
      selectPlusIndex: e.detail.value == -1 ? "" : e.detail.value
    })
    this.countPrice()
  },
  closePro(){
    this.setData({popuPro:null})
    this.countPrice();
  },
  popuBuy(e){
     console.log(e)
    this.setData({ popuPro: e.currentTarget.dataset.item, flag3:true})
    this.countPrice();
  },
  selectPopuProductInfo(){
    app.api.request("selectPopuProductInfo", { clientId: this.data.clientId, price: this.data.sumPrice},res=>{
      this.setData({ popus:res.data.data.products,popuInfo:res.data.data.popuInfo})
    })
  },
  init() {

  },
  
  render() {
    if (app.user.openid) {
      if (this.data.pageType) {
        this.init()
      } else {
        this.setData({
          start: 1
        })
      }
    }
  },
  watch: {
    start: function(newValue, oldVal) {
      this.terminalProductDetails()
    },
  },
  
  wechatPay() { //确认支付
    if (app.user.openid) {
      let that = this;
       app.api.request('buyService', {
         id: this.data.productList[0].pId,
         price: this.data.productList[0].pp * this.data.productList[0].num,
         num: this.data.productList[0].num
        }, res => {
          let tmpRes=res.data.data;
          Object.assign(res.data.data, {
            'success': function(res) {},
            'fail': function(res) {
              console.log(res)
            },
            'complete': function(res) {
                wx.redirectTo({
                  url: '/pages/offline-service/offline-service'
                })
            }
          });
          wx.requestPayment(res.data.data)
        })

    } else {
      var box = this.selectComponent('#box');
      box._show();
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
    num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  // 跳转地址编辑
  toAddress() {
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },
  toDeviceAddress() {
    wx.navigateTo({
      url: '/pages/address-device/address-device',
    })
  },

  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target,
      isShow: true
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  ChooseCheckbox(e) {
    this.setData({
      currentIndex: e.currentTarget.dataset.index == this.data.currentIndex ? -1 : e.currentTarget.dataset.index
    })
    if (this.data.selectCoupon.value == e.currentTarget.dataset.value) {
      this.setData({
        selectCoupon: {},
        couponMoney: 0.00
      })
      var o = "couponList[" + e.currentTarget.dataset.value + "].checked"
      this.setData({
        [o]: !this.data.couponList[e.currentTarget.dataset.value].checked
      })
      this.countPrice()
      return false;
    }

    this.data.couponList.forEach((res, i) => {
      if (i == e.currentTarget.dataset.value) {
        res.checked = true
      } else {
        res.checked = false
      }
    })
    this.setData({
      selectCoupon: this.data.couponList[e.currentTarget.dataset.value],
      couponList: this.data.couponList,
      couponMoney: this.data.couponList[e.currentTarget.dataset.value].account
    })
    console.log(this.data.selectCoupon)
    this.countPrice()
  },
  changeMention() { //派送方式切换
    this.setData({
      delivery: this.data.delivery == 0 ? 1 : 0
    })
    this.countPrice();
  },
  // plus弹窗
  openPlus() {
    this.setData({
      flag2: false
    })
  },
  openRepurchaseBox () {//换购弹窗
this.setData({
  flag3: false
})
  },
  boxHidden2() {
    this.setData({
      flag2: true
    })
  },
  hideBox() {
    this.setData({
      flag2: true,
      flag3: true
    })
  },
  changeIsCancel() {
    this.setData({
      isCancelSelect: !this.data.isCancelSelect
    })
  },
  cloeseBox() {
    this.setData({ isShow: false })
  },
  chooseCoupon(e) {
    this.setData({
      currentIndex: e.currentTarget.dataset.index
    })
  }
})