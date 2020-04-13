const app = getApp();
import {
  restTime3
} from '../../assets/js/initTime.js'
var page = {
  page: 1,
  limit: 5,
  total: 0,
  pages: 0,
  params: {
    index: 0
  },

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
    datas: [],
  },
  onLoad() {
    this.init();
  },
  touchItem(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      currentIndex: index
    })
    switch (index) {
      case 0:
        this.setData({
          info: this.data.datas
        })
        break;
      case 1:
        this.setData({
          info: this.data.datas.filter(o => o.status == 0)
        })
        break;
      case 2:
        this.setData({
          info: this.data.datas.filter(o => o.status == 1)
        })
        break;
    }
  },
  init() {
    app.api.request("selectShopServiceRe", res => {
      this.setData({
        datas: res.data.data,
        info: res.data.data
      })
    })
  },
  refund(e) {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '是否确定要退款？',
      success: res => {
        if (res.confirm) {
          app.api.request("refundShopServiceRe", {
            id: e.currentTarget.dataset.index.id,
            orderId: e.currentTarget.dataset.index.orderOn
          }, res => {
            app.util.showToast("操作成功");
            that.init();
          })
        }

      }
    })

  },
  goUse(e) { //跳转二维码详情页面并生成二维码
    console.log(e.currentTarget.dataset.index.id)
    wx.navigateTo({
      url: '/pages/qr-code/qr-code?id=' + e.currentTarget.dataset.index.id,
    })
  },
})