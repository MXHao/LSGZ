// pages/more/feedback.js
const app = getApp();
Page({
    data: {
        // 评价图片
        starCheckedImgUrl: "/assets/img/home/star2.png",
        starUnCheckedImgUrl: "/assets/img/home/star1.png",
        imgList: [],
        text:"",
        // 建议内容
        starMap: [
            '非常差',
            '差',
            '一般',
            '好',
            '非常好',
        ],

        evaluations: [{
            id: 0,
            star: 5,
            note: "非常好"
        }],
        evaluations1: [{
            id: 0,
          star: 5,
          note: "非常好"
        }],
        evaluations2: [{
            id: 0,
          star: 5,
          note: "非常好"
        }],
    },
    onLoad(e){
      let product = JSON.parse(decodeURIComponent(e.item));
      this.setData({product:product})
    },
    /**
     * 评分
     */
    chooseStar: function(e) {
        const index = e.currentTarget.dataset.index;
        const star = e.target.dataset.star;
        let evaluations = this.data.evaluations;
        let evaluation = evaluations[index];
        // console.log(evaluation)
        evaluation.star = star;
        evaluation.note = this.data.starMap[star - 1];
        this.setData({
            evaluations: evaluations
        })
    },
    chooseStar1: function(e) {
        const index = e.currentTarget.dataset.index;
        const star = e.target.dataset.star;
        let evaluations1 = this.data.evaluations1;
        let evaluation = evaluations1[index];
        // console.log(evaluation)
        evaluation.star = star;
        evaluation.note = this.data.starMap[star - 1];
        this.setData({
            evaluations1: evaluations1
        })
    },
  textareaAInput(e){
    this.setData({ text: e.detail.value})
  },
    chooseStar2: function(e) {
        const index = e.currentTarget.dataset.index;
        const star = e.target.dataset.star;
        let evaluations2 = this.data.evaluations2;
        let evaluation = evaluations2[index];
        // console.log(evaluation)
        evaluation.star = star;
        evaluation.note = this.data.starMap[star - 1];
        this.setData({
            evaluations2: evaluations2
        })
    },
  DelImg(e){
    let that = this;
    let index = e.currentTarget.dataset.index;
    that.data.imgList.splice(index,1);
    that.setData({
      imgList: that.data.imgList
    })
  },
    ChooseImage(e) {
      let that=this;
      let index = e.currentTarget.dataset.index;
        wx.chooseImage({
          count: 1, //默认9
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
            success: (res) => {
              const tempFilePaths = res.tempFilePaths
              wx.uploadFile({
                url: app.api.uploadUrl, //仅为示例，非真实的接口地址
                filePath: tempFilePaths[0],
                formData: { 'mId': app.user['id'] ? app.user['id'] : '' },
                name: 'file',
                success(res) {
                  let data = JSON.parse(res.data).data
                  if (index == '-1') {
                    that.data.imgList.push(data.enclosure)
                    that.setData({
                      imgList: that.data.imgList
                    })
                  } else {
                    let todo = 'imgList[' + index + ']'
                    that.setData({
                      [todo]: data.enclosure
                    })
                  }
                }
              })
            }
        });
    },
  submit(){
    let arr=[];
    this.data.product.forEach(o=>{
      arr.push({
        orderId: o.orderId,
        productId: o.productId,
        contents: this.data.text,
        productEval: this.data.evaluations[0].star,
        transEval: this.data.evaluations1[0].star,
        serviceEval: this.data.evaluations2[0].star,
        imgs: this.data.imgList,
        source: o.source
      })
    })
    app.api.request("evaOrder", {
      arr: arr,
      orderId:this.data.product[0].orderId,
      imgs:this.data.imgList
     },res=>{
       wx.navigateBack({
         delta: 1
       })
    })
  }
})