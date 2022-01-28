import React, { Component, createRef } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Form, Input, Button, Table, Space } from 'antd';
import Swal from "sweetalert2";
import axios from 'axios';
import Layout from '../../containers/Layout';
import { Card } from '../../commons';
import { group } from '../../mock/data';

class GroupsComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {lists : []};
    this.formRef = createRef();
   
    

  }

  componentDidMount() {

      this.loaddata();
      

  }

  loaddata = async () => {

    const res = await fetch(`https://zio666.com/endpoint_content/load_group.php`)
    const data = await res.json()

    return this.setState({ lists: data })
     
  }

  onFinish = (values) => {

    

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be add this group!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {

       // console.log("Add Group", values);
        let formDatas = new FormData();
        formDatas.append("name", values.name);
        axios({
          method: 'post',
          url: 'https://zio666.com/endpoint_content/insert_group.php',
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

                                 location.reload();
                                  //history.push('/groups');
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

  onReset = () => {
    this.formRef.current.resetFields();
  };

  onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  }

  deleteContent = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to delete this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
       
                let formDatas = new FormData();
                formDatas.append("ids", id); 
                axios({
                method: 'post',
                url: 'https://zio666.com/endpoint_content/delete_group.php',
                data:formDatas,
                //dataType:'json',
                config: { headers: {'Content-Type': 'multipart/form-data' }}
                })
                .then(function (response) {
                  //console.log(response)
                  if(response.data === "ok"){

                      
                      Swal.fire({
                        title: 'ลบข้อมูลเรียบร้อย',
                        text: "",
                        icon: 'success',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Close'
                      }).then((results) => {
                        if (results.isConfirmed) {
                              location.reload();
                        }
                      })

                  }else{

                    Swal.fire(
                      'ไม่สามารถลบข้อมูลได้',
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

  render() {

    console.log(group)
    console.log(this.state)
    const columns = [
      {
        title: 'No',
        dataIndex: 'id',
        sorter: (a, b) => a.id - b.id,
        sortDirections: ['descend'],
        defaultSortOrder: 'ascend',
      },
      {
        title: 'Group',
        dataIndex: 'name',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.name.length - b.name.length,
      },
      {
        title: 'Domains',
        dataIndex: 'count',
      },
      {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        render: (text, record) => (
          <Space size="small">
            <Link
              to={`/groups/${record.id}`}
              className="ant-btn"
            >
              Edit
            </Link>
           
            {
                 record.count == 0 ?
                <Button type="primary" onClick={() => this.deleteContent(record.id)} danger>Delete</Button>
                :<Button type="primary" disabled={true} onClick={() => this.deleteContent(record.id)} danger>Delete</Button>
            }
            
          </Space>
        ),
      },
    ];
    return (
      <Layout>
        <div className="boards-list">
          {/* layout */}
          <Card className="col-12 col-xl-12 mb-3">
            <Form
              form={this.props.form}
              ref={this.formRef}
              name="control-hooks"
              onFinish={this.onFinish}
            >
              <Form.Item
                name="name"
                label=""
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input placeholder="Group Name" />
              </Form.Item>
              <Form.Item className="text-right">
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
                <Button className="ml-1" htmlType="button" onClick={this.onReset}>
                  Reset
                </Button>
              </Form.Item>
            </Form>
          </Card>
          <Card>
            <div className="table-responsive">
              <Table
                rowKey={record => record.id}
                columns={columns}
                dataSource={this.state != null ? this.state.lists : group}
                onChange={this.onChange}
                pagination={{
                  hideOnSinglePage: true,
                  defaultPageSize: 5,
                  showSizeChanger: group.length <= 5 ? false : true,
                }}
              />
            </div>
          </Card>
        </div>
      </Layout>
    );
  }
}

export default withRouter(GroupsComponent);