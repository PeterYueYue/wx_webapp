import { stringify } from 'querystring';
import { history } from 'umi';
import { fakeAccountLogin,getCodeKey } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
    logIn:[]
  },
  effects: {
    *login({ payload }, { call, put }) {

      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      }); // Login successfully

      if (response.code == "10000") {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;

        if (redirect) {

          localStorage.setItem("user", JSON.stringify(response))

          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }

        history.replace(redirect || '/');
      }
    },
    *getCodeKey({ payload }, { call, put }) {

      console.log(payload,"payload")
      const response = yield call(getCodeKey, payload);
      yield put({
        type: 'changeCodeKey',
        payload: response,
      }); 

      return response
     
    },
    logout() {
      const { redirect } = getPageQuery(); // Note: There may be security issues, please note
      if (window.location.pathname !== '/user/login' && !redirect) {
        localStorage.setItem("user", "")
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return { ...state, status: payload.status, type: payload.type };
    },
    changeCodeKey(state,{ payload }){
      return { ...state, logIn:payload };
    },
  },
};
export default Model;
