// my-behavior.js
let app = getApp();
module.exports = Behavior({
  properties: {
    // hasMask: true,
  },
  data: {
    hasMask: false,
  },
  attached: function () {
    let that = this;
    
    app.util.getUser(() => {
      if (!app.user['openid']) {
        this.setData({ hasMask: true })
      }
      that._success(0);
    })
  },
  methods: {
    _success: function (type) {
      wx.showLoading({
        title: '尝试授权中',
      })
      if (app.user['openid'] || type == 1) {
        this.setData({ hasMask: false })
        this.triggerEvent('success')
      }
      app.util.cancelLoading();
    }
  }
})