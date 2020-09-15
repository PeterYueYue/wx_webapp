import { stringify } from 'querystring';
import { history } from 'umi';
import { fakeAccount } from '@/services/productSort';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';

const Model = {
  namespace: 'site',
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
    // 数据列表
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
    },
    *getlist({payload},{call,put}){
        const response = yield call(fakeAccount, payload);
        return response
    }
  },
  reducers: {
    PRODUCT_EDIT(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
export default Model;
