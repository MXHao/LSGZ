
// let host = "http://192.168.1.3:8088/MiniApps-api";
// let host = "http://192.168.1.14:8062/MiniApps-api";
// let host = "http://192.168.1.22:8062/MiniApps-api"
let host = "https://guangzhou.ftsofts.com/MiniApps-api";
let page={
  "pages/seckillDetails/seckillDetails":1,
  "pages/PaymentResult/PaymentResult":1,
  "pages/membership-open/membership-open":1,
  "pages/home/home":1,
  "pages/LogisticsDetails/LogisticsDetails":1,
  "pages/orderDetails/orderDetails": 1,
  "pages/after-service/after service": 1,
  "pages/after-service-write/after-service-write": 1,
  "pages/APPREF/APPREF": 1,
  "pages/MyOrder/MyOrder": 1,
  "pages/ConfirmOrderOn/ConfirmOrderOn": 1,
  "pages/ConfirmOrder/ConfirmOrder": 0,    
  "pages/coupon/coupon": 1,
  "pages/NewOffer/NewOffer": 1,
  "pages/NewGroup/NewGroup": 1,
  "pages/center/center": 1,
  "pages/lifting/lifting": 1,
  "pages/shopping/shopping": 1,
  "pages/shop-cart/shop-cart": 1,
  "pages/address/address": 1,
  "pages/Spike/Spike": 1,
  "pages/Group-details/Group-details": 1,
  "pages/bargain/bargain": 1,
  "pages/dog/dog": 1,
  "pages/cat/cat": 1,
  "pages/brand-details/brand-details": 1,
  "pages/super-brand/super-brand": 1,
  "pages/product-Details/product-Details": 1,
  "pages/product-Details-On/product-Details-On": 0,
  "pages/profile/profile": 1,
  "pages/comment-list/comment-list": 1,
  "pages/search-list/search-list": 1,
  "pages/search-show/search-show": 1,
  "pages/category/category": 1,
  "pages/home/swiper1/swiper1": 1,
  "components/search/search": 1,
  "pages/Evaluation/Evaluation": 1,
  "pages/offline-activity/offline-activity":0,
  "pages/service-Details/service-Details":0
}

