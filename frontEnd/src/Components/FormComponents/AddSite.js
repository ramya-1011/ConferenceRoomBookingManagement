import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import Form from 'react-bootstrap/Form'; 
import SiteServices from '../../Service/SiteService';
import LocationServices from '../../Service/LocationService';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";  
import {Container,Row,Col,Card,Button, CardBody} from 'react-bootstrap';


 
const AddSite = () => {
    const initialSiteData ={
         
        siteId: "",
        description: "",
        pinCode: "",
        
        cityId:"",
        
    };
    const [errors,setErrors]=useState({
      siteId: "",
      description: "",
      pinCode: "",
      
      cityId:"",
    },[]);
    const navigate= useNavigate();

    const[currentData, setCurrentData] = useState(initialSiteData);
    const handleInputChange = (e) => {
      const{name, value} = e.target;
    setCurrentData({...currentData,[name]:value});
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
  }
   
  const  validateSiteId = (name) => {
    if (!name) {
      return 'Site Id is required';
    } else if (!/^[a-zA-Z0-9\s-]+$/.test(name)) {
      return 'SiteId can only contain letters and numbers';
    }
    return '';
  };
  // const validateDescription = (description) => {
  //   if (!description) {
  //     return 'Description is required';
  //   } else if (!/^[a-zA-Z0-9\s-]+$/.test(description)) {
  //     return 'Description can only contain letters, numbers and hyphens';
  //   }
  //   return '';
  // };
  const validateDescription = (description) => {
    if (!description) {
        return 'Description is required';
    } else if (!/^[a-zA-Z0-9\s-]+$/.test(description)) {
        return 'Description can only contain letters, numbers, spaces, and hyphens';
    } else if (/^\s/.test(description)) {
        return 'Description cannot start with a space';
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
   
     
    
    const[viewCityData, setViewCityData] = useState([]);
 
 
    
    const validateInputs = () => {
        const { siteId, description, pinCode,  cityId } = currentData;
        if (!siteId || !description || !pinCode  || !cityId) {
            toast.error("All fields are required!");
            return false;
        }}
    

    const postSite = (event) =>{
        
        event.preventDefault();
        const {siteId,description,pinCode,cityId } = currentData;
        const newErrors = {};
        newErrors.siteId=validateSiteId(siteId);
        newErrors.description=validateDescription(description); 
        newErrors.pinCode=validatePinCode(pinCode);
        newErrors.cityId=validateCityId(cityId);
        setErrors(newErrors);
        
        if (Object.values(newErrors).every(error => error === '')) {
            console.log(' details successfully:', currentData);
            SiteServices.addSite(currentData).then((response)=>{
                toast.success("Site is added successfully!");
                if(response.status === 200){
                    setCurrentData(initialSiteData);
                    console.log(response.data);
                    navigate('/SiteList')
                }
            }).catch((error)=>{
                console.log("error", error)
                toast.error(error.response.data);
            })
        } else {
            console.log('deatils are not valid ,Please correct them.');
        }
    }
        
 
 
    const getCities = () =>{
        LocationServices.loadLocations().then((response) =>{
          setViewCityData(response.data)
        }).catch((error) =>{
          console.log("error",error);
        })
    }
 
    useEffect(()=>{
        getCities();
    }, []);
 
   
  return (
 
<Container className='mt-5'>
<Row className='justify-content-center'>
    <Col md={6}>
         <Card>
          <Card.Body>
             
                <h2 className='text-center' style={{ fontWeight: 'bold' }}>ADD SITE</h2>
                <Form>
                    <Form.Group className='mb-3'>
                        <Form.Label>City:</Form.Label>
                        <Form.Control as='select' value={currentData.cityId} onChange={handleInputChange} name='cityId'>
                            <option>--Select City--</option>
                            {viewCityData.map((item) => (
                                <option key={item.id} value={item.id}>{item.name}</option>
                            ))}
                        </Form.Control>
                        {errors.cityId && <span style={{ display: "flex", color: "red" }}>{errors.cityId}</span>}
                    </Form.Group>

                    <Form.Group className='mb-3'>
                        <Form.Label>Site ID:</Form.Label>
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
                        <Form.Label>Description:</Form.Label>
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
                        <Form.Label  >Pin Code:</Form.Label>
                         

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
                   
                            <div style={{ display: 'flex', justifyContent: 'center' }}> 
                    <Button variant='success' onClick={postSite} style={{ marginRight: '10px' }}>Save</Button>{' '}
                    <Link to='/siteList'>
                        <Button variant='danger'>Cancel</Button>
                    </Link>
                    </div>
                </Form>
                </Card.Body>
         </Card>
           
        
    </Col>
</Row>
<ToastContainer />
</Container>
  )
}

export default AddSite;
