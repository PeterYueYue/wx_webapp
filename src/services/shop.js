import request from '@/utils/request';
import api from '@/services/api';


export async function fakeAccount(params) {
  return request(api+"apiv2/", {
    method: 'POST',
    data: JSON.stringify(params),
  });
}
export async function postRequest(params) {
  return request(api+"apiv2/",{
    method:'POST',
    data:JSON.stringify(params),
  })
}