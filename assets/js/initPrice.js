export function initPrice(num,n){//num:传入的值  n:保留几位小数
    var f = parseFloat(num);
    if(isNaN(f)){
        return false;
    }   
    f = Math.round(num*Math.pow(10, n))/Math.pow(10, n); // n 幂
    var s = f.toString();
    var rs = s.indexOf('.');
    //判定如果是整数，增加小数点再补0
    if(rs < 0){
        rs = s.length;
        s += '.'; 
    }
    while(s.length <= rs + n){
        s += '0';
    }
    return s;
}
