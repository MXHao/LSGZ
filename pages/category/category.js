const app = getApp()
Page({
  data: {
    TabCur: 0,
    MainCur: 0,
    VerticalNavTop: 0,
    load: true,
    list: [],
    searchTitle:''
  },
  onLoad() {
    var param = wx.getStorageSync('sysParam');
    this.setData({
      searchTitle:param.class_search
    })
    this.init()
  },
  onShow(){
  },
  init(){
    app.api.request('categoryList_api', {},res=>{
      console.log(res)
      if(res.data.code==0){
        wx.showLoading({
          title: '加载中...',
          mask: true
        });
        this.setData({
          list: res.data.data,
        })
        var list = this.data.list
        for (let i = 0; i < this.data.list.length; i++) {
          list[i].id = i;
        }
        wx.hideLoading()
      }
    })
  },
  onReady() {
    
  },
  goSearch() {
    app.util.goSearch(this.data.searchTitle)
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
  },
  VerticalMain(e) {
    let that = this;
    let list = this.data.list;
    let tabHeight = 0;
    if (this.data.load) {
      for (let i = 0; i < list.length; i++) {
        let view = wx.createSelectorQuery().select("#main-" + list[i].id);
        view.fields({
          size: true
        }, data => {
          list[i].top = tabHeight;
          tabHeight = tabHeight + data.height;
          list[i].bottom = tabHeight;
        }).exec();
      }
      that.setData({
        load: false,
        list: list
      })
    }
    let scrollTop = e.detail.scrollTop + 20;
    for (let i = 0; i < list.length; i++) {
      if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
        that.setData({
          VerticalNavTop: (list[i].id - 1) * 50,
          TabCur: list[i].id
        })
        return false
      }
    }
  },
  toSearchByClass(e) {
    console.log(e.currentTarget.dataset.res.id)
    console.log(e.currentTarget.dataset.res.name)
    console.log(e)
    const classId = e.currentTarget.dataset.res.id
    const keyWord = e.currentTarget.dataset.res.name
    wx.navigateTo({
      url: '/pages/search-list/search-list?flag=4&keyWord=' + keyWord + "&classId=" + classId + "&ctype=" + 0,
    })
  }
})