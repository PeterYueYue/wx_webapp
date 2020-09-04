
import React, { useState, useRef, useEffect } from 'react';
import {Steps,Card,Row,Col,Divider,Descriptions ,Result, Button,Modal,Popconfirm,message  } from 'antd';
import { SmileOutlined,CarTwoTone,DollarTwoTone } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Link, connect,history} from 'umi';
import dataConversion from '@/utils/dataConversion.js'
import style from "./index.less"
const { Step } = Steps;



const ProtectRightsDetails = (props) => {
    const [previewVisible,setPreviewVisible] = useState(false);
    const [current,setCurrent] = useState(0)
    const [itemId] = useState(history.location.query.id?history.location.query.id:"")
    const [detail,setDetail] = useState({})
    const [order,setOrder] = useState({})
    const [rightsOfOrder,setRightsOfOrder] = useState({})
    useEffect(() => {
        if(itemId){
            getDetail(itemId)
        }
    },[])
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
            getDetail(itemId)
        })
      }
    function cancel() {
        message.error('点击了取消');
    }
    // 查看详情
    const getDetail = (id) => {
        props.dispatch({
            type: 'shop/orderDetails',
            payload: { ...dataConversion({
              'method':'rightsOfOrder.detail',
              'biz_content':JSON.stringify({
                "id":id,
                // "priceShishangBag":0
              })
            })}
        }).then((res) => {
            setOrder(res.result.order)
            setDetail(res.result.orderDetail)
            setCurrent(res.result.rightsOfOrder.state+1);
            setRightsOfOrder(res.result.rightsOfOrder);
        })
    }

    const handleCancel = () => setPreviewVisible(false );

    return(
    <PageHeaderWrapper>
        <Card  >
            <Steps  bordered="true" style={{width:600}} current={current} >
                <Step title="维权申请" description={order.createDate} />
                <Step title="处理完成" description={order.payDate} />
            </Steps>
        </Card>
        <Row>
            <Col span={8}>
                <Card title="订单信息" bordered="true" style={{ marginTop: 20,height:"100%" }}>
                    <Descriptions style={{marginLeft:50}} column={1} >
                        <Descriptions.Item label="订单编号">{order.sn} </Descriptions.Item>
                        <Descriptions.Item label="流水号"> {order.tradeNo} </Descriptions.Item>
                        <Descriptions.Item label="付款方式"> {order.paymentMethod} </Descriptions.Item>
                        <Descriptions.Item label="买家"> {order.consignee} </Descriptions.Item>
                        <Divider />
                        <Descriptions.Item label="退款金额"> {order.totalAmount} </Descriptions.Item>
                        <Descriptions.Item label="退款拾尚币"> {order.shishangBagTotalAmount} </Descriptions.Item>
                        <Descriptions.Item label="维权原因"> {rightsOfOrder.reason} </Descriptions.Item>
                        {/* <Descriptions.Item label="品牌">1810000000</Descriptions.Item>
                        <Descriptions.Item label="物流"></Descriptions.Item>
                        <Descriptions.Item label="收件地址">{order.address}</Descriptions.Item> */}
                    </Descriptions>,
                </Card>
            </Col>
            <Col span={16}>
                <Card  bordered="true" style={{ marginTop: 20,height:"100%",paddingRight:"20%" }}>
                    {current == 0?(
                        <Result  title="维权申请" icon={<SmileOutlined />}/>
                    ):current == 1?(
                        <Result  title="维权申请" icon={<DollarTwoTone />}
                        extra={
                            rightsOfOrder.state==0?
                            <Popconfirm title="确定处理吗？" onConfirm={() => {editSure(rightsOfOrder.id) } } onCancel={cancel}>
                                <Button type="primary">处理</Button>
                            </Popconfirm>
                            :""
                        // <Button type="primary" key="console"> 退款</Button> 
                        }
                        />
                    ):current == 2?(
                        <Result
                            status="success"
                            title="处理完成"
                            subTitle=""
                            extra={[
                            // <Button type="primary" key="console">
                            //     按钮1
                            // </Button>,
                            // <Button key="buy">按钮2</Button>,
                            ]}
                        />
                    ):null}
                </Card>
            </Col>
        </Row>
        <Card>
            <Descriptions
                layout="vertical"
                bordered
                // column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1,xs:1,xs:1 }}
                column={8}
            >
                <Descriptions.Item label="商品图">
                    <img 
                        className={style.tabImg}
                        alt="img" 
                        onClick={() => {setPreviewVisible(true)}}   
                        src={detail.pic}
                    />     
                </Descriptions.Item>
                <Descriptions.Item  label="商品基本信息">
                商品名称：{detail.productName}
                <br />
                
                </Descriptions.Item>
                    <Descriptions.Item label="单价(ssb)">{detail.unitPrice}</Descriptions.Item>
                    <Descriptions.Item label="数量">{detail.qty}</Descriptions.Item>
                    <Descriptions.Item label="抵扣(ssb)">{order.sbagAmount}</Descriptions.Item>
                    <Descriptions.Item label="实付(rmb)">{order.cashAmount}</Descriptions.Item>
                    <Descriptions.Item label="客户手机号">{order.mobile}</Descriptions.Item>
                    <Descriptions.Item label="状态">
                        {order.state==0?'待付款':order.state==1?'待发货':order.state==2?'待收货':order.state==3?'已完成':order.state==4?'已取消':''}
                    </Descriptions.Item>
                
            </Descriptions>



        </Card>
        <Modal
            visible={previewVisible}
            title={"商品图片"}
            footer={null}
            onCancel={handleCancel}
            >
            <img alt="example" style={{ width: '100%' }} src={"http://static.shishangbag.vip/upload/img/shop/23670082-1_b_1.jpg"} />
        </Modal>
        
        
        
        

        

    </PageHeaderWrapper>
    )



}

export default connect(({shop, loading}) => ({
    shop: shop,
    submitting: loading.effects['shop/orderDetails'],
}))(ProtectRightsDetails)


