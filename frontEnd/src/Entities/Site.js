 
import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom"; 
import Modal from "react-bootstrap/Modal"; 
import Form from "react-bootstrap/Form"; 
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton"; 
import SiteServices from "../Service/SiteService";
import LocationServices from "../Service/LocationService"; 
import Pagination from '@mui/material/Pagination'; 
import {Container,Row,Col,Card,Button, CardBody} from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { BsBuildingFillAdd } from "react-icons/bs";
 
export default function Site() {
  const initialSiteData = {
      
    siteId: "",
    description: "",
    pinCode: "",
     
    cityId:"",
    
  }; 
   
  const [currentData, setCurrentData] = useState(initialSiteData);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [show, setShow] = useState(false);
  const [viewCityData, setViewCityData] = useState([]);
  // const[records,setRecords]=useState([])
  // const[searchQuery,setSearchQuery]=useState('');


  const handleChange = (event, value) => {
    setOffset(value);
};
 

const [pageSize] = useState(5);
const [offset, setOffset] = useState(1);

const [count, setCount] = useState(0);
const getRequestParams = ( offset ,pageSize) => {
    let params = {}; 
    if (offset) {
      params["offset"] = offset - 1;
    }
    if (pageSize) {
      params["pageSize"] = pageSize;
    }
    return params;
};

 
const [sites, setSites] = useState([]);

useEffect(() => {
  loadSite();
  
}, [offset, pageSize]);
const loadSite = async()=>{
    const params = getRequestParams( 
        offset,
        pageSize
    );
    const result = await SiteServices.sitesUsingPagination(params);
    const{ totalPages,content} = result.data.response;
    console.log("content:",result.data.response.content)
    if(content === 0 || content === undefined){
        setSites([]);
    }else{
        setSites(content);
      //  console.log("site:",sites.response);
    }
    setCount(totalPages); 
}
  
  const deleteSite = async (id) => {
    if(window.confirm("Are you sure you want to delete this Site?")){
    const result = await SiteServices.deleteSite(id);
    toast.success("site deleted successfully")
    loadSite();
    }
  };
  const[errors, setErrors] = useState({
    siteId: "",
        description: "",
        pinCode: "", 
        cityId:"", 
},[]); 
 
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "cityId") {
      const selectedCity = viewCityData.find(
        (city) => city.id === parseInt(value)
      );
      setCurrentData({ ...currentData, city: selectedCity });
    } else {
      setCurrentData({ ...currentData, [name]: value });
    } 
    switch (name) {
      case 'siteId':
      setErrors({...errors,siteId:validateSiteId(value)});
      break;
      case 'description':
      setErrors({...errors,description:validateDescription(value)});
      break;
      case 'pinCode':
      setErrors({...errors,pinCode:validatePinCode(value)});
    break;
    
      case'cityId':
      setErrors({...errors,cityId:validateCityId(value)});
      break;
  default:
    break;
  
  };
  };
  const  validateSiteId = (name) => {
    if (!name) {
      return 'Site Id is required';
    } else if (!/^[a-zA-Z0-9\s-]+$/.test(name)) {
      return 'SiteId can only contain letters and numbers';
    }
    return '';
  };
  const validateDescription = (description) => {
    if (!description) {
      return 'Description is required';
    } else if (!/^[a-zA-Z0-9\s-]+$/.test(description)) {
      return 'Description can only contain letters, numbers and hyphens';
    }
    return '';
  };
  
  const validatePinCode = (pinCode) => {
    if (!pinCode) {
        return 'Pincode is required';
    } else if (!/^\d+$/.test(pinCode)) {
        return 'Pincode can only contain digits';
    } else if (pinCode.length !== 6) {
        return 'Pincode must be 6 digits long';
    }
    return '';
};
 
const validateCityId = (cityId) => {
  if (!cityId) {
    return 'Select City!';
  }
  return '';
}; 
// useEffect(()=>{
//    getSite()
//   .then(res=> {setSites(res.data)
//              setRecords(res.data);
//           })
//   .catch(err=>console.log(err));
   
