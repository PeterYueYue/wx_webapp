
import React, { useState, useEffect, useRef } from "react";
import { DownOutlined, PlusOutlined, BlockOutlined } from '@ant-design/icons';
import {Form, Row,Col,Button, Divider, Dropdown, Menu, message, Input, Tabs ,Modal,Popconfirm} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
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
      console.log(fields)
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


const UserList = (props) => {
  const [form] = Form.useForm();
  const [sorter, setSorter] = useState('');
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  const [list, setList] = useState([])
  useEffect(() => {
  }, []);


  const columns = [
    {
      title: '昵称',
      dataIndex: 'nickName',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
    },
    {
      title: '头像',
      dataIndex: 'headPortrait',
      hideInSearch: true,
      hideInForm: false,
      render: text => <img alt="轮播图片" style={{ width: 100, height: 50 }} src={text} />,
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
      title: '小区',
      dataIndex: 'community',
      hideInSearch: true,
    },
    {
      title: '楼号',
      dataIndex: 'build',
      hideInSearch: true,
    },
    {
      title: '室号',
      dataIndex: 'room',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'state',
      hideInForm: true,
      hideInSearch: true,
      valueEnum: {
        1: {
          text: '正常',
        },
        0: {
          text: '冻结',
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
          <Popconfirm title="确定要修改用户吗？" onConfirm={() => {freeze(record.id) } } onCancel={cancel}>
            <a href="#">{record.state==1?'冻结':'解冻'}</a>
          </Popconfirm>
          {/* <Divider type="vertical" />
          <a  onClick={() => idelete(record)}>删除</a> */}
        </>
      ),
    },
  ];
  // 用户列表
  const getProductList = (params) => {
    // return;
    return props.dispatch({
      type: 'productSort/productList',
      payload: {
        ...dataConversion({
          'method': 'system.user.page',
          "biz_content": JSON.stringify({
            "pageNumber": params.current,
            "pageSize": params.pageSize,
            "nickName":params.nickName,
            "userMobile":params.userMobile,
          })
        })
      }
    })
  }
  // 冻结
  const freeze= (id) => {
    return props.dispatch({
      type: 'productSort/productEdit',
      payload: {
        ...dataConversion({
          'method': 'system.user.setState',
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
  //删除
  const idelete = (currentItem) => {
    console.log(currentItem);
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
          'method': 'productType.delete',
          "biz_content": JSON.stringify({
            "id": id,
          })
        })
      }
    }).then((res) => { 
      actionRef.current.reload();
    })
  }
  const reload = ()=> {
    actionRef.current.reload();
  }
// 主图数据
const [fileList1,setFileList1] = useState([]);
  return (
    <PageHeaderWrapper>
      <ProTable
        headerTitle="用户表格"
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
          // <Button type="primary" onClick={() => handleModalVisible(true)}>
          //   <PlusOutlined /> 新建
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
        {/* <ProTable
          onSubmit={async value => {
            const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="key"
          type="form"
        columns={columns}
        rowSelection={{}}
        /> */}
      </CreateForm>
      {/* {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async value => {
            const success = await handleUpdate(value);

            if (success) {
              handleUpdateModalVisible(false);
              setStepFormValues({});

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null} */}
    </PageHeaderWrapper>
  );
};
export default connect(({ ListUser, loading }) => ({
  ListUser: ListUser,
  submitting: loading.effects['ListUser/UserList'],
}))(UserList);
