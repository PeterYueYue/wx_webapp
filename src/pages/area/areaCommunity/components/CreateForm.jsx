
import React, { useState, useEffect, useRef } from "react";
import { Form, Button, message, Input, Modal, Select } from 'antd';
const { Option } = Select;
import dataConversion from '@/utils/dataConversion.js'
import { connect } from 'umi';
import style from "./../index.less"
const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 6 },
};
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
const CreateForm = (props) => {
  const { modalVisible, onCancel } = props;
  const [form] = Form.useForm();
  const [itemId, setItemId] = useState();

  // 地址选择
  const [provinceList_a, setProvinceList_a] = useState([])
  const [cityList_a, setCityList_a] = useState([])
  const [administrativeDistrict_a, setAdminstrativeDistrict_a] = useState([])
  const [street_a, setStreet_a] = useState([])
  // const [community_a, setCommunity_a] = useState([])



  useEffect(() => {
    // console.log(props)
    if (props.modalVisible.id) {//设置编辑
      setItemId(props.modalVisible.id);
      getSiteInfo(props.modalVisible.id)
      form.setFieldsValue(props.modalVisible);
    } else {
      form.resetFields();
    }
    getProvince()
  }, [props.modalVisible.id]);

  // 获取网点详情
  const getSiteInfo = (id) => {
    props.dispatch({
      type: 'site/getlist',
      payload: {
        ...dataConversion({
          'method': 'system.site.get',
          "biz_content": JSON.stringify({ "id": id })
        })
      }
    }).then(res => {
      console.log(res.result, "网点详情")
      form.setFieldsValue(res.result);
      editGetList(res.result)
    })

  }

  // 编辑获取地址数据

  const editGetList = (item) => {
    getCitys(item.provinceId)
    getAdministrativeDistrict(item.cityId)
    getStreet(item.zoneId)
    getCommunity(item.streetId)
  }

  // 获取省份列表数据
  const getProvince = () => {

    props.dispatch({
      type: 'site/getlist',
      payload: {
        ...dataConversion({
          'method': 'system.area.children',
          "biz_content": JSON.stringify({ "id": "0" })
        })
      }
    }).then(res => {
      console.log(res.result, "省份列表11")
      let arr = res.result
      setProvinceList_a(arr)

    })

  }
  // 根据省份Id获取城市列表数据
  const getCitys = (id) => {

    props.dispatch({
      type: 'site/getlist',
      payload: {
        ...dataConversion({
          'method': 'system.area.children',
          "biz_content": JSON.stringify({ "id": id })
        })
      }
    }).then(res => {
      setCityList_a(res.result)

      console.log(res, "城市列表")
    })

  }
  // 根据城市ID获取行政区列表数据
  const getAdministrativeDistrict = (id) => {

    props.dispatch({
      type: 'site/getlist',
      payload: {
        ...dataConversion({
          'method': 'system.area.children',
          "biz_content": JSON.stringify({ "id": id })
        })
      }
    }).then(res => {
      setAdminstrativeDistrict_a(res.result)

      console.log(res, "行政区列表")
    })

  }
  // 根据行政区ID获取街道列表数据
  const getStreet = (id) => {

    props.dispatch({
      type: 'site/getlist',
      payload: {
        ...dataConversion({
          'method': 'system.area.children',
          "biz_content": JSON.stringify({ "id": id })
        })
      }
    }).then(res => {
      setStreet_a(res.result)

      console.log(res, "街道列表")
    })

  }
  // 根据街道ID获取小区列表数据
  const getCommunity = (id) => {
    props.dispatch({
      type: 'site/getlist',
      payload: {
        ...dataConversion({
          'method': 'system.community.getByStreetId',
          "biz_content": JSON.stringify({ "id": id })
        })
      }
    }).then(res => {
      // setCommunity_a(res.result)
      console.log(res, "小区列表")
    })
  }


  const onChange_province = value => {
    getCitys(value) // 下拉选取省
    form.setFieldsValue({
      city: '',
      zone: '',
      street: '',
      communityId: '',
    });
  }
  const onChange_citys = value => {
    getAdministrativeDistrict(value)  // 下拉选取市
    form.setFieldsValue({
      zone: '',
      street: '',
      communityId: '',
    });
  }

  const onChange_administrativeDistrict = value => {
    getStreet(value)  // 下拉选取区
    form.setFieldsValue({
      street: '',
      communityId: '',
    });
  }
  const onChange_street = value => {
    getCommunity(value) // 下拉选取街道
    form.setFieldsValue({
      communityId: '',
    });
  }
  const onChange_community = value => { }






  // 提交订单
  const onFinish = values => {
    console.log(values);
    // return;
    let data = values;
    data.streetId = values.street;
    data.province = ''
    data.city = ''
    data.zone = ''
    data.street = ''
   
    if (props.modalVisible.id) {
      data.id = props.modalVisible.id
    }
    console.log(data, "data")
    props.dispatch({
      type: 'site/getlist',
      payload: {
        ...dataConversion({
          "method": itemId ? "system.community.update" : "system.community.save",
          "biz_content": JSON.stringify(data)
        })
      }
    }).then((res) => {
      if (res.code == 10000) {
        message.success('提交成功');
        props.onCancel();
        props.reload();
        form.resetFields()
      } else {
        message.error(res.msg);
      }
    })

  };


  return (
    <Modal
      // destroyOnClose
      getContainer={false}
      title="新增"
      visible={modalVisible}
      onOk={() => onFinish()}
      onCancel={() => props.onCancel()}
      reload={() => props.reload()}
      footer={null}
    >
      {/* {props.children} */}
      <Form form={form} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages} labelCol={{ span: 8 }}>
        <Form.Item name={['name']} label="小区名称" rules={[{ required: true }]}  >
          <Input placeholder="请输入" style={{ width: '200px' }} />
        </Form.Item>
        <Form.Item name={['province']} label="省份选择" rules={[{ required: true }]}  >
          <Select style={{ width: 200 }} placeholder="请选择" onChange={onChange_province} >
            {provinceList_a.map((e, i) => {
              return (<Option key={i} value={e.id}>{e.areaName}</Option>)
            })}
          </Select>
        </Form.Item>
        <Form.Item name={['city']} label="城市选择" rules={[{ required: true }]}  >
          <Select style={{ width: 200 }} placeholder="请选择" disabled={cityList_a.length < 1} onChange={onChange_citys} >
            {cityList_a.map((e, i) => {
              return (<Option key={i} value={e.id}>{e.areaName}</Option>)
            })}
          </Select>
        </Form.Item>
        <Form.Item name={['zone']} label="（区/县）选择" rules={[{ required: true }]}  >
          <Select style={{ width: 200 }} placeholder="请选择" disabled={administrativeDistrict_a.length < 1} onChange={onChange_administrativeDistrict}  >
            {administrativeDistrict_a.map((e, i) => {
              return (<Option key={i} value={e.id}>{e.areaName}</Option>)
            })}
          </Select>
        </Form.Item>
        <Form.Item name={['street']} label="街道选择" rules={[{ required: true }]}  >
          <Select style={{ width: 200 }} placeholder="请选择" disabled={street_a.length < 1} onChange={onChange_street} >
            {street_a.map((e, i) => {
              return (<Option key={i} value={e.id}>{e.areaName}</Option>)
            })}
          </Select>
        </Form.Item>
        <Form.Item name={['address']} label="详细地址" rules={[{ required: true }]}  >
          <Input placeholder="请输入" style={{ width: '200px' }} />
        </Form.Item>

        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type="primary" htmlType="submit">
            确定
            </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

// export default CreateForm;
export default connect(({ getSiteInfo, loading }) => ({
  getSiteInfo: loading.effects['site/getSiteInfo'],
}))(CreateForm);



