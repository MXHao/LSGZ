const app = getApp();
Page({
    data: {
        addressList: [],
        editsrc: '/assets/img/home/edit.png',
        delsrc: '/assets/img/home/delete.png',
        currentIndex: 0,
        region: ['请选择'], //地址选择框
        // customItem: ['全部'],
        removeIndex: [],
        isBoxHidden: false,
        addressList2: {},
        nameInput: '', //姓名输入框
        phoneInput: '', //电话输入框
        addetailInput: '', //详细地址输入框
        isEdit: true, //判断是编辑弹窗还是新建弹窗
        editName: '',
        phoneNum: '',
        addressMap: {}



    },
  onLoad: function(options) {

      this.init()
  },
  init() {
    wx.showLoading({
        title: '加载中',
    })
    app.api.request('addressList_api', {
        "mId": app.user.id
    }, res => {
        if (res.data.code == 0) {
          this.setData({
              addressList: res.data.data
          })
          wx.setStorageSync('defaultAddr',res.data.data)
            setTimeout(function() {
                wx.hideLoading()
            }, 1000)
          }
      })
    },
  editDefaultSelect(e) {//修改默认选中你   1  默认地址
    if (e.currentTarget.dataset.index.def == '1') return false;
    const arr = e.currentTarget.dataset.index
    arr.def == '1' ? arr.def = '0' : arr.def = '1'
    arr.id = arr.i
    arr.per = arr.p
    app.api.request('addAddress_api', arr, res => {
      if (res.data.code == 0) {
        this.init()
      }
    })
  },
  selectAddress(e) {
    var pages = getCurrentPages(); // 获取页面栈
    //var currPage = pages[pages.length - 1]; // 当前页面
    var prevPage = pages[pages.length - 2]; // 上一个页面
    if (prevPage.route == "pages/ConfirmOrder/ConfirmOrder") {
      prevPage.setData({
        defaultAddress: e.currentTarget.dataset.index,
        contactPerson: e.currentTarget.dataset.index.p + ' ' + e.currentTarget.dataset.index.phone
      })
      prevPage.init();
      wx.navigateBack({
        delta: 1
      })
    }
  },

  // 新建地址
  showModal(e) {
    var that = this
    wx.getSetting(
    {
      success(res){
        if (res.authSetting['scope.address']) {
          wx.chooseAddress({
            success(res2) {
              console.log(res2)
              if (res2.errMsg = 'chooseAddress:ok') {
                var proCity = Array();
                proCity.push(res2.provinceName)
                proCity.push(res2.cityName)
                proCity.push(res2.countyName)
                that.setData({
                  nameInput:res2.userName,
                  phoneInput: res2.telNumber,
                  isEdit: false,
                  isBoxHidden: !that.data.isBoxHidden,
                  region: proCity,
                  addetailInput: res2.detailInfo
                })
              }
            },fail(res3){
              const arr = e.currentTarget.dataset.target
              that.setData({
                isEdit: false,
                isBoxHidden: !that.data.isBoxHidden,
                nameInput: '',
                phoneInput: '',
                region: '请选择',
                addetailInput: ''
              })
            }
          })
        }
        else {
          const arr = e.currentTarget.dataset.target
          that.setData({
            isEdit: false,
            isBoxHidden: !that.data.isBoxHidden,
            nameInput: '',
            phoneInput: '',
            region: '请选择',
            addetailInput: ''
          })
        }
      }
    });
    
  },
  textareaAInput(e) {
      this.setData({
          textareaAValue: e.detail.value
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 1000)
    },
  // 编辑地址
  edit(e) {
    const arr = e.currentTarget.dataset.target
    this.setData({ addressMap: arr })
    console.log(arr)
    this.setData({
        isEdit: true,
        isBoxHidden: !this.data.isBoxHidden,
        nameInput: arr.p,
        phoneInput: arr.phone,
        region: [arr.pro, arr.city, arr.area],
        addetailInput: arr.addr

    })
  },
  // 姓名输入框事件
  bindNameInput(e) {
      this.setData({
          nameInput: e.detail.value
      })
  },
  // 电话号码输入框事件
  bindPhoneInput(e) {
      this.setData({
          phoneInput: e.detail.value
      })
  },
  // 地址选择框
  RegionChange: function(e) {
      this.setData({
          region: e.detail.value
      })
  },
  //详细地址框
  bindAddetailInput(e) {
      this.setData({
          addetailInput: e.detail.value
      })
  },
  // 保存修改按钮
  saveChange() {
      var name = this.data.nameInput
      var phoneNum = this.data.phoneInput
      var objProCityDisName = this.data.region // 将字符串转换为数组
      var addressDetail = this.data.addetailInput
      if (!name || !phoneNum || !addressDetail) {
          wx.showToast({
              title: '选项不能为空',
              icon: 'none'
          })
      } else if (!(/^1[3456789]\d{9}$/.test(phoneNum))) {
          wx.showToast({
              title: '请输入正确格式的手机号码',
              icon: 'none'
          })
      } else {
          app.api.request('addAddress_api', {
              "id": this.data.addressMap.i,
              "per": name,
              "pho": phoneNum,
              "pro": objProCityDisName[0],
              "city": objProCityDisName[1],
              "area": objProCityDisName[2],
              "addr": addressDetail,
              "def": this.data.addressMap.def,
          }, res => {
              console.log(res)
              if (res.data.code == 0) {
                  this.init()
                  this.setData({
                      isBoxHidden: !this.data.isBoxHidden
                  })
              }
          })
      }
    },
    // 关闭弹窗
    hideModal(e) {
        this.setData({
            isBoxHidden: !this.data.isBoxHidden
        })
    },
    // 跳转自提点查询并传递参数
    lifting: function(e) {
        wx.navigateTo({
            url: '/pages/lifting/lifting?index=' + JSON.stringify(e.currentTarget.dataset.target)
        })
    },
    // 标签点击事件
    // handleSelectChange(e) {

    //   console.log(e.currentTarget.dataset.index)
    //   const index = e.currentTarget.dataset.index
    //   this.setData({
    //     currentIndex: index
    //   })
    // },
    // 删除
    del(e) {
        console.log(e)
        const that = this
        wx.showModal({
            title: '提示',
            content: '是否确定要删除？',
            success: function(res) {
                if (res.confirm) {
                    // console.log(res)
                    // const id = e.currentTarget.dataset.index
                    // console.log(id)
                    // const newList = that.data.addressList
                    // newList.splice(id, 1);
                    // console.log(newList)
                    // that.setData({
                    //   addressList: newList
                    // })

                    app.api.request('deleAddress_api', {
                        "id": e.currentTarget.dataset.index.i
                    }, res => {
                        if (res.data.code == 0) {
                            that.init()
                        }
                    })

                }

            }
        })

    },

    // 表单提交事件
    formSubmit(e) {
        this.setData({
            isEdit: false
        })
        console.log(e.detail)
        var name = e.detail.value.name
        var phoneNum = e.detail.value.phone
        var proCityDisName = e.detail.value.proCityDisName
        var objProCityDisName = proCityDisName.split(",") // 将字符串转换为数组
        var addressDetail = e.detail.value.addressDetail
        console.log(name + "," + phoneNum + "," + proCityDisName + "," + addressDetail); //输出该文本
        console.log(proCityDisName);


        if (!name || !phoneNum || proCityDisName == '请选择' || !addressDetail) {
            wx.showToast({
                title: '选项不能为空',
                icon: 'none'
            })
        } else if (!(/^1[3456789]\d{9}$/.test(phoneNum))) {
            wx.showToast({
                title: '请输入正确格式的手机号码',
                icon: 'none'
            })
        } else {
            console.log()
            app.api.request('addAddress_api', {
                "crea": app.user.id,
                "per": e.detail.value.name,
                "pho": e.detail.value.phone,
                "pro": objProCityDisName[0],
                "city": objProCityDisName[1],
                "area": objProCityDisName[2],
                "addr": e.detail.value.addressDetail,
                "def": '',

            }, res => {
                console.log(res)
                if (res.data.code == 0) {
                    // var addressList2 = this.data.addressList
                    // console.log(addressList2)
                    // addressList2.push(arr);
                    // console.log(addressList2)
                    this.init()
                    this.setData({
                        // addressList: addressList2,
                        isBoxHidden: !this.data.isBoxHidden
                    })
                }
            })

        }
    }
})