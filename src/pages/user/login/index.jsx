import { AlipayCircleOutlined, TaobaoCircleOutlined, WeiboCircleOutlined } from '@ant-design/icons';
import { Alert, Checkbox } from 'antd';
import React, { useState } from 'react';
import { Link, connect } from 'umi';
import LoginForm from './components/Login';
import styles from './style.less';
import { getPageQuery } from '@/utils/utils';
import { history } from 'umi';


import dataConversion from '@/utils/dataConversion.js'

const { Tab, UserName, Password, Mobile, Captcha, Submit } = LoginForm;

const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login = props => {
  const { userLogin = {}, submitting } = props;
  const { status, type: loginType } = userLogin;
  const [autoLogin, setAutoLogin] = useState(true);
  const [type, setType] = useState('account');
  const [codeKey, setCodeKey] = useState(new Date().getTime().toString() + Math.floor(Math.random() * 100000));

  // 登录
  const handleSubmit = values => {
    if (!values) {
      return
    }

    props.dispatch({
      type: 'login/login',
      payload: {
        ...dataConversion({
          'method': 'system.admin.login',
          "biz_content": JSON.stringify({
              "username": values.userName,
              "password": values.password,
          })
        })
      }
      // payload: {
      //   ...dataConversion({
      //     'method': 'system.admin.login',
      //     'biz_content': JSON.stringify({
      //       // "codeKey" :  codeKey,
      //       // "vCode"   :  values.vCode,
      //       "username": values.userName,
      //       "password": values.password,
      //     })
      //   })
      // },
    });
  };

  // 更新验证码
  const getCodeKey = () => {
    setCodeKey(new Date().getTime().toString() + Math.floor(Math.random() * 100000))
  }

  return (
    <div className={styles.main}>
      <LoginForm activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
        <Tab key="account" tab="账户密码登录">
          {status === 'error' && loginType === 'account' && !submitting && (
            <LoginMessage content="账户或密码错误（admin/ant.design）" />
          )}

          <UserName
            name="userName"
            placeholder="用户名: admin or user"
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
            ]}
          />
          <Password
            name="password"
            placeholder="密码: ant.design"
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />
          {/* <Captcha
            name="vCode"
            placeholder="验证码"
            countDown={120}
            getCaptchaButtonText=""
            getCaptchaSecondText="秒"
            onUpdateCode={() => {getCodeKey()}}
            codeKey={codeKey}
            rules={[
              {
                required: true,
                message: '请输入验证码！',
              },
            ]}
          /> */}
        </Tab>
        <div>
          <Checkbox checked={autoLogin} onChange={e => setAutoLogin(e.target.checked)}>
            自动登录
          </Checkbox>
        </div>
        <Submit loading={submitting}>登录</Submit>
      </LoginForm>
    </div>
  );
};

export default connect(({ login, loading }) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
