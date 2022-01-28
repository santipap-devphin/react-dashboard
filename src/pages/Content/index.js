import React, { Component , useState, useEffect } from 'react';
import axios from 'axios';
import { withRouter, Link } from 'react-router-dom';
import { Row, Col, Table, Button, Menu, Dropdown, Tag } from 'antd';
import Moment from 'moment';
import {
  DownOutlined,
  CaretUpOutlined,
  FilePptOutlined,
  FileAddOutlined,
  FileExcelOutlined,
  FileExclamationOutlined
} from '@ant-design/icons';
import Swal from "sweetalert2";
import Layout from '../../containers/Layout';
import { Card } from '../../commons';
import { CardBoard } from '../../components';
import { contents } from '../../mock/data';
import LineDemo from '../../mock/LineDemo';
import LineChart from '../../mock/Line';
import VerticalBar from '../../mock/VerticalBar';

class Content extends Component {
  constructor(props) {
    super(props);

    this.state = {lists: []};
    

  }
  componentDidMount() {
    this.loaddata();
  }

   loaddata = async () => {

    const res = await fetch(`https://zio666.com/endpoint_content/load_content.php`)
    const data = await res.json()

    let ndata = [];

		
		  for(var i = 0; i < data.length; i++){


			ndata.push(
                {
                  "body":data[i]["p_content"] ,
                  "category": data[i]["p_categories"] ,
                  "dateadd": data[i]["create"] ,
                  "domainStatus":data[i]["status"] ,
                  "group": data[i]["groups"] ,
                  "id": data[i]["content_id"],
                  "title": data[i]["p_title"] ,
				  "website": data[i]["url"] ,
				  "userId": "",
				  "status":data[i]["process"],
                }

              )


		  }
		 

    
    return this.setState({ lists: ndata })
     
  }
  
  handlePaggination = (start, length) => {
    console.log('params', start, length);
  };

