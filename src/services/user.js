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
      avatar: 'https://gw.alipayobjects.com/zos/antfincdn/PmY%24TNNDBI/logo.svg',
      userid: '00000001',
      email: 'antdesign@alipay.com',
    }
  }
  return data
}
export async function queryNotices() {
  return request('/api/notices');
}
