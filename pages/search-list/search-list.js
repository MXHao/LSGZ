const app = getApp();
var count = -1
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
    searchValue:'',
    isLast:false,
    type:'',
    flag:1,
    obj:'',
    priceType:0,
    num:0,
    page:1,
    limit:10,
    scrollTop: 0,
    scrollHeight:0,
    hidden: true, 
    // 横纵切换
    isChange: true,
    // 价格上下箭头
    isActive: true,
    // 综合，销量，价格
    isTab1Active: true,
    isTab2Active: false,
    isTab3Active: false,
    goodsList: [],
    isNoResult: false,
    keyWord: '',
    classId: '',
    interfaceType: 1,
    total: 0,
    ctype: 0,
    cflag: 1,
    discountLabel: ''
  },
  bindKeyInput: function (e) {
    this.setData({
      searchValue: e.detail.value
    })
  },
  onLoad: function (o) {
    console.log(o)
    switch(o.flag) {
      case '1':
        wx.setNavigationBarTitle({'title':'10元专区'});
        this.setData({
          discountLabel: 1
        })
        break;
      case '3':
        wx.setNavigationBarTitle({ 'title': '20元专区' });
        this.setData({
          discountLabel: 2
        })
        break;
      case '':
        wx.setNavigationBarTitle({ 'title': '搜索结果' });
        break;
      case '4':
        wx.setNavigationBarTitle({ 'title': o.keyWord });
        break;
      case '5':
        wx.setNavigationBarTitle({ 'title': '随便逛逛' });
        break;
      case '6':
        wx.setNavigationBarTitle({ 'title': '5折专区' });
        this.setData({
          discountLabel: 3
        })
        break;
      case '7':
        wx.setNavigationBarTitle({ 'title': '7折专区' });
        this.setData({
          discountLabel: 4
        })
    }
    this.setData({
      plusDiscount: app.util.downFixed(10 * parseFloat(app.sysParam.plusDiscount),1),
      searchValue: o.searchValue ? o.searchValue:'',
      type: o.type ? o.type : '',
      obj:o.obj?o.obj:'',
      // keyWord: o.keyWord,
      classId: o.classId?o.classId:'',
      ctype: o.ctype?o.ctype:'',
      
    })
    this.interfaceType(o);
    
  },
  interfaceType(o) {//接口判断
    if(o.ctype == 0) {
      this.init2();
      this.setData({
        interfaceType: 2
      })
    }
        else {
      this.init();
      this.setData({
        interfaceType: 1
      })
    }
  },
  
  init(o){
    app.api.request('search_api', {
      "page":this.data.page,
      "limit": this.data.limit,
      "keyWord": this.data.searchValue,
      "type":this.data.type,//猫猫狗狗
      "flag":this.data.flag,
      'obj':this.data.obj,
      "price":this.data.priceType,
      "num":this.data.num,
      'discountLabel': this.data.discountLabel
    }, res => {
      if(res.data.code==0){
        this.setData({
          goodsList: res.data.data.productList, 
          hidden: true, 
          total:res.data.data.count
        })
      }
      if(res.data.data.count == 0) {
        this.setData({
          isNoResult: true
        })
      }
    })
  },
  init2(o) {//分类搜索接口
    app.api.request('getSearchListByClass', {
      "keyWord": this.data.searchValue,
      "ctype": this.data.ctype,
      "classId": this.data.classId,
      "page": this.data.page,
      "limit": 10,
      "cflag": this.data.cflag
    }, res => {
      if(res.data.code == 0) {
        this.setData({
          goodsList: res.data.data.list, 
          hidden: true, 
          total: res.data.data.total
        })
      }
      if (res.data.data.total == 0) {
        this.setData({
          isNoResult: true
        })
      }
    })
  },
  // 上拉加载更多
  onReachBottom: function () {
    console.log(123)
    var that = this;
    if (that.data.goodsList.length < that.data.total) {
      wx.showLoading({
        title: '玩命加载中',
      })
      // 页数+1
      that.data.page = that.data.page + 1;
      app.api.request(that.data.interfaceType == 1 ? "search_api":"getSearchListByClass", {
        "page": this.data.page,
        "limit": this.data.limit,
        "keyWord": this.data.searchValue,
        "type": this.data.type,//猫猫狗狗
        "flag": this.data.flag,
        'obj': this.data.obj,
        "price": this.data.priceType,
        "num": this.data.num,
        "ctype": that.data.ctype,
        "classId": that.data.classId,
        "cflag": that.data.cflag,
        'discountLabel': that.data.discountLabel
      }, res => {
        const goodsListTmp = that.data.goodsList.concat(that.data.interfaceType == 1 ? res.data.data.productList: res.data.data.list);
        that.setData({
          goodsList: goodsListTmp
        })
      })
      wx.hideLoading();
    } else {
      this.data.isLast = true;
      wx.showToast({
        title: '已经没有了哦',
        icon: 'none',
      })
    }
  },
  //搜索框取消按钮
  cancel() {
    wx.navigateBack({
      delta: 1
    })
  },
  search(o){//搜索
    this.setData({
      goodsList:[],
      isNoResult: false,
      page:1
    })
    if (this.data.interfaceType == 1) {
      this.init();
    }
    if (this.data.interfaceType == 2) {
      this.init2();
    }
  },
  //综合
  changeTab1() {
    this.setData({
      goodsList:[],
      isTab1Active: true,
      isTab2Active: false,
      isTab3Active: false,
      priceType: 0,
      num: 0,
      page:1,
      limit:10,
      ctype: 0,

    })
    if (this.data.interfaceType == 1) {
      console.log('普通搜索')
      this.init();
    }
    if (this.data.interfaceType == 2) {
      this.init2();
      console.log('分类搜索')

    }
  },
  // 销量
  changeTab2() {
    this.setData({
      goodsList: [],
      isTab2Active: true,
      isTab1Active: false,
      isTab3Active: false,
      priceType: '',
      num: 0,
      page: 1,
      limit: 10,
      ctype: 1,
    })
    if (this.data.interfaceType == 1) {
      console.log('普通搜索')
      this.init();
    }
    if (this.data.interfaceType == 2) {
      this.init2();
      console.log('分类搜索')

    }
  },
  // 价格
  changeUpDown() {
    var price = this.data.priceType==0?1:0;
    var isCflag = this.data.cflag == 0?1:0
    this.setData({
      goodsList: [],
      isActive: !this.data.isActive,
      isTab3Active: true,
      isTab2Active: false,
      isTab1Active: false,
        priceType: price,
        num: '',
        page: 1,
        limit: 10,
        ctype: 2,
        cflag: isCflag
    })
    if (this.data.interfaceType == 1) {
      console.log('普通搜索')
      this.init();
    }
    if (this.data.interfaceType == 2) {
      this.init2();
      console.log('分类搜索')

    }
  },



  //回到顶部
  goTop(){
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    } 
  },

  //切换横纵显示
  listChange() {
    this.goTop()
    this.setData({
      isChange: !this.data.isChange
    })
  },
  //加入购物车
  addCart(e){
    if (app.user.openid) {
      app.api.request('addCart_api', {
        "pId": e.currentTarget.dataset.target.i,
        "mId": app.user.id,
        "num": 1
  
      }, res => {
        if (res.data.code == 0) {
          this.data.goodsList.forEach((res, index) => {
            if (res.i == e.currentTarget.dataset.target.i) {
              var o = "carts[" + index + "].sum"
              e.currentTarget.dataset.target.sss++
              this.setData({
                [o]: e.currentTarget.dataset.target.sss
              })
            }
          })
          wx.showToast({
            title: '加入购物车',
            icon: 'success',
            duration: 2000
          })
        }
      })  
    } else {
      var box = this.selectComponent('#box');
      box._show();
    }
    
  },
  goDetails(e){//跳转详情
    var res =  e.currentTarget.dataset.target
    wx.navigateTo({
      url: '/pages/product-Details/product-Details?id=' + res.i + "&sou=" + res.sou,
    })
  },
})