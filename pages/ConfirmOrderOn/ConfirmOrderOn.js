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
    var data = decodeURIComponent(o.clientId)
    var type = decodeURIComponent(o.type)
    this.setData({
      sysParam: app.sysParam,
    })
    if (data == "undefined") {
      wx.getStorage({
        key: "myTerminal",
        success: (res) => {
          if (res.errMsg == "getStorage:ok") {
            let myTerminal = JSON.parse(res.data);
            if (myTerminal) {
              this.setData({
                selfMention: myTerminal
              })
            }
          }
        }
      }, );
      // console.log(o.data)
      this.setData({
        productList: JSON.parse(decodeURIComponent(o.data)),
        pageType: true,
        orderType: o.type,
        cart: o.cart,
        group: o.group,
        aId: o.aId
      })
    } else { //终端机扫码进入的小程序
      this.setData({
        clientId: data,
        type: type
      })
      this.terminalProductDetails()
    }
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
    let that = this;

    if (this.data.defaultAddress == null) {
      var address = wx.getStorageSync('defaultAddr');
      for (var i = 0; i < address.length; i++) {
        if (address[i].def == 1) {
          this.setData({
            defaultAddress: address[i],
            contactPerson: address[i].p + ' ' + address[i].phone
          })
          break;
        }
      }
    }
    var param = {
      mId: app.user.id,
      product: this.data.productList,
    }
    if (this.data.defaultAddress != null) {
      param.address = this.data.defaultAddress
    }
    app.api.request('enablecoupons', param, (res) => {
      res.data.data.enableCoupons.forEach((res, i) => {
        res.checked = false;
        res.value = i;
        switch (res.type) {
          case '1':
            res['coupon_desc'] = '新人券'
            break;
          case '2':
            res['coupon_desc'] = '满减券'
            break;
          case '3':
            res['coupon_desc'] = '无门槛券'
            break;
        }
      })
      this.setData({
        couponList: res.data.data.enableCoupons
      })
      let freight = res.data.data.freight;
      if (freight == 0) {
        this.setData({
          freight: freight,
        })
      } else if (freight == -1) {
        this.setData({
          freight: freight,
        })
      } else {
        this.setData({
          freight: freight,
        })
      }
      this.countPrice()
    })
  },
  terminalProductDetails() { //终端机扫码进入的小程序的商品详情
    app.api.request('getTerminalProductDetails', {
      clientId: this.data.clientId,
      type: this.data.type
    }, res => {
      if (res.data.code == "0") {
        if (res.data.data == null) {
          wx.showToast({
            title: '终端机购物车内没有任何东西哦',
            icon: 'none',
            duration: 10000
          })
          return false;
        }
        if (res.data.data.length == 0) {
          wx.showToast({
            title: '请在两分钟内完成支付',
            icon: 'none',
            duration: 2000
          })
          return false;
        }
        this.setData({
          productList: res.data.data
        })
        this.countPrice()
        this.selectPopuProductInfo()
      }
    })
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
  countPrice(I) {
    var sum = 0;
    this.data.productList.forEach(res => {
      sum += res.pp * Number(res.num)
    })
    if (sum <= 0.01) {
      sum = 0.01;
    }
    this.setData({
      productPrice: sum
    });
    if (this.data.orderType == 1) {
      sum = sum - this.data.couponMoney;
    }
    this.setData({
      discountCount: parseFloat(initPrice(sum - sum * parseFloat(app.sysParam.plusDiscount), 2))
    })
    if (app.user['isPlus'] == 1) {
      sum = sum * parseFloat(app.sysParam.plusDiscount);
      this.setData({
        plusDiscount: initPrice(parseFloat(app.sysParam.plusDiscount) * 10,2)
      })
    }else{
      if (this.data.selectPlusIndex!=""){
        sum = sum * parseFloat(app.sysParam.plusDiscount)
        console.log(sum, parseFloat(this.data.sysParam.plusMoney[this.data.selectPlusIndex].price))
        sum += parseFloat(this.data.sysParam.plusMoney[this.data.selectPlusIndex].price);
      }
    }
    if (sum <= 0.01) {
      sum = 0.01;
    }
    if (this.data.delivery == 1) {
      sum += this.data.freight == -1 ? 0 : this.data.freight;
    }
    if (this.data.popuPro&&this.data.popuPro['productName']){
      sum+=this.data.popuInfo.money
    }
    this.setData({
      sumPrice: initPrice(sum, 2)
    })
  },
  wechatPay() { //确认支付
    if (app.user.openid) {
      if (this.data.defaultAddress == null && this.data.pageType) {
        wx.showToast({
          title: '请选择收货地址',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
      if (this.data.delivery == 0 && this.data.pageType) {
        if (!this.data.selfMention['name']) {
          wx.showToast({
            title: '请选择收货地址',
            icon: 'none',
            duration: 2000
          })
          return false;
        }
        wx.setStorage({
          key: "myTerminal",
          data: JSON.stringify(this.data.selfMention),
          success: function(res) {}
        })
      }
      let that = this;
      if (this.data.pageType) {
        app.api.request(this.data.orderType == 1 ? 'createOrder_api' : (this.data.orderType == 2 && !this.data.group) ? 'insertSkillOrder' : this.data.group == 1 ? 'insertGroupOrder' : 'insertGroupOrder', {
          terminal: this.data.pageType ? 1 : 2, //1代表从购物车进入的   2代表从终端机扫码进入的
          delivery: this.data.delivery,
          cart: this.data.cart && this.data.cart==1?1:0,
          cId: this.data.clientId,
          mId: app.user.id,
          product: JSON.stringify(this.data.productList),
          coupon: this.data.selectCoupon,
          address: this.data.defaultAddress,
          selfMention: this.data.selfMention,
          activityId: this.data.group && this.data.group == 2 ? this.data.aId : "",
          price: this.data.sumPrice,
          plus: this.data.selectPlusIndex != "" ? this.data.sysParam.plusMoney[this.data.selectPlusIndex] : ""
        }, res => {
          let tmpRes = res.data.data;
          Object.assign(res.data.data, {
            'success': function(res) {},
            'fail': function(res) {
              console.log(res)
            },
            'complete': function(res) {
              if (res.errMsg.indexOf("ok") != -1) {
                if (that.data.selectPlusIndex != "") {
                  app.util.restart();
                }
                wx.redirectTo({
                  url: '/pages/PaymentResult/PaymentResult?price=' + that.data.sumPrice + "&id=" + tmpRes.orderNo
                })
              } else {
                wx.redirectTo({
                  url: '/pages/MyOrder/MyOrder?target=0'
                })
              }

            }
          });
          wx.requestSubscribeMessage({
            tmplIds: app.tmplIds,
            complete(r) {
              wx.requestPayment(res.data.data)
            }
          })
        })
      } else {
        app.api.request('createOrder_api', {
          terminal: this.data.pageType ? 1 : 2, //1代表从购物车进入的   2代表从终端机扫码进入的
          delivery: this.data.delivery,
          cId: this.data.clientId,
          mId: app.user.id,
          cart:0,
          product: JSON.stringify(this.data.productList),
          coupon: this.data.selectCoupon,
          address: this.data.defaultAddress,
          selfMention: this.data.selfMention,
          activityId: this.data.group && this.data.group == 2 ? this.data.aId : "",
          price: this.data.sumPrice,
          popu: this.data.popuPro?{...this.data.popuInfo,...this.data.popuPro}:null,
          plus: this.data.selectPlusIndex != "" ? this.data.sysParam.plusMoney[this.data.selectPlusIndex] : ""
        }, res => {
          let tmpRes=res.data.data;
          Object.assign(res.data.data, {
            'success': function(res) {},
            'fail': function(res) {
              console.log(res)
            },
            'complete': function(res) {
              if (res.errMsg.indexOf("ok") != -1) {
                if (that.data.selectPlusIndex != "") {
                  app.util.restart();
                }
                wx.redirectTo({
                  url: '/pages/PaymentResult/PaymentResult?price=' + that.data.sumPrice + "&id=" + tmpRes.orderNo
                })
              } else {
                wx.redirectTo({
                  url: '/pages/MyOrder/MyOrder'
                })
              }

            }
          });
          wx.requestSubscribeMessage({
            tmplIds: app.tmplIds,
            complete(r) {
              wx.requestPayment(res.data.data)
            }
          })
        })
      }

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