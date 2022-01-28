import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button } from 'antd';
import Swal from "sweetalert2";
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../containers/Layout';
import { Card } from '../../commons';
import { group } from '../../mock/data';

const { Option } = Select;

/* eslint-disable no-template-curly-in-string */

const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
    number: '${label} is not a valid number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};
/* eslint-enable no-template-curly-in-string */

const AddWebsite = () => {
  const [form] = Form.useForm();
  let history = useHistory();
  let stat = ["online","offline"];
  const [Datas,setDatas] = useState([]);
  const [sDatas,setsDatas] = useState(false);
  const [grouss,setgrouss] = useState(null);

  useEffect(() => {
    axios.get("https://zio666.com/endpoint_content/load_once_group.php").then(resp => {
      
      setDatas(state => {

        return resp.data.map(({ id, title }) => ({ id, label: title }));
        
      });
    });
    setsDatas(true)
  }, [setDatas]);

  const onFinish = (values) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be edit this content!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {


            console.log("Add website", values)
            let formDatas = new FormData();
   
             formDatas.append("website_name", values.website);
             formDatas.append("db_user", values.db_user); 
             formDatas.append("db_pass", values.db_pass); 
             formDatas.append("db_name", values.db_name); 
             formDatas.append("groups", grouss); 
             formDatas.append("groupsid", values.group); 
             formDatas.append("status",values.status);  
           

            axios({
              method: 'post',
              url: 'https://zio666.com/endpoint_content/insert_website.php',
              data: formDatas,
              dataType:'json',
              config: { headers: {'Content-Type': 'multipart/form-data' }}
              })
              .then(function (response) {
                       
                      if(response.data.code === 1)
                      {
                              Swal.fire({
                                title: 'เพิ่มข้อมูลเรียบร้อย',
                                text: "",
                                icon: 'success',
                                showCancelButton: false,
                                confirmButtonColor: '#3085d6',
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Close'
                              }).then((results) => {
                                if (results.isConfirmed) {
                                      history.push('/website');
                                }
                              })
                       }
                      else if(response.data.code === 2){

                        Swal.fire(
                          'ไม่สามารถเพิ่มข้อมูลได้',
                          '',
                          'error'
                        )

                      }
                      else{

                        Swal.fire(
                          'ข้อมูลไม่ถูกต้อง',
                          '',
                          'error'
                        )

                      }

                      
                
              })
              .catch(function (response) {
                 
                  console.log(response)
              });

        
      }
    });
  };
  const onChange = (value) => {
    console.log(`selected ${value}`);
  }
  const onChanges = (value , event) => {
   
    //console.log(event.children)
    setgrouss(event.children);
    //var index = event.nativeEvent.target.selectedIndex;
    //var texts = event.nativeEvent.target[index].text;
    //console.log(`selected ${texts}`);
  }
  const onBlur = () => {
    console.log('blur');
  }

  const onFocus = () => {
    console.log('focus');
  }

  const onSearch = (val) => {
    console.log(val);
  }
  return (
    <Layout>
      <Card className="col-lg-8 col-xl-12">
        <Form
          form={form}
          layout="vertical"
          name="nest-messages"
          onFinish={onFinish}
          validateMessages={validateMessages}
        >
          <Form.Item
            name={'website'}
            label="WebSite Name"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={'db_user'}
            label="Database User"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={'db_pass'}
            label="Database Password"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
            
          </Form.Item>
          <Form.Item
            name={'db_name'}
            label="Database Name"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
            
          </Form.Item>
          <Form.Item
            name={'group'}
            label="Group"
          >
            <Select
              showSearch
              style={{ width: '100%' }}
              placeholder="Select a group"
              optionFilterProp="children"
              onChange={onChanges}
              onFocus={onFocus}
              onBlur={onBlur}
              onSearch={onSearch}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
             
              {
                (sDatas !== false) ?
                  Datas.map((item) => (
                    <Option value={item.id} key={item.id}>{item.label}</Option>
                  ))
                  :null
              }
            </Select>
          </Form.Item>
          <Form.Item
            name={'status'}
            label="Status"
          >
            <Select
              showSearch
              style={{ width: '100%' }}
              placeholder="Select a Status"
              optionFilterProp="children"
              onChange={onChange}
              onFocus={onFocus}
              onBlur={onBlur}
              onSearch={onSearch}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {

                stat.map((vals,keys) => (
                  <Option value={vals} key={keys}>{vals}</Option>
                ))
              }
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
        </Button>
          </Form.Item>
        </Form>
      </Card>
    </Layout>
  );
}

export default AddWebsite;
