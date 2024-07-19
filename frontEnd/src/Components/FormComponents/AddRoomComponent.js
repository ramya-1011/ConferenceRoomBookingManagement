import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import Form from 'react-bootstrap/Form'; 
import SiteServices from '../../Service/SiteService';
import LocationServices from '../../Service/LocationService';
import FloorServices from '../../Service/FloorService';
import RoomServices from '../../Service/RoomService';
import {Container,Row,Col,Card,Button, CardBody} from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"; 
 
const AddRoom = () => {
    const initialRoomData ={
         
      type:"",
      description:"",
      capacity:"",  
    floorId:"", 
    siteId:"",
    cityId:"", 
         
    };
    const [errors,setErrors]=useState({
        type:"",
        description:"",
        capacity:"",  
      floorId:"", 
      siteId:"",
      cityId:"", 
         
      },[]);
    const navigate =useNavigate();
    const[currentData, setCurrentData] = useState(initialRoomData);
    const[viewCityData, setViewCityData] = useState([]);
    const[viewSiteData, setViewSiteData] = useState([]);
    const[viewFloorData, setViewFloorData] = useState([]);
 
 
     
    const handleInputChange = (e) => {
        const{name, value} = e.target;
      setCurrentData({...currentData,[name]:value});
      switch (name) {
          case 'siteId':
          setErrors({...errors,siteId:validateSiteId(value)});
          break;
          case 'capacity':
            setErrors({...errors,capacity:validateCapacity(value)});
            break;
          case 'description':
          setErrors({...errors,description:validateDescription(value)});
          break;
          case 'type':
          setErrors({...errors,type:validateType(value)});
        break;
        case 'floorId':
          setErrors({...errors, floorId:validateFloorId(value)});
          break;
          case'cityId':
          setErrors({...errors,cityId:validateCityId(value)});
          break;
      default:
        break;
      
      };
    }

    
    const validateCityId = (cityId) => {
        if (!cityId) {
          return 'Select City!';
        }
        return '';
      };
 
      const validateSiteId = (siteId) => {
        if (!siteId) {
          return 'Select Site!';
        }
        return '';
      };
      const validateFloorId = (floorId) => {
        if (!floorId) {
          return 'Select Floor!';
        }
        return '';
      };
      const  validateDescription = (description) => {
        if (!description) {
          return 'Description is required';
        } else if (!/^[a-zA-Z0-9\s-]+$/.test(description)) {
          return 'Description can only contain letters and numbers';
        }
        return '';
      };
      const validateType=(type)=>{
        if(!type){
          return "type name is required"
        }
        else if (!/^[a-zA-Z\s-]+$/.test(type)) {
          return 'Type can only contain alphabetic characters';
        }
        return '';
      }
      const validateCapacity= (capacity) => {
        if (! capacity) {
          return 'This feild is required';
        }else if(parseInt(capacity) <= 0){
            return ' Capacity must be greater than 0'
        }else if (!/^\d+$/.test(capacity)) {
            return 'Capacity can only contain digits';
          }
        return '';
      };
 
    const postRoom = (e) =>{
        e.preventDefault();
        const {  floorId, capacity,type,description,siteId, cityId  } = currentData;
        const newErrors = {};
   
        newErrors.floorId= validateFloorId(floorId);
        newErrors.capacity = validateCapacity( capacity);
       newErrors.type=validateType(type);
       newErrors.description=validateDescription(description);
        newErrors.cityId = validateCityId(cityId);
        newErrors.siteId = validateSiteId(siteId); 
   
        setErrors(newErrors);
        if (Object.values(newErrors).every(error => error === '')) {
            console.log(' floor added successfully:', currentData);
             RoomServices.addRoom(currentData).then((response)=>{
                toast.success("Room added successfully!");
                if(response.status === 200){
                    setCurrentData(initialRoomData);
                  //  console.log(response.data);
                    navigate('/RoomsList')
                }
            }).catch((error)=>{
                console.log("error", error)
                toast.error(error.response.data);
            })
        } else {
            console.log('Form has errors. Please correct them.');
        }
        
    }
 
    const getCities = () =>{
        LocationServices.loadLocations().then((response) =>{
          setViewCityData(response.data)
        }).catch((error) =>{
          console.log("error getting cities",error);
        })
    }
 
    useEffect(()=>{
        getCities();
    }, []);

    const getSiteByCityId = () =>{
         SiteServices.sitesInLocation(currentData.cityId).then((response) =>{
            setViewSiteData(response.data)
        }).catch((error) => {
            console.log("error loading sites ", error);
        })
    };
    useEffect(()=>{
      getFloorsBySites();
    }, [currentData.siteId]);
    const getFloorsBySites=()=>{
      FloorServices.floorsBySite(currentData.siteId).then((response)=>{
        setViewFloorData(response.data)
      }).catch((error) => {
        console.log("error loading floors ", error);
    })
    };
    useEffect(()=>{
      getSiteByCityId  ();
    }, [currentData.cityId]);
 
  return ( 
<Container className='mt-5'>
<Row className='justify-content-center'>
    <Col md={6}>
         <Card>
          <Card.Body>
             
                <h2 className='text-center' style={{ fontWeight: 'bold' }}>ADD ROOM</h2>
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
                        <Form.Label>Floor:</Form.Label>
                        <Form.Control as='select' value={currentData.floorId} onChange={handleInputChange} name='floorId'>
                            <option>--Select Floor--</option>
                            {viewFloorData.map((item) => (
                                <option key={item.id} value={item.id}>{item.floorId}</option>
                            ))}
                        </Form.Control>
                        {errors.floorId && <span style={{ display: "flex", color: "red" }}>{errors.floorId}</span>}
                 
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label> Type:</Form.Label>
                        <Form.Control
                            type='text'
                            name='type'
                            value={currentData.type}
                            onChange={handleInputChange}
                            maxLength={15}
                            placeholder='Enter room type'
                        />
                        {errors.type && <span style={{ display: "flex", color: "red" }}>{errors.type}</span>}
                    </Form.Group>
                    

                    <Form.Group className='mb-3'>
                        <Form.Label>Description</Form.Label>
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
                        <Form.Label  >Capacity:</Form.Label>
                         

                        <Form.Control
                            type='text'
                            name='capacity'
                            value={currentData.capacity}
                            onChange={handleInputChange}
                            maxLength={3}
                            placeholder='Enter Capacity'
                            max={50}
                        />
                        
                        {errors.capacity && <span style={{ display: "flex", color: "red" }}>{errors.capacity}</span>}
                    </Form.Group> 

                    <Button variant='success' onClick={postRoom}>Save</Button>{' '}
                    <Link to='/RoomsList'>
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
 
export default AddRoom;      