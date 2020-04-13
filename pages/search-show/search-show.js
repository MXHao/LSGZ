
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    autoFocus: true,
    keyWord: '',
    type: '',
    flag: '',
    icon: [{ name: 'search', isShow: true }],
    inputVal:'',
    sercherStorage: [],
    StorageFlag: false,
    popularList: [],
    defaultKeyword:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (o) {
    console.log(o)
    this.setData({
      type: o.type?o.type:'',
      flag: o.flag?o.flag:'',
      defaultKeyword:o.keyWord
    });
    app.api.request('getPopular',  res => {
      this.setData({
        popularList: res.data.data
      })

    })
    
  },
  onShow: function() {
    var searchData = wx.getStorageSync('searchData');
    this.setData({
      sercherStorage: searchData,
    });
  },
  //清除缓存历史
  clearSearchStorage: function () {
    wx.showModal({
      title: '提示',
      content: '确认删除全部历史搜索记录？',
      success: res => {
        if (res.confirm) {
          wx.removeStorageSync('searchData')
          this.setData({
            sercherStorage: [],
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },

  bindKeyInput: function (e) {//输入事件
    this.setData({
      keyWord: e.detail.value
    })
  },
  // 搜索按钮
  searchBtn: function (e) {
    var self = this;
    if (self.data.keyWord.length == 0 ) {
      self.data.keyWord = this.data.defaultKeyword;
    }
    //控制搜索历史
    var self = this;
    if (this.data.keyWord != '') {
      //将搜索记录更新到缓存
      if (self.data.sercherStorage) {
        //利用过滤器去重
        var searchData = self.data.sercherStorage.filter(function (name) {
          return name !== self.data.keyWord
        });
      }
      else {
        searchData = []
      }
      //倒序排列
      searchData = searchData.reverse();
      //插入最后一个
      searchData.push(self.data.keyWord)
      //再次倒序排列
      searchData = searchData.reverse();
      //大于一定数量，清理最后一个
      if (searchData.length > 10) {
        searchData.pop();
      }
      wx.setStorageSync('searchData', searchData);
    }
    wx.navigateTo({
      url: '/pages/search-list/search-list?searchValue=' + this.data.keyWord + '&type=' + this.data.type + '&flag=' + '',
    })

  },
  historySearch(e) {//点击历史搜索进行搜索
    var name = e.currentTarget.dataset.keyword
    this.setData({
      keyWord:name
    })
    wx.navigateTo({
      url: '/pages/search-list/search-list?searchValue=' + this.data.keyWord + '&type=' + this.data.type + '&flag=' + '',
    })

  },
  popularSearch(e) {//点击推荐搜索进行搜索
    var index = e.currentTarget.dataset.index
    console.log(index)
    this.setData({
      keyWord: this.data.popularList[index]
    })
    wx.navigateTo({
      url: '/pages/search-list/search-list?searchValue=' + this.data.keyWord + '&type=' + this.data.type + '&flag=' + '',
    })
  },
  searchFunction(e) {//键盘回车搜索
    this.searchBtn(e);
  }
})