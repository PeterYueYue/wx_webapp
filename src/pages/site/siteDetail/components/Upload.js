import { Upload, Modal } from 'antd';
import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import api from './../../../../services/api';
import dataConversion from '@/utils/dataConversion.js';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}


const UploadImg = (props) => {


    const [previewVisible,setPreviewVisible] = useState(false);
    const [previewImage,setPreviewImage] = useState("");
    const [previewTitle,setPreviewTitle] = useState("");
   

    const handleCancel = () => setPreviewVisible(false );

    const handlePreview = async file => {
        if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url||file.preview  )
        setPreviewVisible(true)
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
    };

    const handleChange = ({ fileList }) => {
        props.onChange(fileList)
    };
    const uploadButton = (
        <div>
          <PlusOutlined />
          <div className="ant-upload-text">Upload</div>
        </div>
    );
    const props1 = {
      name: 'file',
      action: api+ 'apiv2/',
      headers: {
        authorization: 'authorization-text',
      },
      data: {
        ...dataConversion({
          'method': 'file.upload',
          "biz_content": JSON.stringify({
            isImage: true,
          })
        })
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
    return(
        <div style={{width:'80%'}} className="clearfix">
            <Upload
              {...props1}
              listType="picture-card"
              fileList={props.fileList}
              onPreview={handlePreview}
              onChange={handleChange}
            >
            {props.fileList.length >= props.length ? null : uploadButton}
            </Upload>
            <Modal
            visible={previewVisible}
            title={previewTitle}
            footer={null}
            onCancel={handleCancel}
            >
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </div>
    )



}

export default UploadImg
