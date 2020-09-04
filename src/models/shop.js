import { stringify } from 'querystring';
import { history } from 'umi';
import { fakeAccount } from '@/services/shop';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';

const Model = {
  namespace: 'shop',
  state: {
    
  },
  effects: {

    *orderDetails({ payload }, { call, put }){
      const response = yield call(fakeAccount, payload);
      return response
    },
    *productEdit({ payload }, { call, put }) {
      const response = yield call(fakeAccount, payload);
      yield put({
        type: 'PRODUCT_EDIT',
        payload: response,
      }); 
    },
    *supportList({ payload }, { call, put }) {
        const response = yield call(fakeAccount, payload);
        return response
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
    },
    // 商品列表
    *productListData({payload},{call,put}){

      const response = yield call(fakeAccount, payload);
      let data = {
        current:response.result.number,
        data:response.result.content,
        pageSize:response.result.size,
        total:response.result.totalElements,
      }
      data.data.map((item,index) => item.key = index)
      yield put({
        type:'CHANGE_PRODUCT_PAGE',
        payload: data,
      })

      console.log(history,"his")
      return data
    },
    *creatProOrder({ payload }, { call, put }) {
      const response = yield call(fakeAccount, payload);
      return response
  },
  },
  reducers: {
    PRODUCT_EDIT(state, { payload }) {
      
      return { ...state,...payload};
    },
    // 商品列表数据
    CHANGE_PRODUCT_PAGE(state,{payload}){
      return { 
        ...state,
        productPage:payload
      };

    }
    
   
  },
};
export default Model;
