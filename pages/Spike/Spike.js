const app = getApp();
import { getCurrentDate, intervalTime } from '../../assets/js/initTime.js'
import { setWatcher, observe } from '../../assets/js/watch.js'
import { DeepClone } from '../../assets/js/deepClone.js'
Page({

    data: {
        TabCur: 0,
        scrollLeft: 0,
        // tabs: ['猫主粮', '狗主粮', '猫零食', '狗粮是', '其他'],
        indexBindClass: 0,
        timeId: '',
        timeList: [],
        allSpike: [],
        spikeLastTime: '',
        spikeFunction: null,
        allProduct: [],
        nowTime: null,
        showProduct: []
    },

    tabSelect(e) {
        this.setData({
            TabCur: e.currentTarget.dataset.id,
            scrollLeft: (e.currentTarget.dataset.id - 1) * 60
        })
    },
    GroupDetails: function(e) {
        console.log(e)
        var res = e.currentTarget.dataset.target
            // wx.navigateTo({
            //   url: '/pages/Group-details/Group-details?id=' + res.i + "&sou=" + res.sou,
            // })
        wx.navigateTo({
            url: '/pages/seckillDetails/seckillDetails?id=' + res.i + "&sou=" + res.sou,
        })

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {},
    getAllSpike(e) {
        app.api.request('allSpike_api', {}, res => {
            console.log(e)
            if (res.data.code == "0") {
                this.setData({
                    allSpike: res.data.data.seckillList
                })
                this.setData({
                    nowTime: new Date().getHours()
                })
                if (this.data.allSpike.length > 0) {
                    this.data.allProduct = DeepClone(this.data.allSpike)
                    console.log(this.data.allSpike)
                    this.data.allSpike.sort(function(a, b) {
                        return a.s.slice(0, a.s.indexOf(":")) - b.s.slice(0, b.s.indexOf(":"))
                    })
                    var timeList = []
                    this.data.allSpike.forEach(res => {
                        timeList.push(res.s.slice(0, res.s.indexOf(":")))
                    })
                    timeList = timeList.filter((a, index, self) => self.indexOf(a) === index)
                    if (parseInt(timeList[0])>1){
                      timeList.unshift(parseInt(timeList[0] - 1))
                      timeList.unshift(parseInt(timeList[0] - 1))
                    }
                  
                    this.setData({
                        timeList: timeList
                    })
                  
                  console.log(timeList)
                    this.filterTime(this.data.timeList[2])
                }
            }

        })
    },
    filterTime(e) {
      if (e.currentTarget){
        let itemIndex = parseInt(e.currentTarget.dataset.index);
        if (this.data.nowTime > parseInt(itemIndex)) {
          return false;
        }
      }
        
        clearInterval(this.data.timeId)
        var s = e.currentTarget ? e.currentTarget.dataset.index : e;
        this.data.timeList.forEach((res, index) => {
            if (res === s) {
                this.setData({
                    indexBindClass: index
                })
            }
        })
        var showProduct = []
        this.data.allProduct.forEach((res, index) => {
            if (res.s.slice(0, 2) === s) {
                showProduct.push(res)
            }
        })
        this.setData({
            showProduct: showProduct
        })
        let endTime = new Date(getCurrentDate() + " " + this.data.showProduct[0].s).getTime() + 1000 * 60 * 60
        this.data.timeId = this.spikeFunction(endTime, new Date(), this.getAllSpike)
    },
    watch: {
        // spikeLastTime: function(newValue, oldVal) {
        //     console.log(newValue)
        //     if (newValue == "00:00:01") {
        //         var that = this
        //         setTimeout(res => {
        //             that.getAllSpike()
        //         }, 2000)
        //     }
        // },
    },

    showModal(e) {
        this.setData({
            modalName: e.currentTarget.dataset.target
        })
    },
    hideModal(e) {
        this.setData({
            modalName: null
        })
    },
    SetColor(e) {
        console.log(e)
        this.setData({
            color: e.currentTarget.dataset.color,
            modalName: null
        })
    },
    SetActive(e) {
        this.setData({
            active: e.detail.value
        })
    },

    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        setWatcher(this)
        this.spikeFunction = intervalTime
        this.getAllSpike()
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    onUnload: function() {
        clearInterval(this.data.timeId)
    },


    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

})