
import React, { useState, useEffect } from "react";
import { Form, Input, Button, Row, Col, Select, Checkbox, message, Switch } from "antd"
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import dataConversion from '@/utils/dataConversion.js'
import UploadImg from "./components/Upload"
import { history } from 'umi';
import { connect } from 'umi';
import style from "./index.less"

const { TextArea } = Input;
const { Option } = Select;
const ProductEdit = (props) => {

    const [form] = Form.useForm();
    const [support, setSupport] = useState([])
    const [state, setState] = useState(false)
    const [productType, setProductType] = useState([])
    const [supplier, setSupplier] = useState([])
    const [goodType, setGoodType] = useState([])
    const [itemId] = useState(history.location.query.id ? history.location.query.id : "")
    const layout = {
        labelCol: { span: 2 },
        wrapperCol: { span: 6 },
    };


    useEffect(() => {
        supportList()
        productTypeList()
        supplierList()
        if (itemId) {
            getDetail(itemId)
        }

    }, []);
    // 支持列表
    const supportList = () => {
        props.dispatch({
            type: 'shop/supportList',
            payload: {
                ...dataConversion({
                    'method': 'support.list'
                })
            }
        }).then((res) => {
            setSupport(res.result)
        })
    }
    // 商品类型
    const productTypeList = () => {
        props.dispatch({
            type: 'shop/supportList',
            payload: {
                ...dataConversion({
                    'method': 'productType.list'
                })
            }
        }).then((res) => {
            setProductType(res.result)
        })
    }
    // 供应商
    const supplierList = () => {
        props.dispatch({
            type: 'shop/supportList',
            payload: {
                ...dataConversion({
                    'method': 'supplier.list'
                })
            }
        }).then((res) => {
            setSupplier(res.result)
        })
    }
    // 查看详情
    const getDetail = (id) => {
        props.dispatch({
            type: 'shop/supportList',
            payload: {
                ...dataConversion({
                    'method': 'product.get',
                    'biz_content': JSON.stringify({
                        "id": id,
                        "priceShishangBag": 0
                    })
                })
            }
        }).then((res) => {
            editImg(res.result)
            form.setFieldsValue({
                name: res.result.name,
                freight: res.result.freight,
                state: res.result.state,
                remark: res.result.remark,
                typeId: res.result.typeId,
                price: res.result.price,
                marketPrice: res.result.marketPrice,
                stock: res.result.stock,
                tag: res.result.tag,
                supportIds: res.result.supports.map(e => e.id),
                supplier: res.result.supplier,
                supplierId: res.result.supplierId,
                sn: res.result.sn,
                goods: res.result.goods,
                goodType: res.result.productType,
                useInstructions: res.result.useInstructions,
            })
            setGoodType(res.result.productType)
            setState(res.result.state == 1 ? false : true)

        })
    }

    // 编辑时图片处理
    const editImg = (result) => {
        let fileList1 = [{
            uid: result.id,
            name: "商品主图",
            status: 'done',
            url: result.longMainPic,
            response: { shortImgUrl: result.mainPic }
        }]
        let fileList2 = result.productThumbList.map((e) => {
            let obj = {
                uid: e.id,
                name: "轮播图片",
                status: 'done',
                url: e.longPic,
                response: { shortImgUrl: e.pic }
            }
            return obj
        });
        let fileList3 = result.descPics.map((e) => {
            let obj = {
                uid: e.shortPic,
                name: "详情图片",
                status: 'done',
                url: e.longPic,
                response: { shortImgUrl: e.shortPic }
            }
            return obj

        });

        setFileList1(fileList1)
        setFileList2(fileList2)
        setFileList3(fileList3)
    }
    const validateMessages = {
        required: '${label} is required!',
        types: {
            email: '${label} is not validate email!',
            number: '${label} is not a validate number!',
        },
        number: {
            range: '${label} must be between ${min} and ${max}',
        },
    };
    // 主图数据
    const [fileList1, setFileList1] = useState([])
    // 轮播图数据
    const [fileList2, setFileList2] = useState([])
    // 详情图数据
    const [fileList3, setFileList3] = useState([])
    // 主图
    const handleChange1 = (fileList) => {
        setFileList1(fileList)
    };
    // 轮播图
    const handleChange2 = (fileList) => {
        setFileList2(fileList)
    };
    // 详情图
    const handleChange3 = (fileList) => {
        setFileList3(fileList)
    };

    const goods = [
        {
            id: 0,
            name: "实物"
        },
        {
            id: 1,
            name: "电子券"
        },
    ]
    const changeGood = value => {
        console.log(value);
        setGoodType(value)
    }
    const onFinish = values => {
        let mainPic = '';
        let pics = [];
        let description = '';
        if (fileList1.length > 0 && fileList2.length > 0) {
            mainPic = fileList1[0].response.shortImgUrl;

            fileList2.map((item, index) => {
                pics.push(item.response.shortImgUrl)
            })
            if (fileList3.length > 0) {
                fileList3.map((item, index) => { description += item.response.shortImgUrl + ',' })
            }
        } else {
            message.warning('请添加图片');
            return;
        }
        console.log(values);
        props.dispatch({
            type: 'shop/supportList',
            payload: {
                ...dataConversion({
                    "method": itemId ? "product.update" : "product.save",
                    "biz_content": JSON.stringify({
                        "id": itemId,
                        "cashPrice": values.cashPrice,
                        "freight": values.freight,
                        "marketPrice": values.marketPrice,
                        "price": values.price,
                        "name": values.name,
                        "pics": pics,
                        "description": description,
                        "mainPic": mainPic,
                        "productType": values.goodType,
                        "sn": values.sn,
                        "remark": values.remark,
                        "useInstructions": values.useInstructions,
                        "supplierId": values.supplierId,
                        "supportIds": values.supportIds,
                        "tagId": values.tagId,
                        "typeId": values.typeId,
                        "tag": values.tag,
                        "state": state ? 0 : 1,
                        "stock": values.stock
                    })
                })
            }
        }).then((res) => {
            if (res.code == 10000) {
                message.success('提交成功');
                form.resetFields()
                setFileList1([])
                setFileList2([])
                setFileList3([])
                history.go(-1)
            } else {
                message.error(res.msg);
            }
        })
    };
    const formItemLayout = {
        labelCol: { span: 2 },
        wrapperCol: { span: 18 },
    };
    return (
        <PageHeaderWrapper>
            <div className={style.content}>
                <div>
                    <div className={style.title}>基础信息</div>
                    <Form form={form} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages} {...formItemLayout}>
                        <Form.Item name={['name']} label="商品名称" rules={[{ required: true }]}>
                            <Input style={{ width: '300px' }} />
                        </Form.Item>
                        <Form.Item name="goodType" label="商品类型 " rules={[{ required: true }]} >
                            <Select
                                placeholder="请选择商品类型"
                                allowClear
                                style={{ width: '300px' }}
                                onChange={changeGood}
                            >
                                {goods.map((item) => {
                                    return <Option key={item.id} value={item.id}>{item.name}</Option>
                                })}
                            </Select>
                        </Form.Item>
                        {
                            goodType == 1 ?
                                <Form.Item name="sn" label="商品编号 " rules={[{ required: true }]} col={14}>
                                    <Input name="sn" placeholder="填写商品编号" style={{ width: '300px' }} rules={[{ required: true }]} />
                                </Form.Item>
                                : ""
                        }
                        {goodType == 1 ?
                            <Form.Item name="useInstructions" label="使用说明" rules={[{ required: true }]} col={14}>
                                <TextArea name="useInstructions" placeholder="使用说明" style={{ width: '300px' }} rules={[{ required: true }]} rows={4} />
                            </Form.Item>
                            : ""
                        }
                        <Form.Item className={style.formItem1} name={['mainPic']} label="商品主图" rules={[{ required: false }]}>
                            <Row>
                                <Col className={style.uploadBox} span={4}>
                                    <UploadImg length={1} onChange={handleChange1} fileList={fileList1} />
                                </Col>
                                <Col className={style.uploadBox} span={14}>
                                    <div><span className={style.icon}>*</span>  轮播图片：</div>
                                    <UploadImg length={6} onChange={handleChange2} fileList={fileList2} />
                                </Col>
                            </Row>
                        </Form.Item>
                        <Form.Item className={style.formItem1} name={['pics']} label="详情图片" rules={[{ required: false }]}>
                            <UploadImg length={6} onChange={handleChange3} fileList={fileList3} />
                        </Form.Item>
                        <Form.Item name="typeId" label="商品分类" rules={[{ required: true }]}>
                            <Select
                                placeholder="请选择商品类型"
                                allowClear
                                style={{ width: '300px' }}
                            >
                                {productType.map((item) => {
                                    return <Option key={item.id} value={item.id}>{item.name}</Option>
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item name="supplierId" label="商家选择 " rules={[{ required: true }]}>
                            <Select
                                placeholder="请选择供应商"
                                allowClear
                                style={{ width: '300px' }}
                            >
                                {supplier.map((item) => {
                                    return <Option key={item.id} value={item.id}>{item.name}</Option>
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item name={['price']} label="商品价格" rules={[{ required: true }]} >
                            <Input style={{ width: '100px' }} />
                        </Form.Item>
                        <Form.Item name={['marketPrice']} label="商品售价" rules={[{ required: true }]} >
                            <Input style={{ width: '100px' }} />
                        </Form.Item>
                        <Form.Item name={['tag']} label="商品标签" rules={[{ required: false }]} >
                            <Input maxLength={4} style={{ width: '100px' }} />
                        </Form.Item>
                        <Form.Item name="supportIds" label="商品支持" rules={[{ required: true }]} >
                            <Checkbox.Group style={{ width: '800px' }} >
                                <Row>
                                    {support.map((item) => {
                                        return <Col key={item.id} span={8}> <Checkbox value={item.id} style={{ lineHeight: '32px', }}> {item.name} </Checkbox> </Col>
                                    })}
                                </Row>
                            </Checkbox.Group>
                        </Form.Item>
                        <Form.Item name={['remark']} label="商品简介" rules={[{ required: false }]}>
                            <Input style={{ width: '300px' }} />
                        </Form.Item>
                        <Form.Item name={['stock']} label="商品库存" rules={[{ required: true }]}>
                            <Input style={{ width: '300px' }} />
                        </Form.Item>
                        <Form.Item name={['freight']} label="快递费用" rules={[{ required: true }]}>
                            <Input style={{ width: '100px' }} />
                        </Form.Item>
                        <Form.Item name={['state']} label="商品状态" rules={[{ required: false }]}>
                            <Switch checkedChildren="开" checked={state} onChange={() => { setState(!state) }} unCheckedChildren="关" />
                        </Form.Item>
                        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                            <Button type="primary" htmlType="submit">
                                确定
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </PageHeaderWrapper>
    )



}

export default connect(({ shop, loading }) => ({
    shop: shop,
    submitting: loading.effects['shop/productEdit'],
}))(ProductEdit);