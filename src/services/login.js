import request from '@/utils/request';
import api from '@/services/api';


export async function fakeAccountLogin(params) {

  return request(api+"apiv2/", {
    method: 'POST',
    data: JSON.stringify(params),
  });
}
export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

export async function getCodeKey(data) {
  return request(api+`/sbag-server/back/login?username=${data.username}&password=${data.password}&rmb=${false}&codeKey=${data.codeKey}&vCode=${data.vCode}&date=${data.date}`);
}