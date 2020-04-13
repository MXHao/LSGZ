//index.js

Page({
  data: {
    textArr: '',
    currentBrightness: ''
  },
  onLoad: function(o) {
    wx.getScreenBrightness({
      success: res => {
        console.log(res.value)
        this.setData({
          currentBrightness: res.value
        })
        console.log(this.data.currentBrightness)
      }
    })
    wx.setScreenBrightness({
      value: 1
    })
    this.setData({
      textArr: o.id
    })
  },
  onUnload() {
    console.log('页面销毁')
    wx.setScreenBrightness({
      value: this.data.currentBrightness
    })
  },
  onHide() {
    console.log('页面隐藏')
    wx.setScreenBrightness({
      value: this.data.currentBrightness
    })
  }

})