const app = getApp();
var WxParse = require('../../assets/wxParse/wxParse.js');
var isOver=false;
Page({
    data: {
        access: {
            title: "获取授权",
            msg: '进行下一步操作需要',
            msg2: '获得您的公开信息(昵称、头像等)',
            cancle: '取消',
            confirm: '允许'
        },
        ellipsis: true, // 文字是否收起，默认收起
        isChange: true,
        isActive: true,
        // 综合，销量，价格
        isTab1Active: true,
        isTab2Active: false,
        isTab3Active: false,
        priceType: 0,
        num: 0,
        brandDetailsMap: {},
        bId: null,
        page: 1,
        limit: 10,
        scrollHeight: 0,
        hidden: true,
        goodsList: [],
        boxHeight: 0, //展开盒子高度
        istextShow: false, //隐藏展开按钮是否显示
        imgUrl:''
    },
    onLoad: function(o) {
      let baseUrl = app.api.imgUrl
      this.setData({
        imgUrl: baseUrl
      })
        console.log(o)
        var box = this.selectComponent('#box');
        box._hide();
        this.setData({
            bId: o.id,
          plusDiscount: app.util.downFixed(10 * parseFloat(app.sysParam.plusDiscount), 1),
        })
        this.init()
            //获取view高度
        setTimeout(() => {
            //创建节点选择器
            var query = wx.createSelectorQuery();
            var that = this
                //选择id
            query.select('#ellipsisBox').boundingClientRect()
            query.exec(function(res) {
                //res就是 所有标签为ellipsisBox的元素的信息 的数组
                console.log(res);
                //取高度
                const height = res[0].height;
                console.log(height)
                if (height > 150) {
                    that.setData({
                        istextShow: true,
                        boxHeight: 150,
                        ellipsis: false
                    })
                } else {
                    that.setData({
                        istextShow: false,
                        boxHeight: height
                    })
                }
            })
        }, 300)


    },
    init() {
        this.setData({
            hidden: false
        })
        app.api.request('selectBrandProduct_api', {
            bId: this.data.bId,
            page: this.data.page,
            limit: this.data.limit,
            price: this.data.priceType,
            num: this.data.num
        }, res => {
            console.log(res)
            if (res.data.code == "0") {
              if (res.data.data.brandProduct.length==0){
                   isOver=true;
                   return app.util.showToast("已经没有了哦")
              }
                var data = this.data.goodsList.concat(...res.data.data.brandProduct)
              wx.setNavigationBarTitle({
                title: res.data.data.brandInfo.n
              })
                this.setData({
                    brandDetails: res.data.data.brandInfo,
                    goodsList: data,
                    hidden: true
                })
                var that = this
                WxParse.wxParse('article', 'html', this.data.brandDetails.d, that, 5)
            }
        })
        this.compHeight()
    },
  productDetails(e){
    wx.navigateTo({
      url: '/pages/product-Details/product-Details?id=' + e.currentTarget.dataset.index.i + "&sou=" + e.currentTarget.dataset.index.sou
    })
  },
    //综合
    changeTab1() {
        this.setData({
            goodsList: [],
            isTab1Active: true,
            isTab2Active: false,
            isTab3Active: false,
            priceType: 0,
            num: 0,
            page: 1,
            limit: 10,
        })
        this.init()
    },
    // 销量
    changeTab2() {

        this.setData({
            goodsList: [],
            isTab2Active: true,
            isTab1Active: false,
            isTab3Active: false,
            priceType: '',
            num: 0,
            page: 1,
            limit: 10,
        })
        this.init()
    },
    // 价格
    changeUpDown() {
        var price = this.data.priceType == 0 ? 1 : 0;
        this.setData({
            goodsList: [],
            isActive: !this.data.isActive,
            isTab3Active: true,
            isTab2Active: false,
            isTab1Active: false,
            priceType: price,
            num: '',
            page: 1,
            limit: 10,
        })
        this.init()
    },
    ellipsis: function() {
        var value = !this.data.ellipsis;
        this.setData({
            ellipsis: value
        })
    },
    listChange() {
        this.setData({
            isChange: !this.data.isChange
        })
    },
    cancel() {
        wx.navigateBack({
            delta: 1
        })
    },
    compHeight() {
        var that = this;
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    scrollHeight: res.windowHeight
                });
                console.log("设备高度scrollHeight==" + res.windowHeight);
            }
        });
    },
    //页面滑动到底部
    bindDownLoad: function() { //下拉刷新
      if (isOver){
        return app.util.showToast("已经没有了哦")
      }
        this.data.page++
            this.init()
    },
    scroll: function(event) {
        //该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
        // console.log("滚动时触发scrollTop==" + event.detail.scrollTop);

    },

    topLoad: function(event) { //上拉刷新

        // console.log("重新加载");
    },
    //加入购物车
    addCart(e) {
        if (app.user.openid) {
            console.log(e)
            app.api.request('addCart_api', {
                "pId": e.currentTarget.dataset.target.i,
                "mId": app.user.id,
                "num": 1

            }, res => {
                console.log(res)
                if (res.data.code == 0) {
                    this.data.goodsList.forEach((res, index) => {
                        if (res.i == e.currentTarget.dataset.target.i) {
                            var o = "carts[" + index + "].sum"
                            e.currentTarget.dataset.target.sss++
                                this.setData({
                                    [o]: e.currentTarget.dataset.target.sss
                                })
                        }
                    })
                    wx.showToast({
                        title: '加入购物车',
                        icon: 'success',
                        duration: 2000
                    })
                }
            })
        } else {
            var box = this.selectComponent('#box');
            box._show();
        }

    },
})