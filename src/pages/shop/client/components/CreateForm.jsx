
import React, { useState, useEffect, useRef } from "react";
import { Form, Row, Col, Button, Divider, Dropdown, Menu, message, Input, Tabs, Modal, Radio, Alert } from 'antd';
import dataConversion from '@/utils/dataConversion.js'
import { connect } from 'umi';
import style from "./../index.less"
const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 6 },
};
const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not validate email!',
    number: '${label} is not a validate number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};
const CreateForm = (props) => {
  const { modalVisible, onCancel } = props;
  const [form] = Form.useForm();
  const [itemId, setItemId] = useState();
  const onChange = (() => {
    
  })
  useEffect(() => {
    if (props.modalVisible.id) {//设置编辑
      setItemId(props.modalVisible.id);
      form.setFieldsValue(props.modalVisible);
    }else{
      form.resetFields();
    }
  }, [props.modalVisible.id]);

  
  const onFinish = values => {
    props.dispatch({
      type: 'productSort/productEdit',
      payload: {
        ...dataConversion({
          "method": itemId?"system.supplier.update":"system.supplier.save",
          "biz_content": JSON.stringify({
            "id":itemId?itemId:'',
            "name": values.name,
            "linkman": values.linkman,
            "telephone": values.telephone,
            "address": values.address,
          })
        })
      }
    }).then((res) => {
      if (res.code == 10000) {
        message.success('提交成功');
        props.onCancel();
        props.reload();
        form.resetFields();
      } else {
        message.error(res.msg);
      }
    })

  };


  return (
    <Modal
      // destroyOnClose
      getContainer={false}
      title="品牌客户"
      visible={modalVisible}
      onOk ={() => onFinish()}
      onCancel={() => props.onCancel()}
      reload={() => props.reload()}
      footer={null}
    >
      <Form form={form} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages} labelCol={{ span: 5 }}>
        <Form.Item name={['name']} label="品牌名称" rules={[{ required: true }]}  >
          <Input style={{ width: '300px' }} />
        </Form.Item>
        <Form.Item name={['linkman']} label="联系人" rules={[{ required: true }]}  >
          <Input style={{ width: '300px' }} />
        </Form.Item>
        <Form.Item name={['telephone']} label="联系电话" rules={[{ required: true }]}  >
          <Input style={{ width: '300px' }} />
        </Form.Item>
        <Form.Item name={['address']} label="联系地址" rules={[{ required: true }]}  >
          <Input style={{ width: '300px' }} />
        </Form.Item>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type="primary" htmlType="submit">
            确定
            </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default connect(({ customer, loading }) => ({
  submitting: loading.effects['customer/ProductSort'],
}))(CreateForm);

