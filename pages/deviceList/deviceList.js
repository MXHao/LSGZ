const app = getApp();
import {bMapTransQQMap} from '../../assets/js/mapTrans.js'
Page({
  data: {
    name: "",
    addressList: [],
    editsrc: '/assets/img/home/edit.png',
    delsrc: '/assets/img/home/delete.png',
    currentIndex: 0,
    defultAdd: {},
    region: ['请选择'], //地址选择框
    // customItem: ['全部'],
    removeIndex: [],
    isBoxHidden: false,
    addressList2: {},
    nameInput: '', //姓名输入框
    phoneInput: '', //电话输入框
    addetailInput: '', //详细地址输入框
    isEdit: true, //判断是编辑弹窗还是新建弹窗
    editName: '',
    phoneNum: '',
    addressMap: {},
    longitude: '',
    latitude: ''

  },
  onLoad: function(options) {
    this.init()
    wx.getStorage({
      key: "myTerminal",
      success: (res) => {
        if (res.errMsg == "getStorage:ok") {
          let myTerminal = JSON.parse(res.data);
          if (myTerminal) {
            this.setData({
              defultAdd: myTerminal
            })
          }
        }
      }
    })
  },
  init() {
    wx.showLoading({
      title: '获取位置中',
    })
    let that = this;
    wx.getLocation({
      type: 'wgs84',
      altitude: true,
      isHighAccuracy: true,
      highAccuracyExpireTime: 4000,
      fail: function(res) {},
      complete: function(res) {
        console.log(res)
        
        wx.hideLoading();
        if (res.errMsg == "getLocation:ok") {
          app.api.request("getTerminalAddress", { ...res,
            name: that.data.name
          }, that.showList);
        } else {
          app.api.request("getTerminalAddress", {
            name: that.data.name
          }, that.showList);
        }
      }
    })
  },
  goSearch(e) {
    this.setData({
      name: e.detail.value
    })
    this.init();
  },
  showList(res) {
    console.log(res)
    res.data.data.map(o => {
      if (o.distance) {
        o.distance = o.distance >= 1000 ? (Math.round(o.distance / 100) / 10) + 'km' : o.distance + 'm'
        return o;
      } else {
        o.distance = null;
        return o;
      }
    })
    this.setData({
      addressList: res.data.data,
    })
  },
  editDefaultSelect(e) { //修改默认选中你   1  默认地址
    console.log(e)
    let pages = getCurrentPages(); // 获取页面栈
    //var currPage = pages[pages.length - 1]; // 当前页面
    let prevPage = pages[pages.length - 2]; // 上一个页面
    prevPage.setData({
      selfMention: e.currentTarget.dataset.target
    })
    wx.navigateBack({
      delta: 1
    })
  },
  toMap(e) {
    console.log(e)
    let name = e.currentTarget.dataset.item.communityName;
    let index = e.currentTarget.dataset.index
    var position = bMapTransQQMap(this.data.addressList[index].lon,this.data.addressList[index].lat)
    console.log(position.lng, position.lat)
    wx.navigateTo({
      url: '/pages/device-map/device-map?latitude=' + position.lat + "&longitude=" + position.lng + "&name=" + name,
    })
  }

})