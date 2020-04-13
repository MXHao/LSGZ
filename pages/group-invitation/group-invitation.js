// pages/group-invitation/group-invitation.js
const app = getApp();
import {
  intervalTime
} from '../../assets/js/initTime.js'
var timeIndex;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{}
  },
  intervalTime: null,
  onLoad(o){
      this.init(o)
  },
  goBack(){
    wx.navigateBack({
      delta: 1
    })
  },
  init(o){
    app.api.request("groupDetails",{id:o.id},res=>{
      this.setData({ info: res.data.data})
      this.intervalTime = intervalTime;
      this.time();
    })
  },
  time(){
    timeIndex = this.intervalTime(this.data.info.endTime,new Date(),()=>{
      clearInterval(timeIndex)
    })
  },
  onHide(){
    clearInterval(timeIndex)
  },
  onUnload(){
    clearInterval(timeIndex)
  },
  onShareAppMessage(){
    return {
      title:app.user.name+'邀请你来拼单啦',
      path: '/pages/Group-details/Group-details?id=' + this.data.info.groupId+'&groupId='+this.data.info.id+'&mId='+app.user.id,
      success(e){
          console.log(e)
      }
    }
  }
})