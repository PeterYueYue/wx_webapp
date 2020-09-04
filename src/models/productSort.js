import { stringify } from 'querystring';
import { history } from 'umi';
import { fakeAccount } from '@/services/productSort';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';

const Model = {
  namespace: 'productSort',
  state: {
  },
  effects: {
    *productEdit({ payload }, { call, put }) {
      const response = yield call(fakeAccount, payload);
      yield put({
        type: 'PRODUCT_EDIT',
        payload: response,
      });
      return response;
    },
    *productList({payload},{call,put}){
      const response = yield call(fakeAccount, payload);
      let data = {
        current:response.result.number,
        data:response.result.content,
        pageSize:response.result.size,
        total:response.result.totalElements,
      }
      data.data.map((item,index) => item.key = index)
      return data
    }
  },
  reducers: {
    PRODUCT_EDIT(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
export default Model;
