const app = getApp();
var count=-1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
     pages:0,
     params:{
       name:"",
       page:1,
       limit:6,
       type:1
     },
     datas:[],
    isChange: true,
    isTab1Active: true,
    isTab2Active: false,
    isTab3Active: false,
    isActive:true,
  },
  bindKeyInput: function (e) {
    this.setData({
      'params.name':e.detail.value
    })
  },
  onLoad: function (o) {
    this.search();
    
  },
  search(){
    app.api.request("servicePage", this.data.params, res => {
      // res.data.data.list=res.data.data.list.map(o=>{
      //   let temp1 = new Date(o.grantStart)
      //   o.grantStart = temp1.getFullYear() + "/" + (temp1.getMonth() + 1) + "/" + temp1.getDate();
      //   let temp2 = new Date(o.grantEnd)
      //   o.grantEnd = temp2.getFullYear() + "/" + (temp2.getMonth() + 1) + "/" + temp2.getDate();
      //   return o
      // })
      this.setData({ 
        datas: res.data.data.list,
        count: res.data.data.total
        })
    })
  },
  searchInput(){
    this.data.pages = 0;
    this.data.datas=[]
    this.data.params.page=1
    this.search();
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

  //页面滑动到底部
  // bindDownLoad: function () {
  //   console.log('到底')
  //   if (this.data.params.page == this.data.pages) {
  //     return app.util.showToast("已经没有了哦");
  //   }
  //   this.data.params.page++;
  //   this.search()
  // },
  onReachBottom: function () {
    var that = this;
    if (that.data.datas.length < that.data.count) {
      // 显示加载图标
      wx.showLoading({
        title: '玩命加载中',
      })
      // 页数+1
      that.data.params.page = that.data.params.page + 1;
      app.api.request("servicePage", this.data.params,  res => {
        const goodsListTmp = that.data.datas.concat(res.data.data.list);
        that.setData({
          datas: goodsListTmp
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
  changeTab1(){
    this.data.pages=0;
    this.data.params.page = 1
    this.data.params.type = 1
    this.data.datas=[]
    this.setData({
      isTab1Active: true,
      isTab2Active: false,
      isTab3Active: false,
    })
    this.search();
  },
  changeUpDown(){

    this.setData({
      isTab1Active: false,
      isTab2Active: false,
      isTab3Active: true,
      isActive: !this.data.isActive
    })
    this.data.datas = []
    this.data.pages = 0;
    this.data.params.page = 1
    this.data.params.type = this.data.isActive ? 3 : 4
    this.search();
  },
  changeTab2() {
    this.data.pages = 0;
    this.data.params.page=1
    this.data.params.type=2
    this.data.datas = []
    this.setData({
      isTab1Active: false,
      isTab2Active: true,
      isTab3Active: false,
    })
    this.search();
  },
  goDetails(e){
    var res =  e.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/service-Details/service-Details?id=' + res.id,
    })
  },
})