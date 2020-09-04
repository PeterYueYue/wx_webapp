import React, { useState, useEffect, useRef } from "react";
import { Button, Divider, Dropdown, Menu, message, Input,Form,Modal,Popconfirm  } from 'antd';
import { Link, connect,history} from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';

import request from '@/utils/request';
import api from '@/services/api';
import styles from './index.less'
import dataConversion from '@/utils/dataConversion.js'

const ImageReview = (props) => {
    const [sorter, setSorter] = useState('');
    const [previewVisible,setPreviewVisible] = useState(false);
    const [previewImage,setPreviewImage] = useState("");
    const actionRef = useRef();
    const [form] = Form.useForm();
    const [current,setCurrent] = useState('1')
    useEffect(() => {
      
        
    },[])
    const handleCancel = () => setPreviewVisible(false );
    const handlePreview = async item => {
        console.log(item,"itemitemitemitem")
        setPreviewImage(item)
        
        setPreviewVisible(true)
        
    };
    async function getList  (params) {
        let dateTime = ''
        if(params.createDate){
            dateTime =  new Date(params.createDate).valueOf();
        }
        let response =  await  request(api+"apiv2/", {
          method: 'POST',
          data: JSON.stringify(
            dataConversion({
                'method':'photo.page',
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
                })
            )
          
        })

        let data = {
            current:response.result.number,
            data:response.result.content,
            pageSize:response.result.size,
            total:response.result.totalElements,
        }
        data.data.map((item,index) => item.key = index)
        return data;
    }
    async function agree(record,state) {
      console.log(record,"record")
      let response =  await  request(api+"apiv2/", {
        method: 'POST',
        data: JSON.stringify(
          dataConversion({
              'method':'photo.setState',
              "biz_content":JSON.stringify({
                  "id":record.id,
                  "state":state
                  })
              })
          )
      })
      if(response.code == 10000){
        message.success('操作成功');
        actionRef.current.reload();
      }

    }



    const columns = [
        {
            title: '订单编号',
            dataIndex: 'sn',
            hideInTable:true,
            hideInSearch:true,
            valueType: 'textarea',
        },
        {
          title: '商品图片',
          dataIndex: 'pic',
          valueType: 'textarea',
          hideInSearch:true,
          hideInForm: false,
          render:(item) => {
            return <img alt="img" onClick={() => {handlePreview(item)}} className={styles.productPic}    src={item}/>
          }
    
        },
        {
          title: '用户名',
          dataIndex: 'name',
          hideInForm:false,
          valueType: 'textarea',
        },
        {
          title: '审核状态',
          dataIndex: 'state',
          hideInSearch:false,
          hideInForm: false,
          valueEnum: {
            
            0: { text: '待审核', status: 'Default', },
            1: { text: '通过审核', status: 'Success', },
            2: { text: '审核失败', status: 'Warning', },
          },
        },
        
        {
          title: '创建时间',
          dataIndex: 'lastUpdateDate',
          sorter: true,
          hideInSearch:true,
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
          hideInSearch:true,
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
              
              {record.state == 0?(
                <>
                  <span className={styles.option} onClick={() =>{agree(record,1)}} type="primary">确定</span>
                  <Divider type="vertical" />
                  <Popconfirm title="确定驳回吗？" onConfirm={() => {agree(record,2) } } onCancel={null}>
                    <span className={styles.option} type="primary">驳回</span>
                  </Popconfirm>
                </>
               
              ):record.state == 1?(
                <span className={styles.green}   type="primary">审核通过</span>
              ):(
                <span className={styles.red}   type="primary">审核失败</span>
              )}
              
            </>
          ),
        },
      ];



    return(
        <PageHeaderWrapper>
            <ProTable
                pagination={{ pageSize: 10,current:current }}
                headerTitle="图片列表"
                actionRef={actionRef}
                rowKey="key"
                onChange={(_, _filter, _sorter) => {
                const sorterResult = _sorter;
                localStorage.setItem("current",_.current)
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
                    </>
                    );
                },
                }}
               
                tableAlertRender={({ selectedRowKeys }) => (
                <div>
                    已选择{' '}
                    <a style={{ fontWeight: 600,}} >
                    {selectedRowKeys.length}
                    </a>{' '}
                    个商品&nbsp;&nbsp;
                </div>
                )}
                request={params =>  getList(params)}
                columns={columns}
                rowSelection={{}}
            />
            <Modal
            visible={previewVisible}
            title="图片预览"
            footer={null}
            onCancel={handleCancel}
            >
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </PageHeaderWrapper>

    )

}

export default ImageReview;