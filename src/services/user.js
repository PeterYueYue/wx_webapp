import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}
export async function queryCurrent() {
  // return request('/api/currentUser');
  let user = localStorage.getItem('user')
  let data = ''
  if(user){
    data = {
      name: '无小锡',
      avatar: 'http://sbag-small.oss-cn-huhehaote.aliyuncs.com/upload/img/web/yy/index/0602.png',
      userid: '00000001',
      email: 'antdesign@alipay.com',
    }
  }
  return data
}
export async function queryNotices() {
  return request('/api/notices');
}
