const header =  {
  'content-type': 'application/json; charset=utf-8'
    }
const message = {
  'loading': '加载中...',
  'loadError': '与服务器通信发生错误'
}
function showToast(title) {
  wx.showToast({
    title: title,
    icon: 'none',
    duration: 2000
  })
}
/**
 * 加载loding
 */
function showLoading() {
  wx.showLoading({
    title: message.loading,
    mask: true,
  });
}

/** 
 * 跳转到搜索界面
*/

function goSearch(keyWord) {
  wx.navigateTo({
    url: '/pages/search-show/search-show?keyWord=' + keyWord + '&flag=' + '' + '&type=' + ''
  })
}

/**
 * 取消加载窗口
 */
function cancelLoading() {
  wx.hideLoading();
}
function downFixed(num, fix) {
  // num为原数字，fix是保留的小数位数
  let result = '0'
  if (Number(num) && fix > 0) { // 简单的做个判断
    fix = +fix || 2
    num = num + ''
    if (/e/.test(num)) { // 如果是包含e字符的数字直接返回
      result = num
    } else if (!/\./.test(num)) { 
      result = num + `.${Array(fix + 1).join('0')}`
    } else { // 如果有小数点
      num = num + `${Array(fix + 1).join('0')}`
      let reg = new RegExp(`-?\\d*.\\d{0,${fix}}`)
      result = reg.exec(num)[0]
    }
  }
  return parseFloat(result)
}
/**
 * 获取用户配置
 */
function getSetting(success,fail){
   wx.getSetting({
    success:(res)=>{
      if (res.authSetting['scope.userInfo']){
        success();
      }else{
        fail();
      }
    },
    fail: ()=>{
      showToast("用户取消授权!")
      fail()
    }
  })
}
function getopenid(call){
  let app = getApp()
  wx.login({
    success: (data) => {
      getSetting(() => {
        wx.getUserInfo({
          lang: 'zh_CN',
          success: (res) => {
            let pages = getCurrentPages();
            pages[pages.length - 1].route;
            wx.request({
              url: app.api.login,
              method: "POST",
              data: {
                deviceId: app.deviceId,
                shopId: app.shopId,
                encryptedData: res.encryptedData,
                iv:res.iv,
                code: data.code,
                avatarUrl: res.userInfo.avatarUrl,
                nickName: res.userInfo.nickName,
                sex: res.userInfo.gender,
                source: app.api.page[pages[pages.length - 1].route],
                province: res.userInfo.province,
                city: res.userInfo.city
              },
              success: (r) => {
                if (r.data.code != 0) {
                  return showToast(r.data.msg ? r.data.msg : "网络异常,请重试!")
                }
                app.user = r.data.data.user;
                app.isNew=r.data.data.isNew;
                wx.setStorage({ key: "user", data: JSON.stringify(r.data.data.user) })
                wx.setStorageSync('sysParam', r.data.data.sysParam)
                app.sysParam = { plusDiscount: r.data.data.plusDiscount, plusMoney: JSON.parse(r.data.data.plusMoney) }
                call()
              },
              //测试提交
              fail: () => call()
            })
          },
          fail: () => call()
        })
      }, call)
    },
    fail: () => call()
  })
}
function restart(call){
  showLoading();
  let app = getApp()
  getopenid(call);
}
function getUser(call){
  showLoading();
  let app = getApp()
  if (app.user['openid']) {
    return call();
  }
  getopenid(call);
}
/**
 * 发送请求
 */
function request(url,data,method,call){
  let app = getApp();
  if (!data) {
    data={};
  }
  showLoading();
  data.openid = app.user['openid'] ? app.user['openid']:'';
  data.mId = app.user['id'] ? app.user['id']:'';
  data.site = app.user['currentSite'];
  data.shopId = app.shopId ? app.shopId:app.user.shopId
  wx.request({
    url: url, data: data, method: method, header: header,
    success:  (res)=> {
      cancelLoading();
      if (res.data.code != 0) {
        if (res.data.msg) {
          return showToast(res.data.msg)
        }
        showToast(message.loadError)
      } else {
        call(res);
      }
    },
    fail: function (res) {
      cancelLoading();
      showToast(message.loadError)
    }
  });
}

function goAdsLink(o) {
  const obj = o.currentTarget.dataset.item;
  switch (parseInt(obj.t)) {
    case 0:
      wx.navigateTo({
        url: '/pages/seckillDetails/seckillDetails?id=' + obj.v,
      })
      break;
    case 1:
      wx.navigateTo({
        url: '/pages/Group-details/Group-details?id=' + obj.v,
      })
      break;
    case 2:
      wx.navigateTo({
        url: '/pages/product-Details/product-Details?id=' + obj.v + "&sou=1",
      })
      break;
    case 3:
      wx.navigateTo({
        url: '/pages/product-Details/product-Details?id=' + obj.v + "&sou=0",
      })
      break;
    case 4:
      wx.navigateTo({
        url: '/pages/product-Details/product-Details?id=' + obj.v + "&sou=1",
      })
      break;
    case 5:
      wx.navigateTo({
        // url: '/pages/membership-open/membership-open',
        url: '/pages/product-Details/product-Details?id=' + obj.v + "&sou=0",
      })
      break;
    case 6:
      wx.navigateTo({
        url: '/pages/Spike/Spike',
      })
      break;
    case 7:
      wx.navigateTo({
        url: '/pages/NewGroup/NewGroup',
      })
      break;
    case 8:
      wx.navigateTo({
        // url: '/pages/super-brand/super-brand',
      })
      break;
    case 9:
      wx.navigateTo({
        url: '/pages/NewOffer/NewOffer',
      })
      break;
    case 10:
      wx.navigateTo({
        url: '/pages/deviceList/deviceList',
      })
      break;
  }
}
export { request, cancelLoading, showLoading, getUser, showToast, restart, downFixed,goAdsLink,goSearch}