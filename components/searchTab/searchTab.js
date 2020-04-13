// components/search/searchTab/searchTab.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 横纵切换
    isChange: true,
    // 价格上下箭头
    isActive: true,
    // 综合，销量，价格
    isTab1Active: true,
    isTab2Active: false,
    isTab3Active: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * type 1 :综合
     */
    // _changeTab:function(e){
    //   this.triggerEvent('changeTab', e) 
    // },
    onTap() {

    },
    _changeTab1(e) {
      this.setData({
        isTab1Active: true,
        isTab2Active: false,
        isTab3Active: false,
      })
      this.triggerEvent('_changeTab1', e)
      
    },
    _changeTab2(e) {
      this.setData({
        isTab2Active: true,
        isTab1Active: false,
        isTab3Active: false,

      })
      this.triggerEvent('_changeTab2', e)
    },
    _changeUpDown(e) {
      this.setData({
        isActive: !this.data.isActive,
        isTab3Active: true,
        isTab2Active: false,
        isTab1Active: false,
      })
      this.triggerEvent('_changeUpDown', e)
    },
    _listChange(e) {
      this.setData({
        isChange: !this.data.isChange
      })
      this.triggerEvent('_listChange', e)
    }
  }
})
