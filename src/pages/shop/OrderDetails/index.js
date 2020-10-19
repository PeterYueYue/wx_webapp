
import React, { useState, useRef, useEffect } from 'react';
import { Steps, Card, Row, Col, Divider, Descriptions, Result, Button, Modal, Popconfirm } from 'antd';
import { SmileOutlined, CarTwoTone, DollarTwoTone } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Link, connect, history } from 'umi';
import dataConversion from '@/utils/dataConversion.js'
import style from "./index.less"
const { Step } = Steps;



const OrderDetails = (props) => {
    const [previewVisible, setPreviewVisible] = useState(false);
    const [current, setCurrent] = useState(0)
    const [itemId] = useState(history.location.query.id ? history.location.query.id : "")
    const [detail, setDetail] = useState({})
    const [order, setOrder] = useState({})
    useEffect(() => {
        if (itemId) {
            getDetail(itemId)
        }
    }, [])

    // 查看详情
    const getDetail = (id) => {
        props.dispatch({
            type: 'shop/orderDetails',
            payload: {
                ...dataConversion({
                    'method': 'order.getById',
                    'biz_content': JSON.stringify({
                        "id": id,
                        // "priceShishangBag":0
                    })
                })
            }
        }).then((res) => {
            console.log(res)
            if (res.result.order.paymentMethod == "isv" || res.result.order.paymentMethod == "zfb") {
                res.result.order.paymentMethod = "支付宝"
            } else if (res.result.order.paymentMethod == "wx") {
                res.result.order.paymentMethod = "微信"
            } else if (res.result.order.paymentMethod == "ssb") {
                res.result.order.paymentMethod = "拾尚币全额抵扣"
            }
            setOrder(res.result.order)
            setDetail(res.result.orderDetail)
            setCurrent(res.result.order.state)
        })
    }

    const handleCancel = () => setPreviewVisible(false);

    const editSure = (id) => {//发货
        const arr = [];
        arr.push(id)
        return props.dispatch({
            type: 'productSort/productEdit',
            payload: {
                ...dataConversion({
                    'method': 'order.delivery',
                    "biz_content": JSON.stringify(arr)
                })
            }
        }).then((res) => {
            getDetail(itemId)
        })
    }
    function cancel() {
        message.error('点击了取消');
    }
    return (
        <PageHeaderWrapper>
            <Card  >
                <Steps bordered="true" current={current + 1} >
                    <Step title="买家下单" description={order.createDate} />
                    <Step title="买家付款" description={order.payDate} />
                    <Step title="商家发货" description={order.deliverDate} />
                    <Step title="交易完成" description={order.finishDate} />
                </Steps>
            </Card>
            <Row>
                <Col span={8}>
                    <Card title="订单信息" bordered="true" style={{ marginTop: 20, height: "100%" }}>
                        <Descriptions style={{ marginLeft: 50 }} column={1} >
                            <Descriptions.Item label="订单编号">{order.sn} </Descriptions.Item>
                            <Descriptions.Item label="流水号"> {order.tradeNo} </Descriptions.Item>
                            <Descriptions.Item label="付款方式">{order.paymentMethod}</Descriptions.Item>
                            <Descriptions.Item label="买家"> {order.consignee} </Descriptions.Item>
                            <Divider />
                            <Descriptions.Item label="品牌">{detail.supplierName} </Descriptions.Item>
                            <Descriptions.Item label="物流"></Descriptions.Item>
                            <Descriptions.Item label="收件地址">{order.address}</Descriptions.Item>
                        </Descriptions>,
                </Card>
                </Col>
                <Col span={16}>
                    <Card bordered="true" style={{ marginTop: 20, height: "100%", paddingRight: "20%" }}>
                        {current == 0 ? (
                            <Result title="买家下单" icon={<SmileOutlined />} />
                        ) : current == 1 ? (
                            <Result title="买家付款" icon={<DollarTwoTone />}
                                extra={
                                    // <Button type="primary" key="console"> 发货</Button>
                                    order.state == 1 ?
                                        <Popconfirm title="确定发货吗？" onConfirm={() => { editSure(order.id) }} onCancel={cancel}>
                                            <Button type="primary">发货</Button>
                                        </Popconfirm>
                                        : ""
                                }
                            />
                        ) : current == 2 ? (
                            <Result title="商家发货" icon={<CarTwoTone />} />
                        ) : current == 3 ? (
                            <Result
                                status="success"
                                title="交易完成"
                                subTitle=""
                                extra={[
                                    // <Button type="primary" key="console">
                                    //     按钮1
                                    // </Button>,
                                    // <Button key="buy">按钮2</Button>,
                                ]}
                            />
                        ) : null}
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
                            src={detail.pic}
                        />
                    </Descriptions.Item>
                    <Descriptions.Item label="商品基本信息"> 商品名称：{detail.productName} <br />
                    </Descriptions.Item>
                    <Descriptions.Item label="单价(ssb)">{detail.unitPrice}</Descriptions.Item>
                    <Descriptions.Item label="数量">{detail.qty}</Descriptions.Item>
                    <Descriptions.Item label="抵扣(ssb)">{order.sbagAmount}</Descriptions.Item>
                    <Descriptions.Item label="实付(rmb)">{order.cashAmount}</Descriptions.Item>
                    <Descriptions.Item label="客户手机号">{order.mobile}</Descriptions.Item>
                    <Descriptions.Item label="状态">
                        {order.state == 0 ? '待付款' : order.state == 1 ? '待发货' : order.state == 2 ? '待收货' : order.state == 3 ? '已完成' : order.state == 4 ? '已取消' : ''}
                    </Descriptions.Item>
                </Descriptions>
            </Card>
        </PageHeaderWrapper>
    )



}

export default connect(({ shop, loading }) => ({
    shop: shop,
    submitting: loading.effects['shop/orderDetails'],
}))(OrderDetails)


