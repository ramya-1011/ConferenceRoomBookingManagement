import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table';
import { useNavigate } from 'react-router-dom'; 
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Link ,NavLink} from 'react-router-dom'; 
import LocationServices from '../Service/LocationService'; 
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { MdEditLocationAlt } from "react-icons/md";
import IconButton from "@mui/material/IconButton"; 
import DeleteIcon from "@mui/icons-material/Delete";
import { ErrorMessage } from 'formik';
import Form from "react-bootstrap/Form";   

import Select from 'react-select';
import { State, City } from 'country-state-city';

import SiteServices from '../Service/SiteService';

 

  export default function Location  () {
    const navigate = useNavigate(); 
    const [location, setLocation] = useState([]);
    const [currentData, setCurrentData] = useState([]);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    useEffect(()=>{
        loadlocation();
    }, []);
 
    const loadlocation = async()=>{
        try{
            const result = await LocationServices.loadLocations();
        setLocation(result.data);
        }catch (error){
            console.error('error loading locations',error);
            toast.error('failed to load locations');
        }
   
 
   
    const forceDeleteCity = async (cityId) => {
      try {
        const response = await LocationServices.forceDeleteLocation(cityId);
        console.log('Response:', response); // Log the full response for debugging
        if (response.status === 200) {
          toast.success('City and all associated bookings have been deleted successfully.');
        } else {
          console.log('Unexpected response:', response); // Log unexpected responses
          toast.error('Error occurred while forcibly deleting the city.');
        }
      } catch (error) {
        console.error('Force Delete Error:', error);
        toast.error('An error occurred while forcibly deleting the city.');
      }
      loadlocation(); // Reload the locations to update the UI
    };
    
    
    

const deleteLocation = async (id) => {
  try {
    const response = await LocationServices.deleteLocation(id);
    toast.success('City deleted successfully.');
    loadlocation(); // Reload the locations to update the UI
  } catch (error) {
    if (error.response && error.response.status === 409) {
      console.log(error.response);
      if (window.confirm(error.response.statusText || "This city has active bookings. Do you still want to delete it?")) {
        // Call forceDeleteCity here when the user confirms
        await forceDeleteCity(id);
      }
    } else {
      toast.error('An error occurred while deleting the city.');
      console.error('Error:', error);
    }
  }
};

const handleStateChange = (selectedOption) => {
  setCurrentData({ ...currentData, state: selectedOption.value, name: '' });
  setErrors({...errors,state:validateState(selectedOption.value),name:''})
};

const handleNameChange = (selectedOption) => {
  setCurrentData({ ...currentData, name: selectedOption.value });
  setErrors({...errors,name:validateName(selectedOption.value)})
};
    
    
    
   
 
    const getLocation = async(id) => {
        handleShow();
        const result = await LocationServices.getLocation(id);
        setCurrentData(result.data);
    }; 
    const[errors, setErrors] = useState({
        name: "",
    state: "",
    
    },[]);  
    const handleInputChange = (e) => {
        const{name, value} = e.target;
      setCurrentData({...currentData,[name]:value});
      switch (name) {
          case 'name':
          setErrors({...errors,name:validateName(value)});
          break;
          case 'state':
          setErrors({...errors,state:validateState(value)});
          break; 
      default:
        break;
      
      };
    }
    const validateName=(name)=>{
        if(!name){
          return "City name is required"
        }
        else if (!/^[a-zA-Z\s]+$/.test(name)) {
          return 'City Name can only contain letters';
        }
        return '';
      }
      const validateState=(state)=>{
        if(!state){
          return "state name is required"
        }
        else if (!/^[a-zA-Z\s]+$/.test(state)) {
          return 'state Name can only contain  letters';
        }
        return '';
      }
     
      const stateOptions = State.getStatesOfCountry("IN").map(item => ({ value: item.isoCode, label: item.name }));
      const cityOptions = currentData.state
          ? City.getCitiesOfState("IN", currentData.state).map(city => ({ value: city.name, label: city.name }))
          : [];  
    const updateLocation = (event) =>{ 
         
            event.preventDefault(); 
        const {name,state,totalSites } = currentData;
        const newErrors = {};
        newErrors.name=validateName(name);
        newErrors.state=validateState(state);
     //   newErrors.totalSites=validateTotalSites(totalSites);
        setErrors(newErrors);
        if (Object.values(newErrors).every(error => error === '')) {
            console.log(' deatils added successfully:', currentData);
            LocationServices.updateLocation(currentData.id,currentData).then((response)=>{
                toast.success("location Updated successfully!");
                if(response.status === 200){
                   // setCurrentData(initialData);
                    console.log(response.data);
                    handleClose(); 
                         loadlocation();
                    
                }
            }).catch((error)=>{
                console.log("error", error)
                toast.error(error.response?.data);
            })
        } else {
            console.log('Form has errors. Please correct them.');
        }
         
    }
 
    
 
    
 
  return (
    <div  style={{ width: '80%', margin: '20px auto' }} >
        <h2 style={{ fontWeight: 'bold' }}>Cities We are Available At.!</h2>
        <div className="button-container"  >
            <Link to="/add-Location">
                    <Button variant="primary">Add Location</Button>
                </Link>
            </div>
        <Table stripped bordered hover variant="light" className="col-md-3 center">
        
        {location.length > 0 ? (
            <>
            <thead style={{backgroundColor:"#1976d2",height:"40px", textAlign: "center", verticalAlign:"middle"}}>
                <th  > S.No</th>
                <th  >City Name</th>
                <th  >State</th> 
                <th style={{textAlign:"center"}}>Actions</th>
            </thead>
            <tbody>
                {
                    location?.map((row,index) =>
                    (
                        <tr key={row.id} style={{ textAlign: "center",verticalAlign:"middle" }}>
                            <td   >
                                {index+1}
                            </td>
                            <td component="th"  >
                                {row.name}
                            </td>
                            
                            <td component="th" >
                                {row.state}
                            </td> 
                            <td> {" "} 
                            <IconButton
                            variant="info" onClick={() => getLocation(row.id)}
                            > <MdEditLocationAlt /> 
                            </IconButton>
                            <IconButton
                             aria-label="delete"
                             size="large"
                             onClick={() => deleteLocation(row.id)}
                             color="error">
<DeleteIcon fontSize="inherit" />
                            </IconButton>  
                            </td>
                        </tr>
                    ))
                }
            </tbody>
            </>
          ):(
            <p style={{fontWeight: "bold"}}>No Record Found</p>
          )}
        
            <div  style={{display:'table-caption', width: '80%', margin: '20px auto'}}>
             
            </div>
        </Table>
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Location</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <div className='form-group mb-2'>
                                    <input name='name' className='form-control'
                                    value={currentData.name}
                                    
                                    onChange={handleInputChange}
                                        type="text" placeholder='Enter Name' />
                                </div>
                                <Form.Control.Feedback type="invalid">
                                        {errors.name}
                                    </Form.Control.Feedback>
                                    <span style={{display: "flex", color: "red"}}>{errors.name}</span>
                                <div className='form-group mb-2'>
                                    <input name='state' className='form-control'
                                    value={currentData.state}
                                    onChange={handleInputChange}
                                        type="text" placeholder='Enter state' />
                                </div>
                                <span style={{display: "flex", color: "red"}}>{errors.state}</span>  */}
                                <Form>
                                     
                                     <Form.Group className="mb-3" controlId="formState">
                                    <Select
                                        options={stateOptions}
                                        onChange={handleStateChange}
                                        placeholder="Select State"
                                        value={stateOptions.find(option => option.value === currentData.state)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.state}
                                    </Form.Control.Feedback>
                                    <span style={{ display: "flex", color: "red" }}>{errors.state}</span>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formName">
                                    <Select
                                        options={cityOptions}
                                        onChange={handleNameChange}
                                        placeholder="Select City"
                                        value={cityOptions.find(option => option.value === currentData.name)}
                                        isDisabled={!currentData.state}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.name}
                                    </Form.Control.Feedback>
                                    <span style={{ display: "flex", color: "red" }}>{errors.name}</span>
                                </Form.Group>
                                </Form>
                                 </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={updateLocation}>
            Update Location
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer/>
    </div>
  )
}

 
