
import React, { useState, useEffect, useRef } from "react";
import { Form, Row, Col, Button, Divider, Dropdown, Menu, message, Input, Tabs, Modal, Radio, Alert } from 'antd';
import UploadImg from "./../../../shop/ProductEdit/components/Upload"
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
      setItemId('');
      const fileList1 = '';
      setFileList1(fileList1)
    }
  }, [props.modalVisible.id]);

  const editImg = (result) => {
    let fileList1 = [{
      uid: result.id,
      name: "轮播图",
      status: 'done',
      url: result.picUrl,
      response:{imgUrl:result.picUrl}
    }]
    setFileList1(fileList1)
  }
  const onFinish = values => {
    let mainPic = '';
    if (fileList1.length > 0) {
      mainPic = fileList1[0].response.result?fileList1[0].response.result.imgUrl:fileList1[0].response.imgUrl;
    } else {
      message.warning('请添加图片');
    }
    props.dispatch({
      type: 'productSort/productEdit',
      payload: {
        ...dataConversion({
          "method": itemId?"system.banner.update":"system.banner.save",
          "biz_content": JSON.stringify({
            "id":itemId?itemId:'',
            "name": values.name,
            "picUrl": mainPic,
            "bannerFlag": values.bannerFlag,
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
      title="新建"
      visible={modalVisible}
      onOk={() => onFinish()}
      onCancel={() => props.onCancel()}
      reload={() => props.reload()}
      footer={null}
    >
      {/* {props.children} */}
      <Form form={form} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages} labelCol={{ span: 5 }}>
        <Form.Item name={['bannerFlag']} label="状态" rules={[{ required: true }]}>
          <Radio.Group onChange={onChange} value={0}>
            <Radio value={1}>显示</Radio>
            <Radio value={0}>隐藏</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item className={style.formItem1} name={['picUrl']} label="轮播图" rules={[{ required: true }]}>
          <Col className={style.uploadBox} span={3}>
            <UploadImg length={1} onChange={handleChange1} fileList={fileList1} />
          </Col>
        </Form.Item>
        <Form.Item className={style.formItem1} wrapperCol={{ offset: 5 }}>
          <Col className={style.uploadBox} span={19}>
            <Alert
              message="建议尺寸: 500*700像素,最多上传1张"
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

