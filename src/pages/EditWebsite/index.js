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

const EditWebsite = (props) => {

  //console.log(props.match.params.slug)
  let history = useHistory();
  const [form] = Form.useForm();
  const [data, setData] = useState(users[0]);
  const [param, setparam] = useState(props.match.params.slug);
  const [edits, setedits] = useState([]);
  const [loads, setloads] = useState(false);
  let status = ["online","offline"];
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


  const fetchedit = async () => {

    const res = await fetch(`https://zio666.com/endpoint_content/edit_domain.php?id=${param}`)
    const data = await res.json()

    setgrouss(data[0].groupid);
    setedits(data)
    
    setloads(true);
    
  }

  useEffect(() => {

    fetchedit();
    

    //console.log(form)
  
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

        //console.log(grouss)
        let formDatas = new FormData();
        formDatas.append("id", param); 
        formDatas.append("website", values.website); 
        formDatas.append("status", values.status); 
        formDatas.append("groups", values.group); 
        formDatas.append("groupsid", grouss); 

        axios({
          method: 'post',
          url: 'https://zio666.com/endpoint_content/update_domain.php',
          data:formDatas,
          //dataType:'json',
          config: { headers: {'Content-Type': 'multipart/form-data' }}
          })
          .then(function (response) {
            //console.log(response)
            if(response.data === "ok"){

              history.push('/website');

            }else{

              Swal.fire(
                'ไม่สามารถเพิ่มข้อมูลได้',
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

  const onChanges = (value ,event) => {

    //console.log(`selected ${value}`);
    //console.log(event);
    setgrouss(event.key);
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
                  website: edits[0].website,
                  status: edits[0].domainStatus,
                  group: edits[0].group
                }}
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
                  name={'status'}
                  label="Status"
                >
                  <Select
                    showSearch
                    style={{ width: '100%' }}
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
                    {
                      
                          status.map((vals ,keys) => (
                             
                              <Option value={vals} key={keys}>{vals}</Option>
                             
                          ))
                    }
                    
                  </Select>
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
                      Datas.map((item) => (
                        <Option value={item.label} key={item.id}>{item.label}</Option>
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


                :""
              }



          </div>


        }
        
        
      </Card>
    </Layout>
  );
}



export default EditWebsite;
