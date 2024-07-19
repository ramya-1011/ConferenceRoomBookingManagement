        
import React, { useEffect, useState } from 'react'; 
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';  
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import LocationServices from '../../Service/LocationService';
import SiteServices from '../../Service/SiteService';
import FloorServices from '../../Service/FloorService'; 
import {Container,Row,Col,Card,Button, CardBody} from 'react-bootstrap';
 
 
const AddFloor = () => {
    const initialFloorData ={
         
        siteId: "",
        floorId: "",  
        cityId:"",
    };  
   
    const[errors, setErrors] = useState({
         
        siteId: "",
        floorId: "",  
        cityId:"",
    },[]);
 const navigate=useNavigate();
    const[currentData, setCurrentData] = useState(initialFloorData);
    const[viewCityData, setViewCityData] = useState([]);
 
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
   
    const[viewSiteData, setViewSiteData] = useState([]);
 
    const getSiteByCityId = () =>{
        
        SiteServices.sitesInLocation(currentData.cityId).then((response) =>{
            setViewSiteData(response.data)
        }).catch((error) => {
            console.log("error", error);
        })
    }
    useEffect(()=>{
        getSiteByCityId();
    }, [currentData?.cityId]);
 
 
 
    const handleInputChange = (event) => {
        const{name, value} = event.target;
        setCurrentData({...currentData,[name]:value});
        switch (name) {
            case 'floorId':
              setErrors({ ...errors, floorId: validateFloorId(value) });
              break;
             
            case 'siteId':
              setErrors({ ...errors,  siteId: validateSiteId(value) });
              break;
            
            case 'cityId':
              setErrors({ ...errors, cityId: validateCityId(value) });
              break;
            
            default:
              break;
        };
    };
 
     
      const  validateFloorId = (floorId) => {
        if (!floorId) {
          return 'Floor Id is required';
        } else if (!/^[a-zA-Z0-9\s-]+$/.test(floorId)) {
          return 'floorId can only contain letters and numbers';
        }
        return '';
      };
      
 
      const validateCityId = (cityId) => {
        if (!cityId) {
          return 'Select City !';
        }
        return '';
      };
 
      const validateSiteId = (siteId) => {
        if (!siteId) {
          return 'Select Site!';
        }
        return '';
      };
 
    const addFloor = (event) =>{
        event.preventDefault();
        const {  floorId,siteId, cityId  } = currentData;
        const newErrors = {};
   
        newErrors.floorId= validateFloorId(floorId);
         
        newErrors.cityId = validateCityId(cityId);
    newErrors.siteId = validateSiteId(siteId);
       
       
   
        setErrors(newErrors);
        if (Object.values(newErrors).every(error => error === '')) {
            console.log(' floor added successfully:', currentData);
             FloorServices.addFloor(currentData).then((response)=>{
                toast.success("Floor added successfully!");
                
                if(response.status === 200){
                    setCurrentData(initialFloorData);
                    console.log(response.data);
                    navigate('/FloorsList')
                }
            }).catch((error)=>{
                console.log("error", error)
                toast.error(error.response.data);
            })
        } else {
            console.log('Form has errors. Please correct them.');
        }
    }
 
  return ( 
<Container className='mt-5'>
<Row className='justify-content-center'>
    <Col md={6}>
         <Card>
          <Card.Body>
             
                <h2 className='text-center' style={{ fontWeight: 'bold' }}>ADD FLOOR</h2>
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
                        <Form.Label>Site:</Form.Label>
                        <Form.Control as='select' value={currentData.siteId} onChange={handleInputChange} name='siteId'>
                            <option>--Select Site--</option>
                            {viewSiteData.map((item) => (
                                <option key={item.id} value={item.id}>{item.siteId}</option>
                            ))}
                        </Form.Control>
                        {errors.siteId && <span style={{ display: "flex", color: "red" }}>{errors.siteId}</span>}
                    </Form.Group>

                    <Form.Group className='mb-3'>
                        <Form.Label>Floor Id</Form.Label>
                        <Form.Control
                            type='text'
                            name='floorId'
                            value={currentData.floorId}
                            onChange={handleInputChange}
                            maxLength={10}
                            placeholder='Enter floor ID'
                        />
                        {errors.floorId && <span style={{ display: "flex", color: "red" }}>{errors.floorId}</span>}
                    </Form.Group>
                    

                  

                    <Button variant='success' onClick={addFloor}>Save</Button>{' '}
                    <Link to='/FloorsList'>
                        <Button variant='danger'>Cancel</Button>
                    </Link>
                </Form>
                </Card.Body>
         </Card>
           
        
    </Col>
</Row>
<ToastContainer />
</Container>
  )
}
 
export default AddFloor;