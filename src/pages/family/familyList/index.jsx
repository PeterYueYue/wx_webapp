
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
import dataConversion from '@/utils/dataConversion.js'
const { TabPane } = Tabs;
/**
 * 添加节点
 * @param fields
 */

const handleAdd = async fields => {
  const hide = message.loading('正在添加');
  try {
    await addRule({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};
/**
 * 更新节点
 * @param fields
 */

const handleUpdate = async fields => {
  const hide = message.loading('正在配置');
  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();
    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};
/**
 *  删除节点
 * @param selectedRows
 */
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
      title: '省',
      dataIndex: 'province',
      hideInSearch: true,
      rules: [
        {
          required: true,
          message: '请输入',
        },
      ],
    },
    {
      title: '市',
      dataIndex: 'city',
      hideInSearch: true, 
      rules: [
        {
          required: true,
          message: '请输入',
        },
      ],
    },
    {
      title: '区',
      dataIndex: 'zone',
      hideInSearch: true, 
      rules: [
        {
          required: true,
          message: '请输入',
        },
      ],
    },
    {
      title: '小区',
      dataIndex: 'community',
      rules: [
        {
          required: true,
          message: '请输入',
        },
      ],
    },
    {
      title: '楼号',
      dataIndex: 'build',
      rules: [
        {
          required: true,
          message: '请输入',
        },
      ],
    },
    {
      title: '室号',
      dataIndex: 'room',
      rules: [
        {
          required: true,
          message: '请输入',
        },
      ],
    },
    {
      title: '家庭积分',
      dataIndex: 'point',
      hideInSearch: true, 
      rules: [
        {
          required: true,
          message: '请输入',
        },
      ],
    },
    
    {
      title: '创建时间',
      dataIndex: 'strCreateDate',
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
            详情
          </a>
          <Divider type="vertical" />
            <Popconfirm title="确定要删除吗？" onConfirm={() => {deleteItem(record.id) } } onCancel={cancel}>
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
          'method': 'system.family.page',
          "biz_content": JSON.stringify({
            "pageNumber": params.current,
            "pageSize": params.pageSize,
            "community":params.community,
          })
        })
      }
    })
  }
  //删除
  const deleteItem= (id) => {
    return props.dispatch({
      type: 'productSort/productEdit',
      payload: {
        ...dataConversion({
          'method': 'system.family.delete',
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
        headerTitle="家庭列表"
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
                  {/* <Menu.Item key="remove">批量删除</Menu.Item>
                  <Menu.Item key="approval">批量审批</Menu.Item> */}
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
            条数据
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
