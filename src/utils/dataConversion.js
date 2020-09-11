  
import md5 from 'md5'  
// 签名MD5加密
const  dataConversion = (payload) =>  {

let user = localStorage.getItem('user')
let token = ""
if(user){
     user = JSON.parse(localStorage.getItem('user'));
     token = user.result.token
}
function formatDate() {
    var date = new Date();
    var YY = date.getFullYear() + '-';
    var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
    var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return YY + MM + DD +" "+hh + mm + ss;
}
let timestamp = formatDate();
let random = Math.ceil(Math.random() * 100000); 
let nonce = `e16a94bf-3b29-49f6-8bc0-fe9706f8c302${new Date().getTime()}${random}`;
let app_id = "20200608719606620987850752";
let releaseVersion= "v20200530"
let sign = ""
if(token){
    if(payload.biz_content){
        sign = md5(`app_id=${app_id}&biz_content=${payload.biz_content}&format=json&method=${payload.method}&nonce=${nonce}&releaseVersion=${releaseVersion}&timestamp=${timestamp}&token=${token}&version=1.00878b0d87e84486dad0a9856593fb7ac`)
    }else{
        sign = md5(`app_id=${app_id}&format=json&method=${payload.method}&nonce=${nonce}&releaseVersion=${releaseVersion}&timestamp=${timestamp}&token=${token}&version=1.00878b0d87e84486dad0a9856593fb7ac`)
    }
}else{
    if(payload.biz_content){
        console.log(payload.biz_content)
        sign = md5(`app_id=${app_id}&biz_content=${payload.biz_content}&format=json&method=${payload.method}&nonce=${nonce}&releaseVersion=${releaseVersion}&timestamp=${timestamp}&version=1.00878b0d87e84486dad0a9856593fb7ac`)
    }else{
        sign = md5(`app_id=${app_id}&format=json&method=${payload.method}&nonce=${nonce}&releaseVersion=${releaseVersion}&timestamp=${timestamp}&token=${token}&version=1.00878b0d87e84486dad0a9856593fb7ac`)
    }
}
let obj = {
    app_id:app_id,
    biz_content:payload.biz_content?payload.biz_content:'',
    format:"json",
    method:payload.method,
    nonce:nonce,
    releaseVersion:releaseVersion,
    timestamp:timestamp,
    token:token?token:'',
    // microServiceIp:"10.9.0.4",
    version:"1.0",
    sign:sign
}
let pam = {}
for(let i in obj){
  if(obj[i]){
    pam[i] = obj[i]
  }
}
return pam
}

export default dataConversion;