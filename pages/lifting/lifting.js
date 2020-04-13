// pages/lifting/lifting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultIndex: 0,
    addressList: [{
        'name': '友谊医院1',
        'num': '1001',
        'detail': '陕西省西安市莲湖区锦绣华庭',
        'distance': 1.5
      },
      {
        'name': '友谊医院2',
        'num': '1001',
        'detail': '陕西省西安市莲湖区锦绣华庭',
        'distance': 1.5
      },
      {
        'name': '友谊医院3',
        'num': '1001',
        'detail': '陕西省西安市莲湖区锦绣华庭',
        'distance': 1.5
      }
    ]
  },
  // 页面加载接收参数
  onLoad: function(option) {
    const pages = getCurrentPages()
    const data = pages[pages.length - 2].__data__
    // console.log(data)
    const list = data.addressList
    // console.log(list)
    const index = data.currentIndex
    // console.log(index)
    console.log(list[index])

  },
  // 页面退回传递参数
  onUnload: function(e) {
    const pages = getCurrentPages()
    const list = pages[pages.length - 1].__data__.addressList
    const index = pages[pages.length - 1].__data__.defaultIndex
    console.log(list[index])
  },
// 点击切换标签状态
  handleSelectChange(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      defaultIndex: index
    })
  }
})