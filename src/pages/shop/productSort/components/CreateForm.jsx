
import React, { useState, useEffect, useRef } from "react";
import { Form, Row, Col, Button, Divider, Dropdown, Menu, message, Input, Tabs, Modal, Radio, Alert } from 'antd';
import UploadImg from "./../../productEdit/components/Upload"
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
  const [fileList1, setFileList1] = useState([])
  const [itemId, setItemId] = useState();
  const handleChange1 = (fileList) => {
    setFileList1(fileList)
  };
  const onChange = (() => {
    
  })
  useEffect(() => {
    if (props.modalVisible.id) {//设置编辑
      setItemId(props.modalVisible.id);
      editImg(props.modalVisible);
      form.setFieldsValue(props.modalVisible);
    }else{
      form.resetFields();
      const fileList1 = '';
      setFileList1(fileList1)
    }
  }, [props.modalVisible.id]);

  const editImg = (result) => {
    let fileList1 = [{
      uid: result.id,
      name: "商品类型图",
      status: 'done',
      url: result.longMainPic,
      response:{shortImgUrl:result.mainPic}
    }]
    setFileList1(fileList1)
  }
  const onFinish = values => {
    let mainPic = '';
    if (fileList1.length > 0) {
      mainPic = fileList1[0].response.shortImgUrl;
    } else {
      message.warning('请添加图片');
    }
    props.dispatch({
      type: 'productSort/productEdit',
      payload: {
        ...dataConversion({
          "method": itemId?"productType.update":"productType.save",
          "biz_content": JSON.stringify({
            "id":itemId?itemId:'',
            "name": values.name,
            "mainPic": mainPic,
            "isShow": values.isShow,
          })
        })
      }
    }).then((res) => {
      if (res.code == 10000) {
        mainPic = '';
        message.success('提交成功');
        props.onCancel();
        props.reload();
        form.resetFields()
        const fileList1 = '';
        setFileList1(fileList1)
      } else {
        message.error(res.msg);
      }
    })
  };


  return (
    <Modal
      // destroyOnClose
      getContainer={false}
      title="商品分类"
      visible={modalVisible}
      onOk={() => onFinish()}
      onCancel={() => props.onCancel()}
      reload={() => props.reload()}
      footer={null}
    >
      {/* {props.children} */}
      <Form form={form} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages} labelCol={{ span: 5 }}>
        <Form.Item name={['name']} label="分类名称" rules={[{ required: true }]}  >
          <Input style={{ width: '300px' }} />
        </Form.Item>
        <Form.Item name={['isShow']} label="状态" rules={[{ required: true }]}>
          <Radio.Group onChange={onChange} value={0}>
            <Radio value={1}>显示</Radio>
            <Radio value={0}>隐藏</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item className={style.formItem1} name={['mainPic']} label="分类主图" rules={[{ required: true }]}>
          <Col className={style.uploadBox} span={3}>
            <UploadImg length={1} onChange={handleChange1} fileList={fileList1} />
          </Col>
        </Form.Item>
        <Form.Item className={style.formItem1} wrapperCol={{ offset: 5 }}>
          <Col className={style.uploadBox} span={19}>
            <Alert
              message="建议尺寸: 700*280像素,最多上传1张"
              type="info"
            />
          </Col>
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

// export default CreateForm;
export default connect(({ shop, loading }) => ({
  submitting: loading.effects['shop/ProductSort'],
}))(CreateForm);

