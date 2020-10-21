
import React, { useState, useEffect } from "react";
import { Form, Input, Button, Row, Col, DatePicker, Descriptions, Card, Statistic } from "antd"
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import dataConversion from '@/utils/dataConversion.js'
import UploadImg from "./../../shop/ProductEdit/components/Upload"
import { history } from 'umi';
import { connect } from 'umi';
import style from "./index.less"
const { RangePicker } = DatePicker;
import { Column } from '@ant-design/charts';
import moment from 'moment';



const ProductEdit = (props) => {
    const [form] = Form.useForm();
    const [itemId] = useState(history.location.query.id ? history.location.query.id : "")
    const [data, setData] = useState([]);
    const [config, setConfig] = useState({});
    const [detail, setDetail] = useState({});
    useEffect(() => {
        if (itemId) {
            getDetail(itemId)
        }
    }, [itemId])
    useEffect(() => {
        if (data.length !== 0) {
            const configs = {
                data,
                height: 300,
                xField: 'type',
                yField: 'value',
                point: {
                    size: 5,
                    shape: 'diamond',
                },
            };
            setConfig(configs)
        }
    }, [data]);

    const getDetail = (id,startDate,endDate) => {
        props.dispatch({
            type: 'shop/supportList',
            payload: {
                ...dataConversion({
                    'method': 'system.site.dataDetail',
                    'biz_content': JSON.stringify({
                        "siteId": id,
                        "startDate": startDate?startDate:'',
                        "endDate": endDate?endDate:'',
                    })
                })
            }
        }).then((res) => {
            let list = [
                { type: '总投递', value: 0, },
                { type: '正确投递', value: 0, },
                { type: '错误投递', value: 0, },
            ];
            list[0].value = res.result.totalDelivery;
            list[1].value = res.result.rightDelivery;
            list[2].value = res.result.errorDelivery;
            setData(list);
            setDetail(res.result)
        })
    }
    const onFinish = values => {
        if(values.date) {
            const startDate = moment(values.date[0]._d).format('YYYY-MM-DD');
            const endDate= moment(values.date[1]._d).format('YYYY-MM-DD');
            getDetail(itemId,startDate,endDate)     
        }
                   

    }

    return (
        <PageHeaderWrapper>
            <Card>
                <Form form={form} name="nest-messages" onFinish={onFinish} labelCol={{ span: 2 }}>
                    <Form.Item name={['date']} label="起止日期" >
                        <RangePicker
                            value={[moment()]}
                        />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                        查询
                    </Button>
                </Form>
            </Card>
            <Card
                title='数据查看'
                style={{ marginTop: 20 }}
            >
                <Row gutter={24}>
                    <Col span={4}>
                        <Statistic title="发放积分" value={detail.totalPoint} precision={2} />
                    </Col>
                    <Col span={12}>
                        {
                            JSON.stringify(config) !== "{}" ?
                                <Column {...config} style={{ 'width': '600px' }} />
                                : null
                        }
                    </Col>
                </Row>
            </Card>
        </PageHeaderWrapper>
    )
}

export default connect(({ shop, loading }) => ({
    shop: shop,
    submitting: loading.effects['shop/productEdit'],
}))(ProductEdit);