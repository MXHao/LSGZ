const app = getApp();
import {
  restTime3
} from '../../assets/js/initTime.js'
var page = {
  page: 1,
  limit: 5,
  total: 0,
  pages: 0,
  params: { index: 0 },
  
}
Page({
  data: {
    isAll: false,
    isShow: false,
    list: [
      '全部', '未使用', '已使用'
    ],
    page: 1,
    limit: 6,
    coupons: [],
    usedImg: '/assets/img/home/used.png',
    currentIndex: 0,
    total: 0,
    type: 0,
    isOverdue: 0
  },
  onLoad() {
this.init();
  },
 init() {
   app.api.request('getExperienceTicket', {
     type: this.data.type,
     page: this.data.page,
     limit: this.data.limit
   }, res =>{
     if(res.data.code == 0) {
       console.log(res)
       this.setData({
         coupons: res.data.data.list,
         total: res.data.data.total,
       })
     }

   })
 },
  touchItem(event) {
    const index = event.currentTarget.dataset.index
    console.log(index)
    this.setData({currentIndex: index })
    switch(index) {
      case 0:
      this.setData({
        type: 0,
        page: 1
      })
      this.init();
      break;
      case 1:
      this.setData({
        type: 1,
        page: 1
      })
      this.init();
      break;
      case 2:
      this.setData({
        type: 2,
        page: 1
      })
      this.init();
      break;
    }
  },
  
  goUse(e) {
    console.log(e.currentTarget.dataset.index.id)
    wx.navigateTo({
      url: '/pages/qr-code/qr-code?id=' + e.currentTarget.dataset.index.id,
    })
  },
  onReachBottom: function () {//上拉加载更多
  console.log(13)
    var that = this;
    if (that.data.coupons.length < this.data.total) {
      // 显示加载图标
      wx.showLoading({
        title: '玩命加载中',
      })
      // 页数+1
      that.data.page = that.data.page + 1;
      app.api.request('getExperienceTicket', {
        'limit': that.data.limit,
        'page': that.data.page,
        'type': that.data.type
      }, res => {
        // console.log(res)
        const newProListTmp = that.data.coupons.concat(res.data.data.list);

        that.setData({
          coupons: newProListTmp
        })
        // console.log(this.data.newProduct)
      })
      // wx.hideLoading();
    } else {
      wx.showToast({
        title: '已经没有了哦',
        icon: 'none',
      })
    }

  },
})