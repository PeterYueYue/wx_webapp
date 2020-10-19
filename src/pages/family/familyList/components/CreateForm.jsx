
import React, { useState, useEffect, useRef } from "react";
import { Form, Row, Col, Button, Card, Divider, Table , message, Input, Tabs, Modal, Radio, Alert } from 'antd';
import dataConversion from '@/utils/dataConversion.js'
import { connect } from 'umi';
import style from "./../index.less"
const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 6 },
};
const CreateForm = (props) => {
  const { modalVisible, onCancel } = props;
  const [form] = Form.useForm();
  const [itemId, setItemId] = useState();
  const [dataSource, setDataSource] = useState();
  const [list, setList] = useState();
  useEffect(() => {
    if (props.modalVisible.id) {
      setItemId(props.modalVisible.id);
      getList(props.modalVisible.id)
      getProductList(props.modalVisible.id);
    } else {
      setList([]);
      setDataSource([]);
    }
  }, [props.modalVisible.id]);

  // 家庭成员列表
  const getList = (itemId) => {
    return props.dispatch({
      type: 'shop/orderDetails',
      payload: {
        ...dataConversion({
          'method': 'system.family.userList',
          "biz_content": JSON.stringify({
            "id": itemId,
          })
        })
      }
    }).then((res) => {
      console.log(res.result);
      setList(res.result);
    })
  }
  const change = (e) => {//解绑
    console.log(e);
    return props.dispatch({
      type: 'shop/orderDetails',
      payload: {
        ...dataConversion({
          'method': 'system.pointList.page',
          "biz_content": JSON.stringify({
            "id": e,
          })
        })
      }
    }).then(res=>{
      
    })
  }
  // 积分列表
  const getProductList = (id) => {
    return props.dispatch({
      type: 'productSort/productList',
      payload: {
        ...dataConversion({
          'method': 'system.pointList.page',
          "biz_content": JSON.stringify({
            "id": id,
            // "pageNumber": params.current,
            // "pageSize": params.pageSize,
          })
        })
      }
    }).then(res=>{
      console.log(res.data);
      setDataSource(res.data);
    })
  }
  const columns = [
    {
      title: '创建时间',
      dataIndex: 'createDate',
      key: 'name',
    },
    {
      title: '原有积分',
      dataIndex: 'beforePoint',
      key: 'age',
    },
    {
      title: '此次积分',
      dataIndex: 'point',
      key: 'age',
    },
    {
      title: '总积分',
      dataIndex: 'afterPoint',
      key: 'age',
    },
  ];
  const style = { 'padding': '22px 0',  };
  return (
    <Modal
      getContainer={false}
      title="家庭详情"
      visible={modalVisible}
      onOk={() => onFinish()}
      onCancel={() => props.onCancel()}
      reload={() => props.reload()}
      footer={null}
      width="1000px"
    >

      <Card title="成员列表" bordered="true" style={{ height: "100%" }}>
        <Row>
          <Col span={6}>家庭成员</Col> <Divider type="vertical" />
          <Col span={6}>手机号</Col> <Divider type="vertical" />
          <Col span={6}>操作</Col>
        </Row>
        {
          list ? list.map(e => {
            return (
              <Row key={e.id} style={style}>
                <Col span={6}>{e.nickName}</Col> <Divider type="vertical" />
                <Col span={6}>{e.mobile}</Col> <Divider type="vertical" />
                <Button type="primary" onClick={() => { change(e.id) }}>解绑</Button>
              </Row>
            )
          }) : null
        }
      </Card>
      <Card title="积分明细" bordered="true" style={{ marginTop: 20, maxHeight: "600px" }}>
        <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 50 }} scroll={{ y: 240 }} />;
      </Card>
    </Modal>
  );
};

// export default CreateForm;
export default connect(({ shop, loading }) => ({
  submitting: loading.effects['shop/ProductSort'],
}))(CreateForm);

