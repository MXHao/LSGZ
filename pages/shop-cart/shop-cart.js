const app = getApp();
Page({
  data: {
    cecommen: [],
    access: {
      title: "获取授权",
      msg: '进行下一步操作需要',
      msg2: '获得您的公开信息(昵称、头像等)',
      cancle: '取消',
      confirm: '允许'
    },
    scrollTop: 0,
    scrollHeight: 0,
    sum: 1,
    // 使用data数据对象设置样式名  
    minusStatus: 'disabled',
    carts: [],
    selectProduct: [],
    price: 0.00,
    goodsList: [],
    isAllSelect: false,
    totalMoney: 0,
    isSelect: false,
    offSell: []//下架商品
    // userMap:{}
  },
  onShow() {
    var that = this
    wx.getStorage({
      key: 'selectProduct',
      success(res) {
        that.setData({
          selectProduct: []
        })
        that.setData({
          selectProduct: res.data
        })
      }
    })

    that.render()

  },
  productDetails: function(e) {
    var res = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/product-Details/product-Details?id=' + res.i + "&sou=" + res.sou,
    })
  },
  onHide() {
    wx.removeStorageSync('selectProduct')
    wx.setStorage({
      key: "selectProduct",
      data: this.data.selectProduct
    })
  },
  render() { //授权成功后调用的方法
    if (app.user.openid) {
      this.init()
    } else {
      // var box = this.selectComponent('#box');
      // box._show();
    }
  },
  onLoad(o) {
    app.api.request("selectCecommendProduct", {
      type: 2
    }, res => {
      this.setData({
        cecommen: res.data.data
      })
    })
  },
  onUnload() {},
  init() {
    if (app.user.openid) {
      app.api.request('selectCart_api', {
        "mId": app.user.id
      }, res => {
        if (res.data.code == 0) {
          res.data.data.forEach(res => {
            res.isShow = false
          })
          res.data.data.forEach(res => {
            if (this.data.selectProduct.length > 0) {
              this.data.selectProduct.forEach(obj => {
                if (res.pId == obj.pId) {
                  res.isShow = true
                  console.log(res)
                }
              })
            }

          })
          // var cartList=[]
          // var cartList=this.data.carts.concat(...res.data.data)
          var newArr = []
          var newArr2 = []
          var j = 0
          var k = 0
          for (let i in res.data.data) {
            if (res.data.data[i].status == '1') {
              newArr[j++] = res.data.data[i]
            }
            if (res.data.data[i].status == '0') {
              newArr2[k++] = res.data.data[i]
            }
          }
          console.log(newArr)
          this.setData({
            carts: newArr,
            offSell: newArr2
          })
          console.log(this.data.carts)
          this.compHeight()
          this.comPrice()
          if (this.data.selectProduct.length == this.data.carts.length) {
            this.setData({
              isAllSelect: true
            })
          } else {
            this.setData({
              isAllSelect: false
            })
          }
        }
        
      })

    } else {
      // var box = this.selectComponent('#box');
      // box._show();
    }
  },
  compHeight() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          scrollHeight: res.windowHeight * 2
        });
        console.log("设备高度scrollHeight==" + res.windowHeight);
      }
    });
  },
  //页面滑动到底部
  bindDownLoad: function() { //下拉刷新
    // this.data.page++
    // this.setData({
    //   hidden: false
    // })
    // this.init()

  },
  scroll: function(event) {
    //该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
    // console.log("滚动时触发scrollTop==" + event.detail.scrollTop);

  },

  topLoad: function(event) { //上拉刷新

    // console.log("重新加载");
  },
  //回到顶部
  onPageScroll: function(e) {
    if (e.scrollTop > 100) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },
  goTop: function(e) { // 一键回到顶部
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
  // 去逛逛按钮
  goSearch: function() {
    wx.navigateTo({
      url: '/pages/search-list/search-list?searchValue=' + '' + '&type=' + '' + '&flag=' + '5'

    })
  },

  // 删除按钮

  del(e) {

    wx.showModal({
      title: '提示',
      content: '是否确定要删除',
      success: res => {

        if (res.confirm) {
          console.log('用户点击确定')
          console.log(res)
          console.log(e)
          app.api.request('deleteCartProduct_api', {
              mId: app.user.id,
              id: e.currentTarget.dataset.index.si
            },
            res2 => {

              if (res2.data.code == 0) {
                console.log(this)
                // console.log(this.data.carts)
                this.data.carts = this.data.carts.filter(r => r.si !== e.currentTarget.dataset.index.si)
                this.setData({
                  carts: this.data.carts
                })
                this.data.selectProduct.forEach((res, index) => {
                  if (res.pId == e.currentTarget.dataset.index.pId) {
                    this.data.selectProduct.splice(index, 1)
                  }
                })
                this.comPrice()
              }
            })

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }

    })



  },
  addCartProductCount(e, i) {
    this.data.carts.forEach((res, index) => {
      if (res.si == e.currentTarget.dataset.target.si) {
        var o = "carts[" + index + "].num"
        if (i == 1) {
          e.currentTarget.dataset.target.num++
            this.setData({
              [o]: e.currentTarget.dataset.target.num
            })
        } else {
          e.currentTarget.dataset.target.num--
            this.setData({
              [o]: e.currentTarget.dataset.target.num
            })
        }

      }
    })

    app.api.request('addCart_api', {
      "pId": e.currentTarget.dataset.target.pId,
      "mId": app.user.id,
      "num": e.currentTarget.dataset.target.num
    }, res => {
      if (res.data.code == 0) {
        this.comPrice()
      } else {
        this.data.carts.forEach((res, index) => {
          if (res.si == e.currentTarget.dataset.target.si) {
            var o = "carts[" + index + "].num"
            if (i == 1) {
              e.currentTarget.dataset.target.num--
                this.setData({
                  [o]: e.currentTarget.dataset.target.num
                })
            } else {
              e.currentTarget.dataset.target.num++
                this.setData({
                  [o]: e.currentTarget.dataset.target.num
                })
            }

          }
        })
      }
    })
  },
  /* 点击减号 */
  bindMinus(e) {
    if (e.currentTarget.dataset.target.num == 1) {

    } else {
      this.addCartProductCount(e, 2)
    }
  },
  /* 点击加号 */
  bindPlus(e) {
    console.log(e)
    this.addCartProductCount(e, 1)
  },
  bindManual: function(e) {
    var sum = e.detail.value;
    this.setData({
      sum: sum
    });
  },
  comPrice() { //计算价格
    var price = 0;
    this.data.carts.forEach(res => {
      if (res.isShow == true) {
        price += res.pp * res.num
      }
    })
    console.log(price)
    this.setData({
      price: price.toFixed(2)
    })
  },
  // 单选按钮
  HandleSwitchShow: function(e) {
    var currentIndex = e.currentTarget.dataset.index
    this.data.carts.forEach((res, index) => {
      if (res.pId == currentIndex.pId) {
        if (res.isShow == true) {
          var o = "carts[" + index + "].isShow"
          this.setData({
            [o]: false
          })
          this.data.selectProduct.splice(this.data.selectProduct.findIndex(obj => obj.pId == res.pId), 1)
          var that = this
          this.setData({
            selectProduct: that.data.selectProduct
          })
        } else if (res.isShow == false) {
          var o = "carts[" + index + "].isShow"
          this.setData({
            [o]: true
          })
          this.data.selectProduct.push(res)
          var that = this
          this.setData({
            selectProduct: that.data.selectProduct
          })
        }
      }
    })
    if (this.data.selectProduct.length == this.data.carts.length) {

      this.setData({
        isAllSelect: true
      })
    } else {
      this.setData({
        isAllSelect: false
      })
    }
    this.comPrice()
    console.log(this.data.selectProduct)
  },
  HandleSwitchShow2() {
    wx.showToast({
      title: '抱歉，该商品已下架，暂无法结算',
      icon: 'none'
    })
  },
  // 全选按钮
  handleAllChange() {
    this.setData({
      isAllSelect: !this.data.isAllSelect
    })
    this.data.selectProduct = []
    if (this.data.isAllSelect == true) {
      var data = this.data.selectProduct.concat(this.data.carts)
      this.setData({
        selectProduct: data
      })
    } else if (this.data.isAllSelect == false) {
      this.setData({
        selectProduct: []
      })
    }
    console.log(this.data.selectProduct)
    for (let i = 0; i < this.data.carts.length; i++) {
      let index2 = "carts[" + i + "].isShow"
      if (this.data.isAllSelect == false) {
        this.setData({
          [index2]: false
        })
      } else {
        this.setData({
          [index2]: true
        })
      }
    }
    this.comPrice()
  },
  goDetails(e) { //商品详情
    var res = e.currentTarget.dataset.target
    wx.navigateTo({
      url: '/pages/product-Details/product-Details?id=' + res.pId + "&sou=" + res.sou,
    })
  },
  //加入购物车
  addCart(e) {
    app.api.request('addCart1_api', {
      "pId": e.i,
      "mId": app.user.id,
      "sum": 1
    }, res => {
      if (res.data.code == 0) {
        wx.showToast({
          title: '加入购物车',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  confirm() {
    // var b=this.data.selectProduct.join(",")
    if (this.data.selectProduct.length > 0) {
      wx.navigateTo({
        url: '/pages/ConfirmOrder/ConfirmOrder?cart=1&type=1&data=' + encodeURIComponent(JSON.stringify(this.data.selectProduct)),
      })
    } else {
      wx.showToast({
        title: '请选择结算商品',
        icon: 'none',
        duration: 2000
      })
    }

  }
})