import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Tag,
  Select,
  Button,
  Upload,
  message,
  Avatar,
  DatePicker,
  Row,
  Col,
} from 'antd';
import axios from 'axios';
import moment from 'moment';
import Swal from "sweetalert2";
import { useHistory } from 'react-router-dom';
import { LoadingOutlined, PlusOutlined, CloudDownloadOutlined } from '@ant-design/icons';

import Layout from '../../containers/Layout';
import { Card, SelectMultiple } from '../../commons';
import { Editor } from '../../components';
import { posts, group }  from '../../mock/data';

const { Option } = Select;

/* eslint-disable no-template-curly-in-string */
const normFile = (e) => {
console.log("normFile")

  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};
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
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 10;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

/* eslint-enable no-template-curly-in-string */

const EditContent = (props) => {
  let history = useHistory();
  const [form] = Form.useForm();
  const [data, setData] = useState(posts[0])
  const [toDo, onToDo] = useState([]); // ดึง data website ทั้งหมด 
  const [toDoDataUser, onToDoDataUser] = useState([]); // ดึง data website ที่เลือก
  const [imageUrl, setImageUrl] = useState(null);
  const [editor, setEditor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(false);
  const [param, setparam] = useState(props.match.params.slug);
  const [options, setoptions] = useState([]);
  const [edits, setedits] = useState([]);
  const [lds, setlds] = useState(false);
  const [ndate, setndate] = useState(null);
  const [wptags, setWptags] = useState([]);
  const [featureimg, setfeatureimg] = useState(null);
  const [locate , setLocate] = useState("");
  const [imglocate , setImglocate] = useState(false);
  const [statusno , setStatusno] = useState(false);
  const [categories, setcategories] = useState([]);
  var imgc = "";

  function ResizeImage (files, uploadHandler) {
    const uploadFile = files[0];
    var nfile = "";
    const img = document.createElement('img');
    
    //img.setAttribute("id", "img12");
    const canvas = document.createElement('canvas');
    const reader = new FileReader();
  
    reader.onload = function (e) {

        img.src = e.target.result;
       
        img.onload = function () {

            //img.setAttribute("id","img1");
            let ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
  
            const MAX_WIDTH = 600;
            const MAX_HEIGHT = 300;
            let width = img.width;
            let height = img.height;
  
            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }
  
            canvas.width = width;
            canvas.height = height;
  
            ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);
  
            //console.log(e.target.result)
            //console.log(uploadFile)

           canvas.toBlob(function (blob) {
                uploadHandler([new File([blob], uploadFile.name)])
            }, uploadFile.type, 1);
  
             }
      
       
           }

            let formDatas = new FormData();
   
            
            formDatas.append("fileimg", uploadFile); 
           

            axios({
              method: 'post',
              url: 'https://zio666.com/endpoint_content/upload_img_content.php',
              data: formDatas,
              //dataType:'json',
              config: { headers: {'Content-Type': 'multipart/form-data' }}
              })
              .then(function (response) {

                  var newimg  = "";
                
                  newimg = "https://zio666.com/endpoint_content/"+response.data;

                  imgc = newimg;
              

                 setTimeout(function(){
                   
                  reader.readAsDataURL(uploadFile);
                
                }, 1500);
              })
              .catch(function (response) {
                  //handle error
                  console.log(response)
              });
      
  
  }
  
  const loaddata = async () => {

    const res = await fetch(`https://zio666.com/endpoint_content/load_tags.php`)
    const data = await res.json()

    let obj = [];

    for(var i = 0; i < data.length; i++){

       obj.push({id:data[i].id , value:data[i].name});

   }

    return setoptions(obj);

     
  }
  const fetchedit = async () => {

    const res = await fetch(`https://zio666.com/endpoint_content/edit_content.php?id=${param}`)
    const data = await res.json()
    
    let obj = [];

    let tags = data.p_tags.split(",");
  
    let websites = data.p_website.split("_");

    //let nndate  = data.publish_date.split("-");

    let fea_img  = data.p_feature_image;

    //let renewdate = nndate[2]+"/"+nndate[1] +"/"+nndate[0];

    //console.log(renewdate)
    setndate(data.publish_date)
    setWptags(tags)
    setImageUrl(fea_img)

    obj.push({id:parseInt(websites[0]) , label :websites[1],disabled:true});

    onToDoDataUser(obj);

    setedits(data)

    setlds(true)

    //console.log(toDo);
    
    
    
  }

  const chkfor_dissable =  (value) => {

      if(lds !== false ){

          console.log(toDo)


      }


    
  }

  const fetchdomain = async () => {

    const res = await fetch(`https://zio666.com/endpoint_content/load_domain.php`)
    const data = await res.json()
    let obj = [];
    
    for(var i =0; i < data.length; i++){

      obj.push({id:parseInt(data[i].id),value:data[i].title})

    }

    onToDo(obj);

   
    
  }

  const clkadd = () => {
   
    Swal.fire({
      title: 'เพิ่ม Tags',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'OK',
      showLoaderOnConfirm: true,
      allowOutsideClick:false,
      preConfirm: (values) => {

        if(values.length > 0)
        {

          let formDatas = new FormData();

          formDatas.append("name", values);
          
          axios({
            method: 'post',
            url: 'https://zio666.com/endpoint_content/insert_tags.php',
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
                                        allowOutsideClick:false,
                                        confirmButtonColor: '#3085d6',
                                        cancelButtonColor: '#d33',
                                        confirmButtonText: 'Close'
                                      }).then((results) => {
                                        if (results.isConfirmed) {
  

                                              setTimeout(function(){ loaddata(); }, 200);

                                               
                                              //history.push('/groups');

                                              //setloadsop(true);
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
                  'กรุณากรอกข้อมูล',
                  '',
                  'error'
                )

        }
         //handleChange(list);
          //setoptions();
          
          //setTheArray(list);


          // console.log(theArray)
     },
     
    }).then((result) => {
      if (result.isConfirmed) {
        
              console.log("in");


      }
    })


  }

  useEffect(() => {
    axios.get("https://zio666.com/endpoint_content/load_tags.php").then(resp => {
      setoptions(state => {

        return resp.data.map(({ id, name }) => ({ id, value: name }));
        
      });
    });
  }, [setoptions]);

  useEffect(() => {
    
      fetchedit();

  }, [setedits]);

  useEffect(() => {
    axios.get("https://zio666.com/endpoint_content/load_webiste.php").then(resp => {
      onToDo(state => {
         //console.log(toDoDataUser);

        return resp.data.map(({ id, title }) => ({ id, label: title ,disabled:true }));


      });
    });
  }, [onToDo]);

  useEffect(() => {
    axios.get("https://zio666.com/endpoint_content/load_category.php").then(resp => {
      setcategories(state => {

        return resp.data.map(({ id, name }) => ({ id, name: name }));
        
      });
    });
  }, [setcategories]);

  

  const handleChangePhoto = async (info) => {

    
    if (info.file.status === 'uploading') {
      let formData = new FormData();
      let req = new XMLHttpRequest();
      req.onreadystatechange = function() {
        if (req.readyState == XMLHttpRequest.DONE) {
                setLocate(req.responseText);
                setImageUrl(req.responseText);
                setImglocate(true);
                setStatusno(true);
        }
      }
      formData.append("fileimg", info.file.originFileObj); 
      req.open("POST", 'https://zio666.com/endpoint_content/upload_image.php');
      req.send(formData);
     
      setLoading(true)
      return;
    }
    if (info.file.status === 'done') {
      await getBase64(info.file.originFileObj, (avartar) => {


           setImageUrl(avartar);
     });
    }
  };

  const onPreview = async (file) => {
    
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  const onFinish = (values) => {


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


        if(statusno !== true || imglocate !== false){


          var strweb  = "";
          var newstrweb;
  
                if(values.website.length > 0){
        
                  for(var i = 0; i < values.website.length; i++){
        
                        strweb +=  values.website[i].id +"_"+ values.website[i].label+","
        
                  }
        
        
                  newstrweb = strweb.slice(0, -1);
        
                }
        
        
                var tagss = "";
                var lasttags;
        
                if(values.wptag.length > 0){
        
                      for(var i = 0; i < values.wptag.length; i++){
        
                        tagss +=  values.wptag[i] +","
        
                      }
        
                      lasttags = tagss.slice(0, -1);
        
                }

                //console.log(values);
                console.log(editor);

                let formData = new FormData();
                formData.append('id', param)
                formData.append('p_title', values.post_title)
                formData.append('p_content', editor)
                formData.append('p_website', newstrweb)
                formData.append('p_categories', values.categories)
                formData.append('p_tags', lasttags)
                formData.append('p_feature_image',imageUrl)
                formData.append('publishDate',ndate)


                axios({
                  method: 'post',
                  url: 'https://zio666.com/endpoint_content/update_content.php',
                  data: formData,
                  config: { headers: {'Content-Type': 'multipart/form-data' }}
                  })
                  .then(function (response) {
                      //handle success
                      console.log(response)
                      if(response.data.code == 1){
      
                       
                           
                            Swal.fire({
                              title: 'แก้ไขข้อมูลเรียบร้อบ',
                              text: "",
                              icon: 'success',
                              showCancelButton: false,
                              confirmButtonColor: '#3085d6',
                              cancelButtonColor: '#d33',
                              confirmButtonText: 'OK'
                            }).then((resultss) => {
                              if (resultss.isConfirmed) {
      
                                      location.reload();
      
                              }
                            })
      
                      }
                      else if(response.data.code == 3){
      
                       
                        Swal.fire({
                          title: 'แก้ไขข้อมูลเรียบร้อบ',
                          text: "",
                          icon: 'success',
                          showCancelButton: false,
                          confirmButtonColor: '#3085d6',
                          cancelButtonColor: '#d33',
                          confirmButtonText: 'OK'
                        }).then((resultss) => {
                          if (resultss.isConfirmed) {
      
                                  location.reload();
      
                          }
                        })
      
                      }
                      else{
      
                              Swal.fire(
                                'ไม่สามารถเพิ่มข้อมูลได้',
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

        


      }
    });
    
    // form.resetFields();
    
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

  const tagRender = (props) => {
    const { label, value, closable, onClose } = props;
    return (
      <Tag color={value} closable={closable} onClose={onClose} style={{ marginRight: 3  , color:"black"}}>
        {label}
      </Tag>
    );
  }
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
 

  const disabledDate = (current) => {
    // Can not select days before today and today
    const start = new Date();
    return current && current < start.setDate(start.getDate() - 1);
  }

  const dummyRequest = ({ file, onSuccess }) => {
    
    setTimeout(() => {
      console.log(file);
      onSuccess('ok');
    }, 0);
  };

  const handleChangeEditor = (content) => setEditor(content);

  const onChangeSelectMultiple = (val) => onToDoDataUser(val);

  const onChangeDatePicker = (date, dateString) => {
     console.log("date", date);
    setDate(dateString);
  };

  const handleImageUpload = (targetImgElement, index, state, imageInfo, remainingFilesCount) => {
   
      //console.log(imageInfo.src.indexOf("55555555"))
      //console.log("handleImageUpload");

    // console.log(imgc)

     if(imageInfo !== null){


          if(imageInfo.src.indexOf("zio666.com/endpoint_content") === -1){

            //setTimeout(function(){
      
              if(imageInfo.src !== ""){
      
                imageInfo.src = imgc;
                targetImgElement.src = imgc;
      
              }
                        
              //console.log(editor)
              
            
              //console.log(targetImgElement);
              console.log(imageInfo);
                  
            //}, 500);
      
          }


     }
      
     
     
  
 };

 const handleImageUploadBefore = (files, info , uploadHandler) => {
  //console.log(uploadHandler)
  //console.log("handleImageUploadBefore");
      try {

        ResizeImage(files, uploadHandler)
        

    } catch (err) {
        uploadHandler(err.toString())
    }

};

  return (
    <Layout>
      <Card>
       
        {

          lds !== false ?

          <Form
          form={form}
          layout="vertical"
          name="nest-messages"
          onFinish={onFinish}
          validateMessages={validateMessages}
          initialValues={{ 
            post_title: edits.p_title,
            post_content: edits.p_content,
            categories: edits.p_categories,
            website: toDoDataUser,
            wptag:wptags,
            publishDate:moment(ndate, 'YYYY-MM-DD'),
           }}
        >
          {/*console.log(options)toDoDataUser*/
          
          //console.log(toDo)

          }
        <Row gutter={[16, 16]} className="mb-4">
          <Col xs={24} sm={12} md={16} lg={16} xl={16}>
              <Form.Item
                name={'post_title'}
                label="Title"
                rules={[
                  {
                    required: true,
                    message: 'Please enter title',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Content"
                name='post_content'
                rules={[
                  {
                    required: true,
                    message: 'Please enter content of post',
                  },
                ]}
              >
                <Editor
                  onChange={handleChangeEditor}
                  ImageUpload = {handleImageUpload}
                  ImageUploadBefore = {handleImageUploadBefore}
                  initialContent={edits.p_content}
                  placeholder={"Write something or insert a heart ♥"}
                />
              </Form.Item>
              <Form.Item
                name={'website'}
                label="Website"
                rules={[
                  {
                    required: true,
                    message: 'Please select website',
                  },
                ]}
                
              >


                <SelectMultiple
                  dataBase={toDoDataUser}
                  toDos={toDo}
                  onChange={onChangeSelectMultiple}
                  onSelected={onToDoDataUser}
                  
                  
                  
                />
              </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <Form.Item
                name={'categories'}
                label="Categories"
              >
                <Select
                  showSearch
                  placeholder="Select a categories"
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
                    categories.map((item) => (
                      <Option value={item.name} key={item.id}>{item.name}</Option>
                    ))
                  }
                </Select>
              </Form.Item>
              <Form.Item
                name={'publishDate'}
                label="Publish Date"
                rules={[
                  {
                    required: true,
                    message: 'Please select date',
                  },
                ]}
              >
                <DatePicker
                  allowClear={false}
                  style={{ width: '100%' }}
                  showToday={false}
                  format={["DD/MM/YYYY"]}
                  // dateFormat="dd MMM yyyy"
                  disabledDate={disabledDate}
                  minDate={new Date()}
                  onChange={onChangeDatePicker}
                  
                 
                 
                />
              </Form.Item>
            
              <Form.Item
                name={'wptag'}
                label="Tag"
                rules={[
                  {
                    required: true,
                  },
                ]}
                
              >
                <Select
                  mode="multiple"
                  showArrow
                  tagRender={tagRender}
                  style={{ width: '100%'}}
                  options={options}
                />
              </Form.Item>
              <Form.Item>
              <Button onClick={clkadd}>
                     เพิ่ม Tag
              </Button>
              </Form.Item>
              <Form.Item
                name={'feature_image'}
                label="Feature image"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                extra="อัพโหลดรูปภาพขนาดไม่เกิน 5 MB เท่านั้น"
               
              >
                <Upload
                  accept=".jpg, .jpeg, .png"
                  name="feature_image"
                  customRequest={dummyRequest}
                  listType="picture-card"
                  multiple={false}
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  onChange={handleChangePhoto}
                  onPreview={onPreview}
                // disabled={disableInput}
                >
                  {imageUrl !== '' ? (
                    <Avatar className="w-100" size={248} shape="square" src={`https://zio666.com/endpoint_content/${imageUrl}`} />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </Form.Item>
              <Form.Item>
                <Button type="primary" size="large" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>

          : <div><center style={{color: "white"}}><h1>Loading ........</h1></center></div>



        }
        
      </Card>
    </Layout>
  );
}

export default EditContent;
