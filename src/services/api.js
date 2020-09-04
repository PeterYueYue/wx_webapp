// const api = "http://47.99.125.133:9090/admin/api"
// const api = "http://192.168.20.161:19999"  //张强
// const api = "http://sgmark.shishangbag.vip"  //张强
// const api = "http://192.168.20.13:19999"   //美霞

const testDomin = "http://cat.shishangbag.vip/"//cat
const formalDomain = "http://cat.shishangbag.vip/"//正式
const env = process.env.NODE_ENV
const api = env === 'development' ? testDomin : formalDomain
export default api;