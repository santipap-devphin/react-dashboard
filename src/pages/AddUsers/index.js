import React, { useEffect } from 'react';
import { Form, Input, Select, Button } from 'antd';
import Swal from "sweetalert2";
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../containers/Layout';
import { Card } from '../../commons';

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

const AddUsers = () => {
  const [form] = Form.useForm();
  let history = useHistory();

  const onFinish = (values) => {
    // form.resetFields();
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be add user!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Add Users", values);


                  if(values.password === values.confirm){

                    let formDatas = new FormData();
   
                          formDatas.append("name", values.name);
                          formDatas.append("email", values.email); 
                          formDatas.append("password", values.password); 
                          formDatas.append("ustatus", values.status); 
                          
        
  
                    axios({
                      method: 'post',
                      url: 'https://zio666.com/endpoint_content/insert_users.php',
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
                                              history.push('/users');
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


                  }else{

                    Swal.fire(
                      'ไม่สามารถเพิ่มข้อมูลได้',
                      '',
                      'error'
                    )

                  }
       
                  



      }
    });
  };
  const onChange = (value) => {
    console.log(`selected ${value}`);
  }
  const onBlur = () => {
    console.log('blur');
  }

  const onFocus = () => {
    console.log('focus');
  }

  const onSearch = (val) => {
    console.log('search:', val);
  }

  return (
    <Layout>
      <Card className="col-lg-8 col-xl-6">
        <Form
          form={form}
          layout="vertical"
          name="nest-messages"
          onFinish={onFinish}
          validateMessages={validateMessages}
        >
          <Form.Item
            name={'name'}
            label="Name"
            rules={[
              {
                required: true,
                message: 'Please enter your name.',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please enter your email!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={'status'}
            label="Status"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              style={{ width: 300 }}
              placeholder="Select a status"
              optionFilterProp="children"
              onChange={onChange}
              onFocus={onFocus}
              onBlur={onBlur}
              onSearch={onSearch}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option value="active">Active</Option>
              <Option value="inactive">InActive</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: 'Please enter your password!',
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(new Error('The two passwords that you entered do not match!'));
                },
              }),
            ]}
          >
            <Input.Password />
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

export default AddUsers;
