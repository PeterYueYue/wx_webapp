
import React, { useState, useEffect, useRef } from "react";
import { DownOutlined, PlusOutlined, BlockOutlined } from '@ant-design/icons';
import {Form, Row,Col,Button, Divider, Dropdown, Menu, message, Input, Tabs ,Modal,Popconfirm} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import style from "./index.less"
import { connect } from 'umi';
import dataConversion from '@/utils/dataConversion.js'
const Product = (props) => {
  const [form] = Form.useForm();
  const [sorter, setSorter] = useState('');
  const [createModalVisible, handleModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  useEffect(() => {
  }, []);
  const columns = [
    {
      title: '支持名称',
      dataIndex: 'name',
      hideInForm: false,
      valueType: 'text',
    },
    {
      title: '描述',
      dataIndex: 'description',
      hideInForm: false,
      valueType: 'text',
    },
    {
      title: '状态',
      dataIndex: 'state',
      hideInForm: false,
      hideInSearch: true,
      valueEnum: {
        1: {
          text: '下架',
          status: 'Default',
        },
        0: {
          text: '上架',
          status: 'Success',
        },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      sorter: true,
      valueType: 'dateTime',
      hideInSearch: true,
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
      title: '操作',
      dataIndex: 'id',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {  
              setStepFormValues(record);
              handleModalVisible(record);
            }}
          >
            修改
          </a>
          <Divider type="vertical" />
          <Popconfirm title="确定要删除吗？" onConfirm={() => {deleteItem(record.id) } } onCancel={cancel}>
            <a href="#">删除</a>
          </Popconfirm>
          {/* <a  onClick={() => idelete(record)}>删除</a> */}
        </>
      ),
    },
  ];
  // 商品类型列表
  const getProductList = (params) => {
    return props.dispatch({
      type: 'productSort/productList',
      payload: {
        ...dataConversion({
          'method': 'support.page',
          "biz_content": JSON.stringify({
            "pageNumber": params.current,
            "pageSize": params.pageSize,
            "name":params.name,
          })
        })
      }
    })
  }
  //删除
  const idelete = (currentItem) => {
    console.log(currentItem)
    Modal.confirm({
      title: '删除任务',
      content: '确定删除该任务吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => deleteItem(currentItem.id),
    });
  };
  const deleteItem= (id) => {
    return props.dispatch({
      type: 'productSort/productEdit',
      payload: {
        ...dataConversion({
          'method': 'support.delete',
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
  const reload = ()=> {
    actionRef.current.reload();
  }

  return (
    <PageHeaderWrapper>
      <ProTable
        headerTitle="商品支持列表"
        actionRef={actionRef}
        rowKey="key"
        pagination={{ pageSize: 10 }}
        onChange={(_, _filter, _sorter) => {
          const sorterResult = _sorter;
          if (sorterResult.field) {
            setSorter(`${sorterResult.field}_${sorterResult.order}`);
          }
        }}
        params={{
          sorter,
        }}
        toolBarRender={(action, { selectedRows }) => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
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
                  <Menu.Item key="remove">批量删除</Menu.Item>
                  <Menu.Item key="approval">批量审批</Menu.Item>
                </Menu>
              }
            >
              <Button>
                批量操作 <DownOutlined />
              </Button>
            </Dropdown>
          ),
        ]}
        tableAlertRender={({ selectedRowKeys, selectedRows }) => (
          <div>
            已选择{' '}
            <a
              style={{
                fontWeight: 600,
              }}
            >
              {selectedRowKeys.length}
            </a>{' '}
            个商品&nbsp;&nbsp;
          </div>
        )}
        request={params => getProductList(params)}
        columns={columns}
        rowSelection={{}}
      />
      <CreateForm 
        onCancel={() =>{handleModalVisible(false)}} modalVisible={createModalVisible}
        reload={() =>{reload()}}
      >
      </CreateForm>
    </PageHeaderWrapper>
  );
};
export default connect(({ shop, loading }) => ({
  shop: shop,
  submitting: loading.effects['shop/Product'],
}))(Product);
