// components/accessBox/accessBox.js
let app=getApp();

Component({
  behaviors:[require("../user-behavior")],
  /**
   * 组件的属性列表
   */
  properties: {
    access:{
      type:Object,
      value:{
        title: String,
        msg: String,
        msg2: String,
        cancle: String,
        confirm: String
      } 
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
     imgUrl:app.api.imgUrl
  },
  /**
   * 组件的方法列表
   */

  methods: {
    cancle: function(){
      this._success(1);
    },
    login: function(e){
      let that = this;
      app.util.getUser(() => {
        that._success(0);
      })
    },  
    _show:function(){
      this.setData({
        hasMask:true
      })
    },
    _hide:function(){
      this.setData({
        hasMask: false
      })
    } 
  }
})
