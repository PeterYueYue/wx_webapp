
import React, { useState, useEffect, useRef } from "react";
import { Form, Row, Col, Button, Divider, Dropdown, Menu, message, Input, Tabs, Modal, Radio, Alert, DatePicker, Select } from 'antd';
import moment from 'moment';
import UploadImg from "./../../../shop/ProductEdit/components/Upload"
import dataConversion from '@/utils/dataConversion.js'
import { connect } from 'umi';
import style from "./../index.less"
const { RangePicker } = DatePicker;
const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 6 },
};
const dateFormat = 'YYYY/MM/DD HH:mm:ss';
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
  const [goodType, setGoodType] = useState([])
  const [dateValue, setDateValue] = useState([])
  const [itemId, setItemId] = useState();
  const handleChange1 = (fileList) => {
    setFileList1(fileList)
  };
  const onChange = (() => {

  })
  useEffect(() => {
    if (props.modalVisible.id) {//设置编辑
      console.log(props.modalVisible);
      setItemId(props.modalVisible.id);
      editImg(props.modalVisible);
      setGoodType(props.modalVisible.type)
      const startDate = props.modalVisible.startDate
      const endDate = props.modalVisible.endDate
      
      setDateValue([moment(startDate), moment(endDate)])
      
      form.setFieldsValue(props.modalVisible);
      form.setFieldsValue({
        goodType: props.modalVisible.type,
        date: [moment(startDate), moment(endDate)],
      });
    } else {
      form.resetFields();
      const fileList1 = '';
      setFileList1(fileList1)
    }
  }, [props.modalVisible.id]);

  const editImg = (result) => {
    let fileList1 = [{
      uid: result.id,
      name: "图片",
      status: 'done',
      url: result.pic,
      response: { imgUrl: result.pic }
    }]
    setFileList1(fileList1)
  }
  const onFinish = values => {
    let mainPic = '';
    if (fileList1.length > 0) {
      mainPic = fileList1[0].response.imgUrl;
    } else if (goodType == 1) {
      message.warning('请添加图片');
      return;
    }
    props.dispatch({
      type: 'productSort/productEdit',
      payload: {
        ...dataConversion({
          "method": itemId ? "system.notice.update" : "system.notice.save",
          "biz_content": JSON.stringify({
            "id": itemId ? itemId : '',
            "content": values.content,
            "pic": mainPic,
            "startDate": values.date[0]._d.getTime(),
            "endDate": values.date[1]._d.getTime(),
            "state": values.state,
            "remark": values.remark,
            "type": JSON.stringify(goodType),
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

  const goods = [
    {
      id: 0,
      name: "文字公告"
    },
    {
      id: 1,
      name: "图片公告"
    },
  ]
  const changeGood = value => {
    setGoodType(value)
  }
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
        {/* <Form.Item name="goodType" label="公告类型" rules={[{ required: true }]} >
          <Select
            placeholder="请选择公告类型"
            allowClear
            style={{ width: '300px' }}
            onChange={changeGood}
          >
            {goods.map((item) => {
              return <Option key={item.id} value={item.id}>{item.name}</Option>
            })}
          </Select>
        </Form.Item> */}
        {
          goodType == 0 ?
            <Form.Item name={['content']} label="公告内容" rules={[{ required: false }]}  >
              <Input style={{ width: '300px' }} />
            </Form.Item>
            :
            <Form.Item className={style.formItem1} name={['pic']} label="图片" rules={[{ required: false }]}>
              <Col className={style.uploadBox} span={3}>
                <UploadImg length={1} onChange={handleChange1} fileList={fileList1} />
              </Col>
              <Col className={style.uploadBox} span={19}>
                <Alert
                  message="建议尺寸: 400*600像素,最多上传1张"
                  type="info"
                />
              </Col>
            </Form.Item>
        }

        <Form.Item name={['date']} label="起止日期" rules={[{ required: false }]}  >
          <RangePicker
           value={['dateValue']}
           showTime
           format={'YYYY/MM/DD'}
          />
        </Form.Item>
        <Form.Item name={['state']} label="状态" rules={[{ required: true }]}>
          <Radio.Group onChange={onChange} value={0}>
            <Radio value={1}>显示</Radio>
            <Radio value={0}>隐藏</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name={['remark']} label="备注" rules={[{ required: false }]}  >
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

// export default CreateForm;
export default connect(({ shop, loading }) => ({
  submitting: loading.effects['shop/ProductSort'],
}))(CreateForm);

