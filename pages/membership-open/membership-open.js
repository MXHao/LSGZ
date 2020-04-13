// pages/membership-open/membership-open.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    titleImg:'',
    ismember: 0,
    isbtnShow: false
  },
  onLoad(o){
    console.log(o)
    var param = wx.getStorageSync('sysParam')
    this.setData({
      sysParam: app.sysParam,
      price: app.util.downFixed(parseFloat(app.sysParam.plusDiscount) * 10,1),
      titleImg:param.plus_buyimg,
      plusText: param.plue_buycontent,
      ismember: o.isPlus
    })
  },
  goBack() {
    wx.navigateBack({
      delta:1
    })
  }
  ,
  buy(){
    app.api.request("buyPlus", { money: this.data.sysParam.plusMoney[this.data.currentIndex]},(res=>{
      Object.assign(res.data.data, {
        'success': function (res) {
          app.util.restart(()=>{
            wx.navigateBack({
              delta: 1
            })
          })
        },
        'fail': function (res) { console.log(res) },
        'complete': function (res) { console.log(res) }
      });
      wx.requestPayment(res.data.data)
    }))
  },
  selectMember(e) {
    this.setData({
      currentIndex: e.currentTarget.dataset.index
    })
  },
  onPageScroll: function (e) {
    if (e.scrollTop > 6) {
      this.setData({
        isbtnShow: true
      });
    } else {
      this.setData({
        isbtnShow: false
      });
    }
  },
})