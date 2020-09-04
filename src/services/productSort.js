import request from '@/utils/request';
import api from '@/services/api';

//获取分类列表
export async function productSortList(params) {
  return request(api+"/rest/product/productPageByType", {
    method: 'POST',
    data: JSON.stringify(params),
  });
}

export async function fakeAccount(params) {
  return request(api+"apiv2/", {
    method: 'POST',
    data: JSON.stringify(params),
  });
}