// pages/NewGroup/NewGroup.js
const app = getApp();
import {
    getCurrentDate,
    intervalTime
} from '../../assets/js/initTime.js'
import {
    setWatcher,
    observe
} from '../../assets/js/watch.js'
import {
    DeepClone
} from '../../assets/js/deepClone.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsList: [],
        page: 1, //页数
        total: 0, //请求到的总数据
        imgUrl: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
      let baseUrl = app.api.imgUrl
      this.setData({
        imgUrl: baseUrl
      })
      console.log(this.data.imgUrl)
        console.log(options)
            // 网络请求
        app.api.request('getGroup_api', {
            'limit': 6,
            'page': this.data.page
        }, res => {
            console.log(res.data.data.list)
            this.setData({
                goodsList: res.data.data.list,
                total: res.data.data.total
            })

        })
    },

    // 上拉加载更多
    onReachBottom: function() {
        var that = this;
        if (that.data.goodsList.length < this.data.total) {
            // 显示加载图标
            wx.showLoading({
                    title: '玩命加载中',
                })
                // 页数+1
            that.data.page = that.data.page + 1;
            app.api.request('getGroup_api', {
                'limit': 6,
                'page': that.data.page
            }, res => {
                console.log(that.data.goodsList)
                const goodsListTmp = that.data.goodsList.concat(res.data.data.list);

                that.setData({
                    goodsList: goodsListTmp
                })
            })
            wx.hideLoading();
        } else {
            wx.showToast({
                title: '已经没有了哦',
                icon: 'none',
            })
        }

    },
    // 团购详情
    GroupDetails: function(e) {
        wx.navigateTo({
                url: '/pages/Group-details/Group-details?id=' + e.currentTarget.dataset.target.id
            })
            // console.log(e.currentTarget.dataset.target.id)
    },

})