let api ={
  getHomeData: { url: `${host}/api/getOpenId.do`,m:"POST"},
  getHomeDataList_api: { url: `${host}/api/getHomeTmp.do`, m: "POST" },
  selectBrandProduct_api: { url: `${host}/api/selectBrandProduct.do`, m: "GET" },//获取品牌下的商品
  search_api: { url: `${host}/api/selectProduct.do`, m: "GET"},//搜索
  allSpike_api: { url: `${host}/api/selectSecKillProductList.do`, m: "GET"},//所有秒杀
  spikeProDeta_api: { url: `${host}/api/selectSecKillProductDetails.do`, m: "GET"},//秒杀商品详情
  productDetails: { url: `${host}/api/selectProductDetail.do`, m: "GET"},//商品详情
  moreComment: { url: `${host}/api/selectMoreEval.do`, m: "GET" },//商品对应的所有评论
  addCart1_api: { url: `${host}/api/insertShoppingCart.do`, m: "POST" },//加入购物车
  addCart_api: { url: `${host}/api/updateShoppingCartSum.do`, m: "POST" },//加入购物车1
  selectCart_api: { url: `${host}/api/selectShoppingInfo.do`, m: "GET" },//查询购物车
  deleteCartProduct_api: { url: `${host}/api/deleteShoppingCart.do`, m: "POST" },//删除购物车商品
  productSort_api: { url: `${host}/api/selectProductList.do`, m: "GET" },//商品分类
  categoryList_api: { url: `${host}/api/selectProductClassList.do`, m: "GET" },//品牌详情
  getTailGoods_api: { url: 'https://www.fastmock.site/mock/115d876b2fe8850e5185ea824064d585/Group/TailGoods', m: "GET"},//尾货扫货
  selectAnimal_api: { url: `${host}/api/selectAnimal.do`, m: "GET" } ,//猫狗主粮，零食玩具
  getOrderDetails_api: {url: `${host}/api/selectOrderDetails.do`,m:'GET'},
  dogAndCartList_api: { url: `${host}/api/selectPetProductList.do`, m: "GET"}, //导航 猫猫/狗狗,
  getNewProduct_api: { url: `${host}/api/selectNewProduct.do`, m: "GET" },//首页底部新品推荐
  myInformation_api: { url: `${host}/api/selectMemberInfo.do`, m: "GET"},//我的  我的信息
  addressList_api: { url: `${host}/api/selectAddressList.do`, m: "GET"},//查询地址
  addAddress_api: { url: `${host}/api/insertAddress.do`, m: "POST"},//添加地址
  deleAddress_api: { url: `${host}/api/deleteAddress.do`, m: "POST" },//删除地址
  conpons_api: { url: `${host}/api/coupon.do`, m: "POST" },//获取个人中心优惠券列表
  order_api: { url: `${host}/api/order.do`, m: "POST" },//获取个人中心订单列表
  cancel_order_api: { url: `${host}/api/cancelOrder.do`, m: "POST" },//取消订单
  confirm_order: { url: `${host}/api/confirmOrder.do`, m: "POST" },//确认订单
  wx_pay_order: { url: `${host}/api/wxPayOrder.do`, m: "POST" },//支付订单
  getGroup_api: { url: `${host}/groupbuy/lsminigroup/page`, m: "GET"},//团购
  getGroupDetail_api: { url: `${host}/groupbuy/lsminigroup/info`, m: "GET"},//团购详情
  getGroupDetailMore_api: { url: `${host}/groupbuy/lsminigroup/grouplist.do`, m: "GET" },//团购详情查看更多
  createOrder_api: { url: `${host}/api/insertOrder.do`, m: "POST"},//生成订单
  getCoupon_api: { url: `${host}/api/insertCouPon.do`, m: "POST" },//领取优惠券 
  getTerminalProductDetails: { url: `${host}/api/selectShopInfo.do`, m: "GET" },//获取终端机商品详情
  buyPlus: { url: `${host}/api/buyPlus.do`, m: "POST" },//购买plus会员
  getTerminalAddress: { url: `${host}/api/getTerminalAddress.do`, m: "POST" },//获取相邻终端机位置
  detailedCost: { url: `${host}/api/detailedCost.do`, m: "POST" },//运费
  enablecoupons: { url: `${host}/api/enablecoupons.do`, m: "POST" },//查询该订单可用优惠券
  insertSkillOrder: {url: `${host}/api/insertSkillOrder.do`, m: "POST" },//秒杀下单
  getSearchListByClass: { url: `${host}/api/selectProductListByClass.do`, m: "GET" },//分类跳转结果
  getPopular: { url: `${host}/api/getPopular.do`, m: "GET" },//热门搜索
  getBrand: { url: `${host}/api/getBrand.do`, m: "GET" },//查找超级品牌日
  insertGroupOrder: { url: `${host}/api/insertGroupOrder.do`, m: "POST" },//查找超级品牌日
  joinGroupOrder: { url: `${host}/api/joinGroupOrder.do`, m: "POST" },//查找超级品牌日
  groupDetails: { url: `${host}/api/groupDetails`, m: "GET" },//查找超级品牌日
  getVeryCheap: { url: `${host}/api/salespage`, m: "GET" },//特惠购
  getVCDetails: { url: `${host}/api/salesinfo`, m: "GET" },//特惠购详情
  getComposeList: { url: `${host}/api/selectComposeList.do`, m: "GET" },//组合商品
  insertRefund: { url: `${host}/api/insertRefund.do`, m: "POST" },//退款
  selectExpress: { url: `${host}/api/selectExpress.do`, m: "POST" },//退款
  evaOrder: { url: `${host}/api/evaOrder.do`, m: "POST" },//退款
  selectRefund: { url: `${host}/api/selectRefund.do`, m: "GET" },//查询售后
  selectPopuProductInfo: { url: `${host}/popu/selectPopuProductInfo.do`, m: "GET" },//查询售后
  getOfflineOrder: { url: `${host}/api/selectOffLineOrderList.do`, m: "GET" },//线下订单
  getExperienceTicket: { url: `${host}/api/couponpage.do`, m: "GET" },//体验券
  couponDelivery: { url: `${host}/api/couponDelivery.do`, m: "GET" },//线下订单
  selectCecommendProduct: { url: `${host}/api/selectCecommendProduct.do`, m: "GET" },//推荐商品
  updateRefund: { url: `${host}/api/updateRefund.do`, m: "POST" },//推荐商品
  servicePage: { url: `${host}/api/selectShopService.do`, m: "GET" },//推荐商品
  buyService: { url: `${host}/api/buyService.do`, m: "POST" },//推荐商品
  selectShopServiceRe: { url: `${host}/api/selectShopServiceRe.do`, m: "GET" },//推荐商品
  refundShopServiceRe: { url: `${host}/api/refundShopServiceRe.do`, m: "GET" },//推荐商品
  serviceInfo: { url: `${host}/api/selectShopServiceInfo.do`, m: "GET" }//推荐商品
}
module.exports={
  page: page,
  imgUrl: "https://petinfo.oss-cn-hangzhou.aliyuncs.com",
  login: `${host}/api/getOpenId.do`,
  uploadUrl: `${host}/oss/selectValue`,
  /**
   * n 接口名
   * d 参数
   * c 回调方法
   */
  request: (n,d,c)=>{
    let app = getApp();
    let o = api[n];
    if (typeof d =="function"){
      c=d;
      d=null;
    }
    if (typeof c =="undefined"){
      c=()=>{
        console.log(n,"方法执行成功")
      }
    }
    if (typeof o == "undefined"){
      console.log(n,"没有这个接口")
      return app.util.showToast(n+",没有这个接口")
    }
    app.util.request(o.url,d,o.m,c)
  }
}