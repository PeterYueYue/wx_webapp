
import React, { useState, useEffect, useRef } from "react";
import { DownOutlined, PlusOutlined, BlockOutlined } from '@ant-design/icons';
import {Form, Row,Col,Button, Divider, Dropdown, Menu, message, Input, Tabs ,Modal,Popconfirm} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
// import UploadImg from "./../productEdit/components/Upload"
import style from "./index.less"
import { Link, connect } from 'umi';
import { history } from 'umi';
import dataConversion from '@/utils/dataConversion.js'
const { TabPane } = Tabs;



const Product = (props) => {
  const [form] = Form.useForm();
  const [sorter, setSorter] = useState('');
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [support, setSupport] = useState([])
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  const [list, setList] = useState([])
  
  useEffect(() => {
  }, []);
  

  const columns = [
    {
      title: '小区名称',
      dataIndex: 'name',
      rules: [
        {
          required: true,
          message: '请输入',
        },
      ],
    },
    
    {
      title: '省',
      dataIndex: 'province',
      hideInSearch: true,
    },
    {
      title: '市',
      dataIndex: 'city',
      hideInSearch: true,
    },
    {
      title: '区',
      dataIndex: 'zone',
      hideInSearch: true,
    },
    {
      title: '街道',
      dataIndex: 'street',
      hideInSearch: true,
    },
    {
      title: '住户数量',
      dataIndex: 'householdNum',
      hideInSearch: true,
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
              // handleUpdateModalVisible(true);
              setStepFormValues(record);
              handleModalVisible(record);
            }}
          > 
            修改
          </a>
          <Divider type="vertical" />
          <Link to={{pathname:'/area/areaSet', query:{name: record.name}}} > 详情</Link>
          <Divider type="vertical" />
          <Popconfirm title="确定要删除吗？" onConfirm={() => {deleteItem(record.id) } } onCancel={cancel}>
            <a href="#">删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];
  // 列表
  const getProductList = (params) => {
    return props.dispatch({
      type: 'productSort/productList',
      payload: {
        ...dataConversion({
          'method': 'system.community.page',
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
          'method': 'system.community.delete',
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
// 主图数据
const [fileList1,setFileList1] = useState([]);
  return (
    <PageHeaderWrapper>
      <ProTable
        headerTitle="商品分类表格"
        actionRef={actionRef}
        pagination={{ pageSize: 10 }}
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
            已选择{''}
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
