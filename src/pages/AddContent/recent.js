import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Row, Col, Table, Button, Menu, Dropdown, Tag } from 'antd';
import Swal from 'sweetalert2';
import axios from 'axios';
import Moment from 'moment';
import {
  FileTextOutlined,
  DownOutlined,
  GlobalOutlined,
  TeamOutlined,
  UserDeleteOutlined,
  UserOutlined,
  GoldOutlined,
  SnippetsOutlined
} from '@ant-design/icons';

import { contentsrecent } from '../../mock/data';


function Recent({defs , dels}) {


	console.log(defs)
	const [theArray, setTheArray] = useState([]);
	const [loads, setloads] = useState(false);

	useEffect(() => {

		const fetchdata = async () => {
	
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
		 let listobj = {
				  "data":ndata
		  }
	   
		 
	
	
		  setTheArray(listobj)
		  setloads(true)
		
		  
		   
	  
		}
	
		fetchdata();
	
	  },[setTheArray])

	 
	
	const menu = (record) => {
		return (
		  <Menu className="menu-dropdown-table">
			<Menu.Item key="0">
			  <Button onClick={() => defs.history.push(`/content/${record.id}`)}>
				Edit
			  </Button>
			</Menu.Item>
			<Menu.Item key="1">
			  <Button onClick={() => dels(record.id)}>
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

	
	const columns = [
		{
		  title: 'No',
		  dataIndex: 'id',
		  key: 'id',
		  sorter: (a, b) => a.id - b.id,
		  sortDirections: ['descend'],
		  defaultSortOrder: 'descend',
		},
		{
			title: 'Title',
			dataIndex: 'title',
			key: 'title',
		},
		{
			title: 'Url',
			dataIndex: 'website',
			// defaultSortOrder: 'descend',
			// sorter: (a, b) => a.website.length - b.website.length,
			render: (website) => (
			  <div>
				{ /* <a href="#" className="lowercase" dangerouslySetInnerHTML={{ __html: website }} />  */} 
				<a href={`${website}`} target="_blank" className="lowercase" dangerouslySetInnerHTML={{ __html: website }} />
			  </div>
			),
		},
		{
		  title: 'Group',
		  dataIndex: 'group',
		},
		{
			title: 'Status',
			dataIndex: 'status',
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
			  <Dropdown overlay={menu(record)} trigger={['click']}>
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
		<div id="recent-post">
	    	<h2 className="recent-post-title">Last Post</h2>
			{/*console.log(theArray)*/}
			
			<Table 
				pagination={{
					hideOnSinglePage: true,
					position: "bottomCenter",
					showSizeChanger: true,
					pageSizeOptions: ["10", "20", "50", "100", "200"]
				  }}
				rowKey={record => record.id}
				columns={columns} 
				dataSource={loads != false ? theArray.data : contentsrecent} 
				
			/>
			
			<p className="mt-3"><Button href="/content" type="primary" shape="round"  size={20} > Load More ... (เพิ่มที่ละ  5) </Button></p>
		</div>
	);
    
}
	
	
export default Recent;
