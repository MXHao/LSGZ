// pages/order/order.js
const app = getApp();
var page = null
var orderId=null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAll: false,
    tabIndex: 0,
    scrollLeft: 0,
    orders:[]
  },
  /** 
  * tab
  */
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      tabIndex:parseInt(options.target)
    })
    page = {
      page: 1,
      limit: 5,
      total: 0,
      pages: 0,
      params: { index: options.target, orderSource: 1, },
    }
  },
  lower(e) {
    if (page.pages == page.page) {
      return app.util.showToast("已经没有了哦");
    }
    page.page += 1;
    this.getData();
  },
  touchItem(event) {
    // 1.取出index
    const index = event.currentTarget.dataset.index
    //2.过滤
    page.params.index = index;
    page.page = 1;
    this.setData({ isAll: false, orders: [], tabIndex:index })
    this.getData();
  },
  getData() {
    let that = this;
    app.api.request("order_api", page, (res) => {
      that.setData({ orders: this.data.orders.concat(res.data.data.records), isAll: parseInt(res.data.data.current) >= parseInt(res.data.data.pages)&&parseInt(res.data.data.total)!=0  })
      page.pages = res.data.data.pages;
    })
  },
  Evaluation: function (e) {
    wx.navigateTo({
      url: '/pages/Evaluation/Evaluation?item=' + encodeURIComponent(JSON.stringify(e.currentTarget.dataset.item)),
    })
  },
  onShow(){
    this.setData({ isAll: false, orders: [] })
    this.getData();
  },
  /**
   * 订单状态
   */
  showModal(e) {
    orderId=e.currentTarget.dataset.id;
    console.log(e);
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
    
  },
  viewLogistics: function (e) {
    wx.navigateTo({
      url: '/pages/LogisticsDetails/LogisticsDetails?code=' + e.currentTarget.dataset.item.transCode + '&company=' + e.currentTarget.dataset.item.transCompany,
    })
  },
  hideModal(e) {
    if(!e.currentTarget.dataset['type']){
      return this.setData({  modalName: null })
    }
    let that = this;
    app.api.request(e.currentTarget.dataset.target == "cancelOrder" ? "cancel_order_api" :"confirm_order",{params:{id:orderId}},(res)=>{
      page.page = 1;
      that.setData({ isAll: false, orders: [], modalName: null})
      that.getData();
    })
    orderId = null;
  },
  payOrder(e) {
    let that = this;
    app.api.request("wx_pay_order", { params: { 
      body: e.currentTarget.dataset.data.productName,
      out_trade_no: e.currentTarget.dataset.data.orderNo,
      total_fee: e.currentTarget.dataset.data.absPrice
     } }, (res) => {
       Object.assign(res.data.data,{
         'success': function (res) {
           page.page = 1;
           that.setData({ isAll: false, orders: [], modalName: null })
           that.getData();
         },
         'fail': function (res) { console.log(res)},
         'complete': function (res) { console.log(res)}
       });
       wx.requestPayment(res.data.data)
    })
  },
  alterService(e){
    wx.navigateTo({
      url: '/pages/after-service-write/after-service-write?item=' + encodeURIComponent(JSON.stringify(e.currentTarget.dataset.item)),
    })
  },
  // 订单详情
  orderDetails: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/orderDetails/orderDetails?item=' + e.currentTarget.dataset.item + "&source=" + e.currentTarget.dataset.source,
    })
  },
})