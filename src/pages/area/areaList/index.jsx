
import React, { useState, useEffect, useRef } from "react";
import { QuestionCircleOutlined, PlusOutlined, BlockOutlined } from '@ant-design/icons';
import { Form, Row, Col, Button, Table, Tag, Space, message, Input, Card, Modal, Select, Popconfirm } from 'antd';
const { Option } = Select;
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import style from "./index.less"
import { Link, connect } from 'umi';
import dataConversion from '@/utils/dataConversion.js'
import { set } from "lodash";





const SiteList = (props) => {
  const [form] = Form.useForm();
  const [list, setList] = useState([]);
  const [createModalVisible, handleModalVisible] = useState(false);
  const [siteItem, setSiteItem] = useState('')
  const actionRef = useRef();
  // 地址选择
  const [provinceList, setProvinceList] = useState([])
  const [cityList, setCityList] = useState([])
  const [administrativeDistrict, setAdminstrativeDistrict] = useState([])
  const [street, setStreet] = useState([])
  const [open, setOpen] = useState([])
  const [community, setCommunity] = useState([])
  // 分页
  const [total, setTotal] = useState('')
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  // 查询数据
  const [provinceItem, setProvinceItem] = useState(""); //省
  const [cityItem, setCityItem] = useState(""); //市
  const [admDisItem, setAdmDisItem] = useState(""); //区、县
  const [streetItem, setStreetItem] = useState(""); //街道
  const [openItem, setOpenItem] = useState(""); //开通
  const [siteValue, setSiteValue] = useState("")
  const [linkManName, setLinkManName] = useState("")

  useEffect(() => {
    getProvince()
    getProductList()
  }, [])

  const columns = [
    {
      title: '区域名称',
      dataIndex: 'areaName',
      key: 'name',
    },
    {
      title: '详细地址',
      dataIndex: 'titleClassification',
      key: 'province',
    },
    {
      title: '状态',
      dataIndex: 'isOpen',
      render: (value) => {
        if(value==1) {
          return '已开通'
        } else {
          return '未开通'
        }
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a onClick={() => {
            setAreaOpen(record)
          }}
          >{record.isOpen==0?"开通":"关闭"} </a>
          <a onClick={() => {
            // setSiteItem(record)
            // handleModalVisible(true)
          }}
          >编辑</a>
          <Popconfirm title="确定删除吗？" onConfirm={() => deleteItem(record.id)} icon={<QuestionCircleOutlined style={{ color: 'red' }} />}>
            <a>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  
  // 获取省份列表数据
  const getProvince = () => {
    props.dispatch({
      type: 'site/getlist',
      payload: {
        ...dataConversion({
          'method': 'system.area.allChildren',
          "biz_content": JSON.stringify({ "id": "0" })
        })
      }
    }).then(res => {
      let arr = res.result
      setProvinceList(arr)
    })

  }
  // 根据省份Id获取城市列表数据
  const getCitys = (id, item) => {
    setProvinceItem(item.item)
    props.dispatch({
      type: 'site/getlist',
      payload: {
        ...dataConversion({
          'method': 'system.area.allChildren',
          "biz_content": JSON.stringify({ "id": id })
        })
      }
    }).then(res => {
      setCityList(res.result)
    })

  }
  // 根据城市ID获取行政区列表数据
  const getAdministrativeDistrict = (id, item) => {

    setCityItem(item.item)
    props.dispatch({
      type: 'site/getlist',
      payload: {
        ...dataConversion({
          'method': 'system.area.allChildren',
          "biz_content": JSON.stringify({ "id": id })
        })
      }
    }).then(res => {
      setAdminstrativeDistrict(res.result)
    })

  }
  // 根据行政区ID获取街道列表数据
  const getStreet = (id, item) => {
    setAdmDisItem(item.item)
    props.dispatch({
      type: 'site/getlist',
      payload: {
        ...dataConversion({
          'method': 'system.area.allChildren',
          "biz_content": JSON.stringify({ "id": id })
        })
      }
    }).then(res => {
      setStreet(res.result)
    })

  }
  // 根据街道ID获取小区列表数据
  const getCommunity = (id, item) => {
    setStreetItem(item.item)
    props.dispatch({
      type: 'site/getlist',
      payload: {
        ...dataConversion({
          'method': 'system.community.getByStreetId',
          "biz_content": JSON.stringify({ "id": id })
        })
      }
    }).then(res => {
      setCommunity(res.result)
      console.log(res, "小区列表")
    })
  }
  const getOpen = (id, item) => {
    setOpenItem(item.item)
  }
  // //根据小区ID返回网点数据
  // const getSite = (id, item) => {
  //   setCommunityItem(item.item)
  //   props.dispatch({
  //     type: 'site/getlist',
  //     payload: {
  //       ...dataConversion({
  //         'method': 'system.community.getByStreetId',
  //         "biz_content": JSON.stringify({ "id": id })
  //       })
  //     }
  //   }).then(res => {
  //     console.log(res, "网点")
  //   })
  // }

  const onChange_province = (value, item) => getCitys(value, item) // 下拉选取省
  const onChange_citys = (value, item) => getAdministrativeDistrict(value, item)  // 下拉选取市
  const onChange_administrativeDistrict = (value, item) => getStreet(value, item)  // 下拉选取区
  const onChange_street = (value, item) => getCommunity(value, item) // 下拉选取街道
  // const onChange_community = (value, item) => getSite(value, item)   // 根据小区ID返回网点数据
  const onChange_State = (value, item) => getOpen(value, item)   // 下拉选取是否开通
  // 列表
  
  let titleClassification = '';
  const getProductList = (page) => {
    console.log(123)
    if (provinceItem) {
      titleClassification+=provinceItem.areaName;
    }
    if (cityItem) {
      titleClassification+='-'+cityItem.areaName;
    }
    if (admDisItem) {
      titleClassification+='-'+admDisItem.areaName;
    }
    if (streetItem) {
      titleClassification+='-'+streetItem.areaName;
    }
    props.dispatch({
      type: 'site/productList',
      payload: {
        ...dataConversion({
          'method': 'system.area.page',
          "biz_content": JSON.stringify({
            "pageNumber": page ? page : current,
            "pageSize": pageSize,
            "titleClassification": titleClassification,
            "areaName": siteValue,
            "isOpen": openItem.id,
          })
        })
      }
    }).then(res => {
      setList(res.data)
      setTotal(res.total)
      setCurrent(res.current)
    })
  }
  const setAreaOpen = (value) => {
    return props.dispatch({
      type: 'site/getlist',
      payload: {
        ...dataConversion({
          'method': 'system.area.setOpen',
          "biz_content": JSON.stringify({
            "id": value.id,
          })
        })
      }
    }).then((res) => {
      reload();
    })
  }
  const deleteItem = (id) => {
    return props.dispatch({
      type: 'site/getlist',
      payload: {
        ...dataConversion({
          'method': 'system.area.delete',
          "biz_content": JSON.stringify({
            "id": id,
          })
        })
      }
    }).then((res) => {
      reload();
    })
  }
  const reload = () => {
    getProductList()
  }
  // 搜索查询
  const search = () => {
    getProductList()
  }
  //重置
  const clearForm=()=> {//数据置空
    location.reload();
    // form.resetFields();
    // setAdmDisItem();
    // setCityItem()
    // setStreetItem();
    // getProductList()
  }
  // 打开新建组件
  function openModalVisible() {
    handleModalVisible(true)
  }

  function siteName(val) {
    console.log(val)
  }
  

  // 分页处理
  const pagination = {
    current: current,
    pageSize: pageSize,
    total: total,
    showTotal: () => `共${total}条`,
    onChange: (page, pageSize) => {
      setCurrent(page)
      getProductList(page)
    }
  }

  const openList = [
    {
      id:0,
      areaName: "未开通",
    },
    {
      id:1,
      areaName: "已开通",
    }
  ]
  return (
    <PageHeaderWrapper>
      <Card bordered={true} style={{ width: "100%" }}>
        <Form form={form} name="nest-messages"  >
          <Row className={style.row}>
            <Col className={style.inputItem} span={8}>
              <Form.Item name={['province']} label="省份选择"  >
                <Select style={{ width: 200 }} placeholder="请选择" onChange={onChange_province} >
                  {provinceList.map((e, i) => {
                    return (<Option key={i} item={e} value={e.id}>{e.areaName}</Option>)
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name={['city']} label="城市选择"  >
                <Select style={{ width: 200 }} placeholder="请选择" onChange={onChange_citys} >
                  {cityList.map((e, i) => {
                    return (<Option key={i} item={e} value={e.id}>{e.areaName}</Option>)
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name={['administrativeDistrict']} label="区/县选择"  >
                <Select style={{ width: 200 }} placeholder="请选择" optionFilterProp="children" onChange={onChange_administrativeDistrict} >
                  {administrativeDistrict.map((e, i) => {
                    return (<Option key={i} item={e} value={e.id}>{e.areaName}</Option>)
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row className={style.row}>
            <Col span={8}>
              <Form.Item name={['street']} label="街道选择"  >
                <Select style={{ width: 200 }} placeholder="请选择" optionFilterProp="children" onChange={onChange_street} >
                  {street.map((e, i) => {
                    return (<Option key={i} item={e} value={e.id}>{e.areaName}</Option>)
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <span>区域名称: </span>
              <Input style={{ width: 200 }} value={siteValue} onChange={(e) => { setSiteValue(e.target.value) }} placeholder="请输入" />
            </Col>
            <Col span={8}>
              <Form.Item name={['isOpen']} label="是否开通"  >
                  <Select style={{ width: 200 }} placeholder="请选择" optionFilterProp="children" onChange={onChange_State} >
                    {openList.map((e, i) => {
                      return (<Option key={i} item={e} value={e.id}>{e.areaName}</Option>)
                    })}
                  </Select>
                </Form.Item>
            </Col>
          </Row>
          <div className={style.searBtnBox}>
            <Button className={style.search} onClick={search} type="primary">查询</Button>
            <Button onClick={clearForm}>重置</Button>
          </div>
        </Form>
      </Card>
      <Table pagination={pagination} className={style.table} bordered={true} columns={columns} dataSource={list} />
      <CreateForm
        onCancel={() => { handleModalVisible(false) }} modalVisible={createModalVisible}
        siteItem={siteItem}
        reload={() => { reload() }}
      >
      </CreateForm>

    </PageHeaderWrapper>
  );
};
export default connect(({ SiteList, loading }) => ({
  SiteList: SiteList,
  submitting: loading.effects['site/SiteList'],
}))(SiteList);
