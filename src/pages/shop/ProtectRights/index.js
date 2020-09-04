import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu, message, Input,Form,Modal,Popconfirm  } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { Link, connect,history} from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import dataConversion from '@/utils/dataConversion.js'
import styles from './index.less'
import api from '@/services/api';

import {  updateRule, addRule, removeRule } from './service';
const FormItem = Form.Item;
const formLayout = {labelCol: {span: 7 }, wrapperCol: { span: 13},};


const handleRemove = async selectedRows => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;

  try {
    await removeRule({
      key: selectedRows.map(row => row.key),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const ProtectRights = (props) => {
  const [sorter, setSorter] = useState('');
  const [previewVisible,setPreviewVisible] = useState(false);
  const [protectRightsItem,setProtectRightsItem] = useState('')
  const actionRef = useRef();
  const [form] = Form.useForm();

  useEffect(() => {

  },[])

  const handleCancel = () => setPreviewVisible(false );
  const protectRights = (item) => {
    setPreviewVisible(true);
    setProtectRightsItem(item);
    form.setFieldsValue({"name":""})
  }
  const columns = [
    {
        title: '订单编号',
        dataIndex: 'sn',
        hideInTable:true,
        valueType: 'textarea',
    },
    {
      title: '商品图片',
      dataIndex: 'pic',
      valueType: 'textarea',
      hideInSearch:true,
      hideInForm: false,
      render:(item) => {
        return <img alt="img" className={styles.productPic}    src={item}/>
      }

    },
    {
      title: '商品基本信息',
      hideInSearch:true,
      dataIndex: '',
      render:(item) => {
        return (
            <div>
                <div>商品名称：{item.productName}</div>
                <div>订单编号：{item.sn}</div>
                <div>创建时间：{item.createDate}</div>
            </div>
        )
      }
    },
    {
      title: '单价(ssb)',
      dataIndex: 'unitPrice',
      hideInSearch:true,
      valueType: 'textarea',
    },
    {
      title: '抵扣(ssb)',
      hideInForm:false,
      hideInSearch:true,
      dataIndex: 'sbagAmount',
      valueType: 'textarea',
    },
    { 
      title: '实付(rmb)',
      dataIndex: 'cashAmount',
      hideInSearch:true,
      sorter: true,
      hideInForm: false,
      renderText: val => `${val} `,
    },
    {
      title: '客户手机号',
      dataIndex: 'mobile',
      hideInSearch:false,
      hideInForm:false,
      valueType: 'textarea',
    },
    {
      title: '商品状态',
      dataIndex: 'state',
      hideInSearch:false,
      hideInForm: false,
      valueEnum: {
        
        0: { text: '维权中', status: 'Error', },
        1: { text: '已完成', status: 'Success', },
        
      },
    },
    {
        title: '品牌',
        dataIndex: 'supplierName',
        hideInSearch:true,
        hideInForm:false,
        valueType: 'textarea',
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      sorter: true,
      hideInTable:true,
      valueType: 'date',
      hideInForm: false,
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status');

        if (`${status}` === '0') {
          return false;
        }

        if (`${status}` === '3') {
          return <Input {...rest} placeholder="请输入异常原因！" />;
        }

        return defaultRender(item);
      },
    },
    {
      title: '结束时间',
      dataIndex: 'endCreateDate',
      sorter: true,
      hideInTable:true,
      valueType: 'date',
      hideInForm: false,
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status');

        if (`${status}` === '0') {
          return false;
        }

        if (`${status}` === '3') {
          return <Input {...rest} placeholder="请输入异常原因！" />;
        }

        return defaultRender(item);
      },
    },
    {
        title: '付款方式',
        dataIndex: 'sold',
        hideInSearch:true,
        hideInForm:false,
        valueType: 'textarea',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        

        <>
          <Link to={`/shop/protectRightsDetails?id=${record.id}`} >  详情  </Link>
          <Divider type="vertical" />
          {record.state == 0?(
            <Popconfirm title="确定处理吗？" onConfirm={() => {editSure(record.id) } } onCancel={cancel}>
              <a href="#">处理</a>
            </Popconfirm>
            // <span className={styles.option}  onClick={() => {  protectRights(record) }} href="#">处理</span>
          ):null}
          
        </>
      ),
    },
  ];
  const editSure= (id) => {//处理
    return props.dispatch({
      type: 'productSort/productEdit',
      payload: {
        ...dataConversion({
          'method': 'rightsOfOrder.finish',
          "biz_content": JSON.stringify({
            "id": id,
          })
        })
      }
    }).then((res) => { 
      actionRef.current.reload();
    })
  }
  function cancel() {
    message.error('点击了取消');
  }
  // 导出报表
  function outExcel(params){
    window.open(api+'sbag-server/back/rest/rightsOfOrder/export?'+convertObj(params));
    
  }
  // Object转Query
  function convertObj(data) {
    var _result = [];
    for (var key in data) {
      var value = data[key];
      if (value.constructor == Array) {
        value.forEach(function(_value) {
          _result.push(key + "=" + _value);
        });
      } else {
        _result.push(key + '=' + value);
      }
    }
    return _result.join('&');
  }
  function creatPro(value){
    props.dispatch({
      type:'shop/creatProOrder',
      payload:{...dataConversion({
        'method':'rightsOfOrder.saveOrUpdate',
        "biz_content":JSON.stringify({
          "orderId":protectRightsItem.orderId,
          "reason":value.name,
          })
        })
      }
    }).then((res) => {
      message.success(res.result.message)
      handleCancel()
    })

  }
  // 订单列表
  const getProductList = (params) => {
    let dateTime = ''
    if(params.createDate){
        dateTime =  new Date(params.createDate).valueOf();
    }
    return props.dispatch({
        type: 'shop/productList',
        payload: { ...dataConversion({
          'method':'rightsOfOrder.page',
          "biz_content":JSON.stringify({
            "startCreateDate":dateTime,
            "endCreateDate":"",
            "pageNumber":params.current,
            "pageSize":params.pageSize,
            "name":params.name,
            "state":params.state,
            "sn":params.sn?params.sn:'',
            "mobile":params.mobile?params.mobile:'',
          })
        }) }
    })
  }
 
  return (
    <PageHeaderWrapper>
      <ProTable
        pagination={{ pageSize: 10 }}
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="key"
        onChange={(_, _filter, _sorter) => {
          const sorterResult = _sorter;
          if (sorterResult.field) {
            setSorter(`${sorterResult.field}_${sorterResult.order}`);
          }
        }}
        params={{
          sorter,
        }}
        search={{
          collapsed: false,
          optionRender: ( { searchText, resetText },{ form }) => {
            return (
              <>
                <Button type="primary" onClick={() => {form.submit()}} >
                  查询
                </Button>
                <Button type="default" style={{marginLeft:20}} onClick={() => {form.resetFields()}} >
                  重置
                </Button>
                <Button type="primary" style={{marginLeft:20}} onClick={() => {outExcel(form.getFieldValue())}} >
                  导出
                </Button>
              </>
            );
          },
        }}
        toolBarRender={(action, { selectedRows }) => [
          // <Button type="primary" >
          //    新建
          // </Button>,
          selectedRows && selectedRows.length > 0 && (
            <Dropdown
              overlay={
                <Menu
                  onClick={async e => {
                    if (e.key === 'remove') {
                      await handleRemove(selectedRows);
                      action.reload();
                    }
                  }}
                  selectedKeys={[]}
                >
                  {/* <Menu.Item key="remove">批量删除</Menu.Item> */}
                  <Menu.Item key="approval">批量发货</Menu.Item>
                </Menu>
              }
            >
              <Button>
                批量操作 <DownOutlined />
              </Button>
            </Dropdown>
          ),
        ]}
        tableAlertRender={({ selectedRowKeys }) => (
          <div>
            已选择{' '}
            <a style={{ fontWeight: 600,}} >
              {selectedRowKeys.length}
            </a>{' '}
            个商品&nbsp;&nbsp;
          </div>
        )}
        request={params => getProductList(params)}
        columns={columns}
        rowSelection={{}}
      />
      <Modal
          visible={previewVisible}
          title={"维权处理"}
          footer={null}
          onCancel={handleCancel}
          >
          <Form {...formLayout}  form={form}  style={{textAlign:'center'}} >
            <FormItem name="name" label="维权处理"
            rules={[ {required: true, message: '请处理', } ]}
            >
            <Input maxLength="40" placeholder="请输入" />
            </FormItem>
            <Button 
                type="primary" 
                style={{marginTop:30}}  
                onClick={async() => creatPro( await form.validateFields())}>
                确定
            </Button>
        </Form>

      </Modal>
    </PageHeaderWrapper>
  );
};
export default connect(({ shop, loading }) => ({
  shop: shop,
  submitting: loading.effects['shop/productEdit'],
}))(ProtectRights);