//  },[])
 
  const getSite = async (id) => {
    handleShow();
    const result = await  SiteServices.getSite(id);
    console.log("getSite:" ,result.data)
    setCurrentData(result.data);
  };
 
  const updateSite = (event) => {
    event.preventDefault();
    const {siteId,description,pinCode,cityId } = currentData;
    const newErrors = {};
    newErrors.siteId=validateSiteId(siteId);
    newErrors.description=validateDescription(description); 
    newErrors.pinCode=validatePinCode(pinCode);
  // newErrors.cityId=validateCityId(cityId);
    setErrors(newErrors);  

    if (Object.values(newErrors).every(error => error === '')) {
        console.log('Form submitted successfully:', currentData);
        const updatedData = { ...currentData, cityId: currentData.city?.id }; //... spread operator stores data
        SiteServices.updateSite(currentData.id,updatedData)
      .then((response) => {
        toast.success("Site details Updated successfully!!!");
        if (response.status === 200) {
          console.log(response.data);
          handleClose();
          loadSite();
         
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
    } else {
        console.log('Form has errors. Please correct them.');
    }
     
      
  };
 
  const getCities = () => {
    LocationServices.loadLocations()
      .then((response) => {
        setViewCityData(response.data);
        
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
 
  useEffect(() => {
    getCities();
  }, []);
 
 
  console.log(currentData, "hii");
  return (
    <div style={{ width: "80%", margin: "20px auto" }}>
      <h2 style={{ fontWeight: "bold" }}>Sites List</h2>
      
      <div className='button-container'>
      <Link to="/add-site">
            <Button  variant="primary">Add Site</Button>
          </Link>
          </div>
      <Table stripped bordered hover variant="light">
      {sites.length > 0 ? (
            <>
        <thead style={{ backgroundColor: "#1976d2", height: "40px", textAlign: "center",verticalAlign:"middle"}}>
          <th scope="row"  >
             Id
          </th>
          <th scope="row"  >
             Site Id
          </th>
          <th scope="row"  >
             Description
          </th>
          <th scope="row"  >
            PinCode
          </th>
           
          <th scope="row"  >
             location name
          </th>
           
          <th scope="row"  >
            Actions
          </th>
        </thead>
        <tbody>
          {sites.map((row,index) => (
            <tr key={row.id} style={{ textAlign: "center",verticalAlign:"middle" }}>
              <td   >
                {row.id}
              </td>
              <td component="th"  >
                {row.siteId}
              </td>
              <td component="th"  >
                {row.description}
              </td>
              <td component="th" >
                {row.pinCode}
              </td>
               
                 <td component="th"  >
                   {row.city?.name}
                     </td>
               
               
              <td>
                <IconButton
                  aria-label="edit"
                  size="large"
                  onClick={() => getSite(row.id)}
                  color="info"
                ><BsBuildingFillAdd />
                  
                </IconButton>
                <IconButton
                  aria-label="delete"
                  size="large"
                  onClick={() => deleteSite(row.id)}
                  color="error"
                >
                  <DeleteIcon fontSize="inherit" />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
        </>
        ):(
            <p style={{fontWeight: "bold",textAlign: "center"}}>No Sites Found</p>
          )}
        <div
          style={{
            display: "table-caption",
            width: "80%",
            margin: "20px auto",
          }}
        >
          
        </div>
      </Table>
      <Pagination count={count} page={offset} onChange={handleChange} />
         
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontWeight: "bold" }}>Edit Site</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Card>
          <Card.Body>
        <Form.Group className='mb-3'>
        <Form.Control as='select' value={currentData?.city?.id || ""} onChange={handleInputChange} name='cityId' title="select city">
                            <option>--Select City--</option>
                            {viewCityData.map((item) => (
                                <option key={item.id} value={item.id}>{item.name}</option>
                            ))}
                        </Form.Control>
                        {errors.cityId && <span style={{ display: "flex", color: "red" }}>{errors.cityId}</span>}
                    </Form.Group>
                    <Form.Group className='mb-3'> 
                        <Form.Control
                            type='text'
                            name='siteId' 
                            value={currentData.siteId}
                            onChange={handleInputChange}
                            maxLength={15}
                            placeholder='Enter Site ID'
                        />
                        {errors.siteId && <span style={{ display: "flex", color: "red" }}>{errors.siteId}</span>}
                    </Form.Group>
         
                    <Form.Group className='mb-3'> 
                        <Form.Control
                            type='text'
                            name='description'
                            value={currentData.description}
                            onChange={handleInputChange}
                            maxLength={20}
                            placeholder='Enter Description'
                        />
                        {errors.description && <span style={{ display: "flex", color: "red" }}>{errors.description}</span>}
                    </Form.Group>

                    <Form.Group className='mb-3'> 
                         

                        <Form.Control
                            type='text'
                            name='pinCode'
                            value={currentData.pinCode}
                            onChange={handleInputChange}
                            maxLength={6}
                            placeholder='Enter Pincode'
                        />
                        
                        {errors.pinCode && <span style={{ display: "flex", color: "red" }}>{errors.pinCode}</span>}
                    </Form.Group>
          </Card.Body>
          </Card>
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={updateSite}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer/>
    </div>   
  );
}