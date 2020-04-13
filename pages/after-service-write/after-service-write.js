const app =getApp();
import {
  initPrice
} from '../../assets/js/initPrice.js'
// pages/after-service-write/after-service-write.js
Page({
  data: {
    // input默认是1  
    num: 1,
    // 使用data数据对象设置样式名  
    minusStatus: 'disabled',
    minusaStatus:'add',
    // flag初始为true
    flag: true, //控制单选按钮
    flag1: true, //控制收货状态弹窗
    flag2: true, //控制申请原因状态
    flag3: true,//线下订单申请原因弹窗
    defaultValue1: '点击选择货物状态', //收货状态默认值
    defaultValue2: '点击选择申请原因', //申请原因默认值
    imgs:[],
    sumPrice:0,
    orderType: '',
    stateList: [{//线上订单选项
        name: '1',
        value: '多拍，拍错，不想要',
        checked: 'true'
      },
      {
        name: '2',
        value: '不喜欢，效果不好", "材质与商品不符',
        checked: 'true'
      },
      {
        name: '3',
        value: '质量不符',
        checked: 'true'
      },
      {
        name: '4',
        value: '做工粗糙，有瑕疵',
        checked: 'true'
      },
      {
        name: '5',
        value: '卖家发错货',
        checked: 'true'
      }
    ],
    stateList2: [{//线下订单选项
      name: '1',
      value: '货物未掉落',
      checked: 'true'
    },
    {
      name: '2',
      value: '掉落产品与实际不符',
      checked: 'true'
    },
    {
      name: '3',
      value: '包装破损',
      checked: 'true'
    }
    ],
    reasonList: [{
        name: 1,
        value: '未收到货'
      },
      {
        name: 2,
        value: '已收到货'
      }
    ],
    isReceivingShow: '',

  },
  onLoad(e) {
    console.log(e.type)
    let product = JSON.parse(decodeURIComponent(e.item));
    let num=0;
    product.orderDesc = product.orderDesc.map(o=>{
       num++;
       o['sNum']=0;
       o['proportion'] = o.price / product.totalPrice
       return o;
    })
    let plus=product.absPrice/(product.totalPrice-product.couponPrice)
    this.setData({
      item: product,
      conponPrice: product.couponPrice/num,
      plus: plus,
      show: parseInt(e.isShow),
      orderType: e.type
    })
    console.log(this.data)
    this.countPrice();
  },
  /* 点击减号 */
  bindMinus: function(e) {
    var num = this.data.item.orderDesc[e.currentTarget.dataset.index].sNum;
    // 如果大于1时，才可以减  
    if (num > 0) {
      num--;
    }
    // 将数值与状态写回  
    let item = 'item.orderDesc[' + e.currentTarget.dataset.index+'].sNum'
    this.setData({
      [item]: num,
    });
    this.countPrice();
  },
  /* 点击加号 */
  bindPlus: function(e) {
    var num = this.data.item.orderDesc[e.currentTarget.dataset.index].sNum;
    // 不作过多考虑自增1  
    if (num < this.data.item.orderDesc[e.currentTarget.dataset.index].num - this.data.item.orderDesc[e.currentTarget.dataset.index].refundNum) {
      num++;
    }
    let item = 'item.orderDesc[' + e.currentTarget.dataset.index + '].sNum'
    this.setData({
      [item]: num,
    });
    this.countPrice();
  },
  // 弹窗
  showBox1() {
    this.setData({
      flag1: false
    })
  },
  boxHidden1() {
    console.log(123)
    this.setData({
      flag1: true
    })
  },
  showBox2() {
    this.setData({
      flag2: false
    })
  },
  boxHidden2() {
    this.setData({
      flag2: true
    })
  },
  countPrice(){
    let sum =0;
    let that = this; 
    this.data.item.orderDesc.forEach(o => {
      let tmpM = o.sNum * (o.proportion * that.data.item.absPrice)
      sum += o.sNum * (o.proportion*that.data.item.absPrice)
      o['money'] = o.sNum * (o.proportion * that.data.item.absPrice);
    })
    sum=sum==0?0:sum<=0.01?0.01:initPrice(sum, 2);
    if (sum > this.data.item.unRefundMoney){
      sum = this.data.item.unRefundMoney;
    }
    this.setData({ sumPrice: sum })
  },
  // 收货状态单选
  radioChange(e) {
    this.setData({
      defaultValue1: e.detail.value
    })
  },
  // 申请原因多选
  checkboxChange(e) {
    if (e.detail.value == '') {
      this.setData({
        defaultValue2: '点击选择申请原因'

      })
    } else {
      this.setData({
        defaultValue2: e.detail.value
      })
    }
  },
  StopBubbles() {//组织冒泡
    
  },
  // 按钮切换状态
  iconSuccess() {
    this.setData({
      flag: false
    })
  },
  iconCircle() {
    this.setData({
      flag: true
    })
  },
  submit(){
    if(this.data.sumPrice==0){
      return app.util.showToast("请选择需要退换的商品")
    }
    if (this.data.defaultValue2 =='点击选择申请原因'){
      return app.util.showToast("请选择申请原因")
    }
    // if (this.data.defaultValue1 == '请选择货物状态' && this.data.show == 0) {
    //   return app.util.showToast("请选择货物状态")
    // }
    let arr=[];
    this.data.item.orderDesc.forEach(o=>{
      arr.push({
        id: o.dId,
        money: o.money ==0? 0 : o.money <= 0.01 ? 0.01 : initPrice(o.money, 2),
        num:o.sNum
      })
    })
    app.api.request("insertRefund", { orderId: this.data.item.id, refundReason: this.data.defaultValue2, refundType: this.data.show, refund:arr,imgs:this.data.imgs},res=>{
      wx.navigateBack({
        delta: 2
      })
    })
  },
  cloesImg(e){
    this.data.imgs.splice(e.currentTarget.dataset.index, 1)
    this.setData({ imgs: this.data.imgs})
  },
  // 上传图片
  chooseImage(e) {
    let index=e.currentTarget.dataset.index;
    let that = this;
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: app.api.uploadUrl, //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          formData: { 'mId' : app.user['id'] ? app.user['id'] : '' },
          name: 'file',
          success(res) {
            let data = JSON.parse(res.data).data
            if(index=='-1'){
              that.data.imgs.push(data.enclosure)
              that.setData({
                imgs: that.data.imgs
              })
            }else{
              let todo = 'imgs['+index+']'
              that.setData({
                [todo]: data.enclosure
              })
            }
          }
        })
      }
    });
  }
})