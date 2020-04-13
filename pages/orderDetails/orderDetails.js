// pages/orderDetails/orderDetails.js
import {
  getCurrentDate,
  getCurrentDate1,
  intervalTime
} from '../../assets/js/initTime.js'
const app = getApp();
Page({
  data: {
    order: {},
    orderId: '',
    showTime: true,
    orderStatus: '',
    btShowAttr: [true, true, true, true, true, true],
    spikeLastTime: '',
    spikeFunction: {},
    source: ''
  },
  onShow() {
    this.getData();
  },
  onLoad(o) {
    console.log(o)
    this.setData({
      orderId: o.item,
      source: o.source
    })
    this.spikeFunction = intervalTime


  },
  onPullDownRefresh: function() {

  },
  groupDetails() {
    wx.navigateTo({
      url: '/pages/group-invitation/group-invitation?id=' + this.data.order.id,
    })
  },
  autoCancel: function() {
    var that = this
    app.api.request("cancel_order_api", {
      params: {
        id: this.data.orderId
      }
    }, (res) => {
      that.getData();
    })
  },
  cancelOrder: function() {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定要取消订单吗？',
      success: function(sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
          app.api.request("cancel_order_api", {
            params: {
              id: this.data.orderId
            }
          }, (res) => {
            that.getData();
          })
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })


  },
  getData() {
    var that = this
    var orderStatusName = '';
    var isShowTime = true;
    var btAttrTmp = this.data.btShowAttr
    app.api.request("getOrderDetails_api", {
      id: this.data.orderId
    }, (res) => {
      switch (res.data.data.status) {
        case -1:
          orderStatusName = '您的订单已经取消'
          res.data.data.statusName = '下单时间'
          res.data.data.endTime = res.data.data.createDate
          break;
        case 0:
          res.data.data.statusName = '下单时间'
          orderStatusName = '';
          isShowTime = false;
          btAttrTmp[3] = false;
          btAttrTmp[4] = false;
          res.data.data.endTime = res.data.data.createDate
          var endTime = new Date(res.data.data.createDate).getTime() + 15 * 1000 * 60
          var nowTime = new Date().getTime();
          if (endTime < nowTime) {
            this.autoCancel()
            return;
          }
          this.spikeFunction(endTime, new Date(), this.autoCancel)
          break;
        case 1:
          res.data.data.statusName = '支付时间'
          res.data.data.endTime = res.data.data.payTime
          orderStatusName = '您的订单正在配货'
          btAttrTmp[0] = false;
          break;
        case 2:
          res.data.data.statusName = '发货时间'
          res.data.data.endTime = res.data.data.sendTime
          orderStatusName = '您的订单已经发货'
          btAttrTmp[0] = false;
          btAttrTmp[1] = false;
          break;
        case 3:
          res.data.data.statusName = '收货时间'
          res.data.data.endTime = res.data.data.receiveTime
          orderStatusName = '订单已经签收，来给个评价吧！'
          btAttrTmp[0] = false;
          btAttrTmp[2] = true;
          btAttrTmp[5] = false;
          break;
        case 4:
          res.data.data.statusName = '评价时间'
          res.data.data.endTime = res.data.data.evalTime
          orderStatusName = '订单已完成！'
          btAttrTmp[0] = false;
          break  
      }
      this.setData({
        order: res.data.data,
        showTime: isShowTime,
        orderStatus: orderStatusName,
        btShowAttr: btAttrTmp
      })
    })
  },
  copy: function(o) {
    wx.setClipboardData({
      data: o.currentTarget.dataset.no,
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {
            console.log(res.data)
            wx.showToast({
              title: '订单号复制成功',
            })
          }
        })
      }
    })
  },
  viewLogistics: function() {
    wx.navigateTo({
      url: '/pages/LogisticsDetails/LogisticsDetails?code=' + this.data.order.transCode + '&company=' + this.data.order.transCompany,
    })
  },
  // 申请售后按钮
  applyService: function() {
    wx.navigateTo({
      url: '/pages/APPREF/APPREF?item=' + encodeURIComponent(JSON.stringify(this.data.order)) + "&type="+ "line",
    })
  },
  toDetails(e) {//订单详情跳转商品详情
    console.log(e)
    let id = e.currentTarget.dataset.id;
    let _source = e.currentTarget.dataset.index.source
    if (this.data.order.orderType == 4 && (_source == 0||_source == 1)) {//普通和组合商品
      wx.navigateTo({
        url: '/pages/product-Details/product-Details?id=' + this.data.order.orderDesc[id].productId + "&sou=" + _source,
      })
    }
    if (this.data.order.orderType == 4 && (_source == 5)) {//特惠购
      wx.navigateTo({
        url: '/pages/veryCheap-details/veryCheap-details?id=' + this.data.order.orderDesc[id].productId + "&sou=" + _source,
      })
    }
    if (this.data.order.orderType == 2) {
      wx.navigateTo({
        url: '/pages/Group-details/Group-details?id=' + this.data.order.orderDesc[id].productId
      })
    }
    if (this.data.order.orderType == 1) {
      wx.navigateTo({
        url: '/pages/seckillDetails/seckillDetails?id=' + this.data.order.orderDesc[id].productId + "&sou=" + _source,
      })
    }
  }
})