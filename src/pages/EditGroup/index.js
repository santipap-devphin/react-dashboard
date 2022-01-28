import React, { useState ,useEffect } from 'react';
import { Form, Input, Select, Button } from 'antd';
import Swal from "sweetalert2";
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../containers/Layout';
import { Card } from '../../commons';
import { group, users } from '../../mock/data';

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

const EditGroup = (props) => {

  //console.log(props.match.params.slug)
  let history = useHistory();
  const [form] = Form.useForm();
  const [data, setData] = useState(users[0]);
  const [param, setparam] = useState(props.match.params.slug);
  const [edits, setedits] = useState([]);
  const [loads, setloads] = useState(false);
  

  const fetchedit = async () => {

    const res = await fetch(`https://zio666.com/endpoint_content/edit_group.php?id=${param}`)
    const data = await res.json()
    
    
    setedits(data)
    setloads(true);
    
  }

  useEffect(() => {

    fetchedit();

    console.log(form)
  
  },[setedits])

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

        let formDatas = new FormData();
        formDatas.append("id", param); 
        formDatas.append("name", values.name); 
       
        axios({
          method: 'post',
          url: 'https://zio666.com/endpoint_content/update_group.php',
          data:formDatas,
          //dataType:'json',
          config: { headers: {'Content-Type': 'multipart/form-data' }}
          })
          .then(function (response) {
            console.log(response)
            if(response.data === "ok"){

              history.push('/groups');

            }else{

              Swal.fire(
                'ไม่สามารถแก้ไขข้อมูลได้',
                '',
                'error'
              )
            }
            

              
          })
          .catch(function (response) {
              //handle error
              console.log(response)
          });
        
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
    console.log(val);
  }
  return (
    <Layout>
      <Card className="col-lg-8 col-xl-6">
        {

          <div>
              {
                loads != false ? 

                <Form
                form={form}
                layout="vertical"
                name="nest-messages"
                onFinish={onFinish}
                validateMessages={validateMessages}
                initialValues={{
                  id: edits[0].id,
                  name: edits[0].name,
               }}
              >
                <Form.Item
                  name={'name'}
                  label="Group Name"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                 <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Submit
              </Button>
                </Form.Item>
              </Form>


                :""
              }



          </div>


        }
        
        
      </Card>
    </Layout>
  );
}



export default EditGroup;
