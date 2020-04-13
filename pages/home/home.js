const app = getApp();
import { getCurrentDate, getCurrentDate1, intervalTime } from '../../assets/js/initTime.js'
import { setWatcher, observe } from '../../assets/js/watch.js'
Page({
    /**
     * 页面的初始数据
     */
    data: {
        hasMask: true,
        access: {
            title: "获取授权",
            msg: '进行下一步操作需要',
            msg2: '获得您的公开信息(昵称、头像等)',
            cancle: '取消',
            confirm: '允许'
        },
        coupon: null,
        isCouponCollectionShow: false, //新人优惠券领取弹窗
        bannerList: [], //轮播图
        recommend_1F: [], //猫狗主粮
        recommend_2F: [], //零食玩具
        spike: [], //秒杀
        timeId: '',
        spikeFunction: null,
        spikeLastTime: '', //秒杀剩余时间
        allBrand: [], //所有品牌
        newProduct: [], //新品推荐
        likeProduct: [], //猜你喜欢
        imgUrl: '',
        isSecKillShow: false,//秒杀是否显示
        isPlus:0,
        page: 1,
        detail: {},
        foodImg:{},
        snackImg:'',
        brandImg:'',
        newproductImg:'',
        newPersonImg:'',
        plusImg:'',
        foodTitle:'',
        snackTitle:'',
        brandTitle:'',
        newTitle:'',
        searchDefault:''
    },
    /**
     * 生命周期函数--监听页面加载
     */
  test(){
    wx.requestSubscribeMessage({
      tmplIds: ['5CFJqaQb2Ibh-8AiimPxxS7GC4qTMT-juQWe1LdRAC0'],
      success(res) {
        console.log(res)
       }
    })
  },
  onLoad: function (options) {

    app.shopId=options.shopId;

    let baseUrl = app.api.imgUrl
    this.setData({
      imgUrl: baseUrl,
      catImg: baseUrl + '/img/home/cat.png',
      dogImg: baseUrl + '/img/home/dog.png',
      bargainImg: baseUrl + '/img/home/bargain.png',
      groupBuyingImg: baseUrl + '/img/home/group-buying.png',
      tailingsImg: baseUrl + '/img/home/tailings.png',
      goTop: baseUrl + '/img/home/goTop.png',
      homeIcon: baseUrl + '/img/home/home-icon.png',
    })
  },
    render() {
        this.getAllData()
    },
    watch: {
        spikeLastTime: function(newValue, oldVal) {
            // console.log(newValue)
            if (newValue == "00:00:01") {
                var that = this
                setTimeout(res => {
                    that.getAllData()
                }, 2000)

            }
        },
    },
    // 搜索
    goSearch: function() {
        app.util.goSearch(this.data.searchDefault)
    },
    goLink:function(o){
      console.log(o)
      app.util.goAdsLink(o)
    },
    getAllData: function() {
        // wx.showLoading({
        //   title: '加载中',
        // })
        this.data.bannerList = []
        this.data.allBrand = []
        this.setData({isPlus:app.user.isPlus,page:0})
        app.api.request('getHomeDataList_api', {
            "site": 0,
            "mid": app.user.id
        }, res => {
            if (res.data.code == "0") {
              console.log(res)
              // var _length = res.data.data.brand.length
              var _length = 20
              var swiperItemNum = _length % 6 == 0 ? _length/6 : _length/6 + 1
              var value = wx.getStorageSync('history')
              wx.setStorageSync('defaultAddr', res.data.data.defaultAddr);
              wx.setStorageSync('bannerInfo', res.data.data.banner);
              var sysParam = wx.getStorageSync("sysParam")
              this.setData({
                isNew:app.isNew,
                foodTitle:sysParam.foods_title,
                snackTitle: sysParam.snacks_title,
                brandTitle: sysParam.brand_title,
                newTitle: sysParam.new_title,
                searchDefault:sysParam.index_search
              })
              if (res.data.data.banner[4] != null) {
                this.setData({
                    bannerList: res.data.data.banner[0],
                    detail: res.data.data,
                    foodImg:res.data.data.banner[4][0]
                })
              }
              if (res.data.data.banner[5] != null) {
                this.setData({
                  snackImg: res.data.data.banner[5][0]
                })
              }
              this.setData({
                plusImg:sysParam.plus_indeximg
              })
              if (res.data.data.banner[13] != null) {
                this.setData({
                  brandImg: res.data.data.banner[13][0]
                })
              }
              if (res.data.data.banner[14] != null) {
                this.setData({
                  newproductImg: res.data.data.banner[14][0]
                })
              }
              for (let i = 1; i <= swiperItemNum; i++) {
                var obj = {}
                // obj.list = res.data.data.brand.slice((i - 1) * 6, i * 6)
                obj.list = 3
                this.data.allBrand.push(obj)
              }
              this.setData({
                // allBrand: this.data.allBrand,
                // recommend_1F: res.data.data.foodProduct,
                recommend_1F: res.data.data.TenRMBtProduct,
                // recommend_2F: res.data.data.snacksProduct,
                recommend_2F: res.data.data.TwentyRMBtProductProduct,
                // newProduct: res.data.data.newProduct,
                //likeProduct: res.data.data.likeProduct,
                // spike: res.data.data.seckillProduct,
                coupon: res.data.data.newPeo ? res.data.data.newPeo : null,
                fiveDiscount: res.data.data.fiveDiscountProduct,
                sevenDiscount: res.data.data.sevenDiscountProduct,
              })
              if(this.data.coupon == null) {
                this.setData({
                  isCouponCollectionShow: false
                })
              }
              // if (this.data.spike.length > 0) {
                if(false){
                let endTime = new Date(getCurrentDate() + " " + this.data.spike[0].s).getTime() + 1000 * 60 * 60
                this.data.timeId = this.spikeFunction(endTime, new Date(), this.getAllData)
              }
              // if(res.data.data.seckillProduct.length < 4) {
              //   this.setData({
              //     isSecKillShow: false
              //   })
              // }
              if (value){
                // this.setData({ newProduct: [] })
                // console.log(this.data.newProduct)
                wx.getStorage({
                  key: 'history',
                  success: res => {
                    // console.log(res)
                    this.setData({
                      // newProduct: res.data.newProduct,
                      page: res.data.page
                    })
                  },
                })
                wx.removeStorage({
                  key: 'history',
                  success: res=> {
                    // console.log(res)
                  },
                })
              }else{
                this.setData({
                  // newProduct: res.data.data.newProduct,
                })
              }
             
             
              wx.stopPullDownRefresh()
            }
        })
    },
    onPullDownRefresh: function() {
        this.getAllData()
    },
    // 商品详情
    productDetails: function(e) {
        var res = e.currentTarget.dataset.index
        console.log(res)
        wx.navigateTo({
            url: '/pages/product-Details/product-Details?id=' + res.i + "&sou=" + res.sou,

        })
        wx.setStorage({
          key: 'history',
          data: {
            // newProduct: this.data.newProduct,
            page: this.data.page
          }
        })
    },
    // 新人特惠
    NewOffer: function() {
        if (app.user.openid) {
            wx.navigateTo({
                url: '/pages/NewOffer/NewOffer',
            })
        } else {
            var box = this.selectComponent('#box');
            box._show();

        }

    },
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

    CouponCollection() {
        if (app.user.openid) {
            this.setData({
                isCouponCollectionShow: true
            })
        } else {
            var box = this.selectComponent('#box');
            box._show();

        }

    },
    // 优惠券领取
    getCoupon(e) {
        app.api.request('getCoupon_api', {
            "mId": app.user.id,
            "id": e.currentTarget.dataset.target.id,
            "cDate": getCurrentDate1()
        }, res => {
            if (res.data.code == 0) {
                wx.showToast({
                    title: '领取成功',
                    duration: 2000
                })
                this.handleBoxShow()
                this.getAllData() 
            } else {
                wx.showToast({
                    title: res.data.msg,
                    duration: 2000
                })
            }
        })
    },
    // 关闭优惠券弹窗
    handleBoxShow(e) {

        // console.log('点击了关闭')
        this.setData({
            isCouponCollectionShow: false
        })
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
    toSuperBrand: function() {
        wx.navigateTo({
            url: '/pages/super-brand/super-brand',
        })
    },

    toCat: function() {
        wx.navigateTo({
            url: '/pages/cat/cat?who=' + '1',
        })
    },
    toDog: function() {
      wx.navigateTo({
              url: '/pages/cat/cat?who=' + '2',
      })
           
    },
  toNewOffer: function() {
        wx.navigateTo({
          url: '/pages/NewOffer/NewOffer',
        })
    },
    toNewGroup: function(e) { //团购跳转
        wx.navigateTo({
            url: '/pages/NewGroup/NewGroup',
        })
    },
    toDeviceList() {//设备列表跳转
        wx.navigateTo({
            url: '/pages/deviceList/deviceList',
        })
    },
    toShopping: function() {
        wx.navigateTo({
            url: '/pages/shopping/shopping',
        })
    },
  toOfflineService() {
    wx.navigateTo({
      url: '/pages/service-list/service-list',
    })
  },
    toSpike: function() {
        wx.navigateTo({
            url: '/pages/Spike/Spike'
        })
    },
    toBrandDetails(e) {
        wx.navigateTo({
            url: '/pages/brand-details/brand-details?id=' + e.currentTarget.dataset.index.i,
        })
    },
    toSearchList(e) {
        wx.navigateTo({
            url: '/pages/search-list/search-list?flag=' + e.currentTarget.dataset.target
        })
    },
    toOpenMember() {
        wx.navigateTo({
            url: '/pages/membership-open/membership-open',
        })
    },
    spikeDetails(e) { //秒杀
        // console.log(e.currentTarget.dataset.index)
        var res = e.currentTarget.dataset.index
        wx.navigateTo({
            url: '/pages/seckillDetails/seckillDetails?id=' + res.i + "&sou=" + res.sou,
        })

    },
    onHide: function() {
        // console.log("+++++++++++++++++++++")
        clearInterval(this.data.timeId)

    },

    onShow: function() {
        setWatcher(this)
        this.render()
        this.spikeFunction = intervalTime
      
      // console.log(this.data.newProduct)
    },
  // 上拉加载更多
  onReachBottom: function () {
    var that = this;
    // if (that.data.newProduct.length < this.data.detail.newProductCount) {
      if (false){
      // 显示加载图标
      wx.showLoading({
        title: '玩命加载中',
      })
      // 页数+1
      that.data.page = that.data.page + 1;
      app.api.request('getNewProduct_api', {
        'limit': 6,
        'page': that.data.page
      }, res => {
        // console.log(res)
        const newProListTmp = that.data.newProduct.concat(res.data.data.list);

        that.setData({
          // newProduct: newProListTmp
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