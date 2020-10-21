import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu, message, Input, Popconfirm, Switch, Ico } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { Link, connect, history } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import dataConversion from '@/utils/dataConversion.js'

import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import styles from './index.less'

import { updateRule, addRule, removeRule } from './service';
import QRCode from 'qrcode.react';
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
const url = 'https://gateway.wuxigf.com?goods=';
const Product = (props) => {
  const [sorter, setSorter] = useState('');
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  const [current, setCurrent] = useState('1')

  useEffect(() => {
    let n = JSON.parse(localStorage.getItem("current"))
    if (n >= 1) {
      setCurrent(n)
    }
  }, [])


  const columns = [
    {
      title: '商品图片',
      dataIndex: 'mainPic',
      valueType: 'textarea',
      hideInSearch: true,
      hideInForm: false,
      render: (item) => {
        return <img alt="img" className={styles.productPic} src={item} />
      }
    },
    {
      title: '二维码下载',
      dataIndex: 'id',
      valueType: 'textarea',
      hideInSearch: true,
      hideInForm: false,
      render: (_, record) => (
        <a onClick={() => { down(record) }}> 
          下载二维码
          <QRCode value={url+record.id} onClick={() => { down(record) }} size={500} id="qrCode" style={{'display': 'none'}} />
        </a>
      )
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      rules: [
        {
          required: true,
          message: '请输入',
        },
      ],
    },
    {
      title: '商品描述',
      dataIndex: 'remark',
      hideInSearch: true,
      valueType: 'textarea',
    },
    {
      title: '商品品牌',
      hideInForm: false,
      hideInSearch: true,
      dataIndex: 'supplierName',
      valueType: 'textarea',
    },
    {
      title: '商品价格',
      dataIndex: 'cashPrice',
      hideInSearch: true,
      sorter: true,
      hideInForm: false,
      renderText: val => `${val}`,
    },
    {
      title: '商品积分',
      dataIndex: 'point',
      hideInSearch: true,
      sorter: true,
      hideInForm: false,
      renderText: val => `${val}`,
    },
    {
      title: '商品库存',
      dataIndex: 'stock',
      hideInSearch: true,
      hideInForm: false,
      valueType: 'textarea',
    },
    {
      title: '商品状态',
      dataIndex: 'state',
      hideInForm: false,
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
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (

        <>
          <Link to={`/shop/productEdit?id=${record.id}`} >  编辑  </Link>

          <Divider type="vertical" />
          <Popconfirm title="确定删除此商品？" onConfirm={() => { confirm(record.id) }} onCancel={cancel}>
            <a href="#">删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];
  const down = (item) => {//下载二维码
    var Qr = document.getElementById('qrCode');
    let image = new Image();
    image.src = Qr.toDataURL("image/png");
    console.log(item);
    download(item.name, image.src)
  }
  function download(name, img) {
    let imgData = img;
    downloadFile(name + '.png', imgData);
  }
  //下载
  function downloadFile(fileName, content) {
    let aLink = document.createElement('a');
    let blob = base64ToBlob(content); //new Blob([content]);
    let evt = document.createEvent("HTMLEvents");
    evt.initEvent("click", true, true);//initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
    aLink.download = fileName;
    aLink.href = URL.createObjectURL(blob);
    aLink.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));//兼容火狐
  }
  //base64转blob
  function base64ToBlob(code) {
    let parts = code.split(';base64,');
    let contentType = parts[0].split(':')[1];
    let raw = window.atob(parts[1]);
    let rawLength = raw.length;

    let uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
  }
  const confirm = async (id) => {
    // message.success('点击了确定');
    await props.dispatch({
      type: 'shop/supportList',
      payload: {
        ...dataConversion({
          'method': 'system.product.delete',
          "biz_content": JSON.stringify({
            "id": id,
          })
        })
      }
    })

    actionRef.current.reload();



  }

  function cancel() {
    message.error('点击了取消');


  }
  function addProduct() {
    history.push("/shop/productEdit")
  }
  // 商品列表
  const getProductList = (params) => {
    let dateTime = ''
    if (params.createDate) {
      dateTime = new Date(params.createDate).valueOf();
    }
    return props.dispatch({
      type: 'shop/productListData',
      payload: {
        ...dataConversion({
          'method': 'system.product.page',
          "biz_content": JSON.stringify({
            "startCreateDate": dateTime,
            "endCreateDate": "",
            "pageNumber": params.current,
            "pageSize": params.pageSize,
            "name": params.name,
            "state": params.state
          })
        })
      }
    })
  }
  return (
    <PageHeaderWrapper>
      <ProTable
        pagination={{ pageSize: 6, current: current }}
        headerTitle="商品表格"
        actionRef={actionRef}
        rowKey="key"
        onChange={(_, _filter, _sorter) => {
          localStorage.setItem("current", _.current)
          const sorterResult = _sorter;
          if (sorterResult.field) {
            setSorter(`${sorterResult.field}_${sorterResult.order}`);
          }
        }}
        params={{
          sorter,
        }}
        toolBarRender={(action, { selectedRows }) => [
          <Button type="primary" onClick={() => { addProduct() }} >
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
        tableAlertRender={({ selectedRowKeys }) => (
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



      <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
        <ProTable
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
        />
      </CreateForm>
      {stepFormValues && Object.keys(stepFormValues).length ? (
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
      ) : null}
    </PageHeaderWrapper>
  );
};
export default connect(({ shop, loading }) => ({
  shop: shop,
  submitting: loading.effects['shop/productEdit'],
}))(Product);
