const app = getApp();
Page({
  data: {
    productMap:{},
    type:0,
    page:1,
    limit:5,
    numMap:{},
    commentList:[],
    scrollTop: 0,
    scrollHeight: 0,
    hidden: true,
    evList: []
  },
  onLoad: function (res) {
    this.setData({
      productMap: JSON.parse(res.id) 
    })
    console.log(this.data.productMap)
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
        console.log("设备高度scrollHeight==" + res.windowHeight);
      }
    });
    that.init()

  },
  access(){

  },
  render() { },
  init(){
    app.api.request('moreComment',{
      id: this.data.productMap['pId'] ? this.data.productMap['pId']:this.data.productMap.id,
      page: this.data.page,
      limit: this.data.limit,
      type:this.data.type
    },res=>{
      if(res.data.code==0){
        var that=this
        var data = that.data.commentList.concat(...res.data.data.eva)
        // console.log(data)
        that.setData({
          numMap:res.data.data,
          commentList: data,
          evList: res.data.data.eva
        })
        that.setData({
          hidden:true
        })
        console.log(that.data.commentList)   
      }
    })
  },
  changeTag(res){
    console.log(res)
    this.setData({
      type: res.currentTarget.dataset.id,
      page:1,
      limit:10,
      commentList:[]
    })

    this.init()
  },
  //页面滑动到底部
  bindDownLoad: function () {//下拉刷新
    console.log("lower");
    this.data.page++
    this.setData({
      hidden:false
    })
    this.init()

  },
  scroll: function (event) {
    //该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
    // console.log("滚动时触发scrollTop==" + event.detail.scrollTop);

  },
  clickImg(e) {
    console.log(e)
    wx.previewImage({

      urls: this.data.evList[e.currentTarget.dataset.ddid].evM,
      current: this.data.evList[e.currentTarget.dataset.ddid].evM[e.currentTarget.dataset.id]
    })
  },
  onReachBottom: function () {
    console.log("重新加载");
  },
})