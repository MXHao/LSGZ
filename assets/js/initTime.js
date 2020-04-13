export function getCurrentDate() {
  var now = new Date();
  var year = now.getFullYear(); //得到年份
  var month = now.getMonth();//得到月份
  var date = now.getDate();//得到日期
  var day = now.getDay();//得到周几
  var hour = now.getHours();//得到小时
  var minu = now.getMinutes();//得到分钟
  var sec = now.getSeconds();//得到秒
  month = month + 1;
  if (month < 10) month = "0" + month;
  if (date < 10) date = "0" + date;
  if (hour < 10) hour = "0" + hour;
  if (minu < 10) minu = "0" + minu;
  if (sec < 10) sec = "0" + sec;
  var time = "";
  //精确到天
  time = year + "-" + month + "-" + date;
  return time;
}
export function getCurrentDate1() {
  var now = new Date();
  var year = now.getFullYear(); //得到年份
  var month = now.getMonth();//得到月份
  var date = now.getDate();//得到日期
  var day = now.getDay();//得到周几
  var hour = now.getHours();//得到小时
  var minu = now.getMinutes();//得到分钟
  var sec = now.getSeconds();//得到秒
  var milSec = now.getMilliseconds();//得到秒
  month = month + 1;
  if (month < 10) month = "0" + month;
  if (date < 10) date = "0" + date;
  if (hour < 10) hour = "0" + hour;
  if (minu < 10) minu = "0" + minu;
  if (sec < 10) sec = "0" + sec;
  if (milSec < 10) sec = "0" + milSec;
  var time = "";
  //精确到天
  time = year + "-" + month + "-" + date + " " + hour + ":" + minu + ":" + sec + "." + milSec;
  return time;
}
export function  intervalTime(endTime, startTime,call) {
  var that = this
  let index= setInterval(res => {
    var date1 = new Date()
    var date2 = new Date(endTime)
    var date3 = date2.getTime() - date1.getTime()
    var days = Math.floor(date3 / (24 * 3600 * 1000));
    var leave1 = date3 % (24 * 3600 * 1000)
    var hours = Math.floor(leave1 / (3600 * 1000)) == 0 ? '00' : Math.floor(leave1 / (3600 * 1000)) < 10 ? '0' + Math.floor(leave1 / (3600 * 1000)) : Math.floor(leave1 / (3600 * 1000))
    var leave2 = leave1 % (3600 * 1000)
    var minutes = Math.floor(leave2 / (60 * 1000)) == 0 ? '00' : Math.floor(leave2 / (60 * 1000)) < 10 ? '0' + Math.floor(leave2 / (60 * 1000)) : Math.floor(leave2 / (60 * 1000))
    var leave3 = leave2 % (60 * 1000)
    var seconds = Math.round(leave3 / 1000) < 10 ? '0' + Math.round(leave3 / 1000) : Math.round(leave3 / 1000);
    // console.log(hours, minutes,seconds);
    if (hours == '' && minutes == '' && seconds==''){
    console.log(hours, minutes,seconds);
    }
    if (hours == '00' && minutes == '00' && seconds=='00'){
         console.log("时间到了")
      clearInterval(index)
         call();
    }
    that.setData({
      spikeLastTime: hours + ":" + minutes + ":" + seconds
    })
  }, 1200);
  return index;
}
export function restTime(oldTime) {//传入时间数组
  let arr = [];
  for (let i = 0; i < oldTime.length; i++){
    var setTime = new Date(oldTime[i]);
    var nowTime = new Date();
    var restSec = setTime.getTime() - nowTime.getTime();
    
    if (restSec > 0) {
      // var day = parseInt(restSec / (60 * 60 * 24 * 1000));
      var hour = parseInt(restSec / (60 * 60 * 1000)) < 10 ? '0' + parseInt(restSec / (60 * 60 * 1000)) : parseInt(restSec / (60 * 60 * 1000));
      var minu = parseInt(restSec / (60 * 1000) % 60) < 10 ? '0' + parseInt(restSec / (60 * 1000) % 60) : parseInt(restSec / (60 * 1000) % 60);
      var sec = parseInt(restSec / 1000 % 60) < 10 ? '0' + parseInt(restSec / 1000 % 60) : parseInt(restSec / 1000 % 60);
      // console.log(str)
    } else {
      hour = '00',
        minu = '00',
        sec = '00'
    }
    var str = hour + ":" + minu + ":" + sec ;
    arr.push(str)
  }
  return arr;
  // this.setData({ groupRemainTime: oldTime })
  
}
export function restTime2(oldTime) {//传入一个时间
  // debugger
  var setTime = new Date(oldTime);
  var nowTime = new Date;
  var restSec = setTime.getTime() - nowTime.getTime();
  if (restSec > 0) {
    // var day = parseInt(restSec / (60 * 60 * 24 * 1000));
    var hour = parseInt(restSec / (60 * 60 * 1000)) < 10 ? '0' + parseInt(restSec / (60 * 60 * 1000)) : parseInt(restSec / (60 * 60 * 1000));
    var minu = parseInt(restSec / (60 * 1000) % 60) < 10 ? '0' + parseInt(restSec / (60 * 1000) % 60) : parseInt(restSec / (60 * 1000) % 60);
    var sec = parseInt(restSec / 1000 % 60) < 10 ? '0' + parseInt(restSec / 1000 % 60) : parseInt(restSec / 1000 % 60);
    // console.log(str)
  } else {
    hour = '00',
      minu = '00',
      sec = '00'
  }
  var str = hour + "时" + minu + "分" + sec + "秒";
  return {
    str,
    hour,
    minu,
    sec
  }
}