   deleteContent = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "The system is working",
          allowEscapeKey: false,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });


        let formData = new FormData();
        
        formData.append('ids', id)
       
        axios({
          method: 'post',
          url: 'https://zio666.com/endpoint_content/delete_content.php',
          data: formData,
          config: { headers: {'Content-Type': 'multipart/form-data' }}
          })
          .then(function (response) {
              //handle success
              console.log(response)
              if(response.data.code == 1){

               
                   
                    Swal.fire({
                      title: 'ลบข้อมูลเรียบร้อย',
                      text: "",
                      icon: 'success',
                      showCancelButton: false,
                      confirmButtonColor: '#3085d6',
                      cancelButtonColor: '#d33',
                      confirmButtonText: 'OK'
                    }).then((result) => {
                      if (result.isConfirmed) {

                              location.reload();

                      }
                    })

              }
              else if(response.data.code == 3){

               
                Swal.fire({
                  title: 'ลบข้อมูลเรียบร้อย',
                  text: "",
                  icon: 'success',
                  showCancelButton: false,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'OK'
                }).then((result) => {
                  if (result.isConfirmed) {

                          location.reload();

                  }
                })

              }
              else{

                      Swal.fire(
                        'ไม่สามารถลบข้อมูลได้',
                        'กรุณาลองใหม่',
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

  
  
  menu = (record) => {
    return (
      <Menu className="menu-dropdown-table">
        <Menu.Item key="0">
          <Button onClick={() => this.props.history.push(`/content/${record.id}`)}>
            Edit
          </Button>
        </Menu.Item>
        <Menu.Item key="1">
          <Button onClick={() => this.deleteContent(record.id)}>
            Delete
          </Button>
        </Menu.Item>
        {/*<Menu.Item key="2">
          <Button onClick={() => console.log('View', record.id)}>View</Button>
        </Menu.Item>
        <Menu.Item key="3">
          <Button onClick={() => console.log('Repost', record.id)}>Repost</Button>
        </Menu.Item>
        <Menu.Item key="4">
          <Button onClick={() => console.log('Duplicate', record.id)}>Duplicate</Button>
      </Menu.Item>*/}
      </Menu>
    )
  }
  render() {

   

    /*const loadods = async () => {

      const res = await fetch(`https://zio666.com/endpoint_content/load_content.php`)
      const data = await res.json()
  
      
      return this.setState({ person: data })
       
    }*/

    
    //loadods();
   


   
   
   // console.log(this.loadods())

    /*const persons = this.state.person.map((item, i) => (
      <div>
        <h1>{ item.name.first }</h1>
        <span>{ item.cell }, { item.email }</span>
      </div>
    ));*/

    // const { frozen } = this.props;
    
    const columns = [
      {
        title: 'No',
        dataIndex: 'id',
        sorter: (a, b) => a.id - b.id,
        sortDirections: ['descend'],
        defaultSortOrder: 'descend',
      },
      {
        title: 'Title',
        dataIndex: 'title',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.title.length - b.title.length,
        render: (text, record) => (
          <span dangerouslySetInnerHTML={{ __html: record.title.substring(0, 50) }} />
        ),
      },
      {
        title: '',
        render(){
          return (
            <div className="ds-status ds-online">
              <span></span> online
            </div>
          )
        },
      },
      {
        title: 'Url',
        dataIndex: 'website',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.website.length - b.website.length,
        render: (website) => (
          <div>
              <a href={`${website}`} className="lowercase" dangerouslySetInnerHTML={{ __html: website }} target="_blank" />  
            {/*<a href="#" className="lowercase" dangerouslySetInnerHTML={{ __html: website }} /> */} 
            {/*<Link
              to={`${website.toLowerCase()}`}
              className="ml-1 lowercase"
              target="_blank"
            >{website}
            </Link>*/}
          </div>
        ),
      },
      {
        title: 'Group',
        dataIndex: 'group',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.group.length - b.group.length,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.status.length - b.status.length,
        render: status => {
          let color = status === 'success' ? 'success' : 'volcano';
          return (
            <Tag color={color}>
              {status.toUpperCase()}
            </Tag>
          )
        },
      },
      {
        title: 'Date',
        dataIndex: 'dateadd',
        // defaultSortOrder: 'descend',
        // sorter: (a, b) => a.status.length - b.status.length,
        render: dateadd => {
          let Dd = Moment(dateadd).format('LL');
          return (
            <span>
              {Dd}
            </span>
          )
        },
      },
      {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        render: (text, record) => (
          <Dropdown overlay={this.menu(record)} trigger={['click']}>
            <div
              className="ant-dropdown-link d-flex align-items-center cursor-pointer"
            >
              Actions <DownOutlined className="ml-2" />
            </div>
          </Dropdown>
        ),
      },
    ];
    return (
      <Layout
        hasBtn
        btnTitle="+ Add Content"
        btnOnClick={() => this.props.history.push('/content/add')}
      >
       
        
        <div className="boards-list">
          {/* layout 
          <Row gutter={[16, 16]} className="mb-4">
            <Col xs={24} sm={12} md={8} lg={8} xl={6}>
              <CardBoard
                wrapperClass="text-white bg-gradient-primary h-100"
                title="New Contents"
                value="23"
                icon={<FileAddOutlined style={{ fontSize: '32px' }} />}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={6}>
              <CardBoard
                wrapperClass="text-white bg-gradient-info h-100"
                title="Draw Contents"
                value="30"
                icon={<FileExclamationOutlined style={{ fontSize: '32px' }} />}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={6}>
              <CardBoard
                wrapperClass="text-white bg-success h-100"
                title="Public Contents"
                value="200"
                icon={<FilePptOutlined style={{ fontSize: '32px' }} />}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={6}>
              <CardBoard
                wrapperClass="text-white bg-gradient-danger h-100"
                title="Trash Contents"
                value="30"
                icon={<FileExclamationOutlined style={{ fontSize: '32px' }} />}
              />
            </Col>
          </Row>
          */}
          
          <Card>
            <Table
              rowKey={record => record.id}
              columns={columns}
              dataSource= {this.state != null ? this.state.lists : contents}
              onChange={this.handlePaggination}
              rowClassName = {record => "row-"+record.status}
              pagination={{
                defaultPageSize: 15,
                showSizeChanger: contents.length <= 10 ? false : true,
                showQuickJumper: true,
                // total: total,
                defaultCurrent: 1,
                onChange: (page, length) => {
                  console.log(page);
                  this.handlePaggination((page - 1) * length, length, "", page, length);
                },
                // showTotal: (total) => `Total ${total} items`,
                pageSizeOptions: ["10", "20", "30"],
                onShowSizeChange: (current, pageSize) => {
                  this.handlePaggination(0 * pageSize, pageSize, "", 1, pageSize);
                }
              }}
            />
          </Card>
        </div>
      </Layout>
    );
  }
}

// const mapStateToProps = (state) => {
//   return {
//     frozen: state.frozen,
//   };
// };

// const mapDispatchToProps = (dispatch) => {
//   return {
//     frozenActions: bindActionCreators(frozenActions, dispatch),
//   };
// };

// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Frozen));
/*Content.getInitialProps = async (ctx) => {

  const res = await fetch('https://zio666.com/endpoint_content/load_content.php')
  const data = await res.json()

  

  return {home: scores}
}*/


export default withRouter(Content);