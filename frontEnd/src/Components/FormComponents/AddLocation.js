  
import React, { useState, useEffect } from 'react';
import { Link,      useNavigate } from 'react-router-dom';   
import LocationServices from '../../Service/LocationService'; 
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
 import Form from "react-bootstrap/Form";  
 import Select from 'react-select';
import { State, City } from 'country-state-city';

const AddLocation = () => {
     
        const navigate = useNavigate();
        const  initialCityData={
            name: '',
            state: '',
            
        } 
        const[errors, setErrors] = useState({
            name: "",
        state: "",
         
        },[]);  
          const[currentData,setCurrentData]=useState(initialCityData); 

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
          //   case 'totalSites':
          //   setErrors({...errors,totalSites:validateTotalSites(value)});
          // break;
        default:
          break;
        
        };
      }
      const handleStateChange = (selectedOption) => {
        setCurrentData({ ...currentData, state: selectedOption.value, name: '' });
        setErrors({...errors,state:validateState(selectedOption.value),name:''})
    };

    const handleNameChange = (selectedOption) => {
        setCurrentData({ ...currentData, name: selectedOption.value });
        setErrors({...errors,name:validateName(selectedOption.value)})
    };
        const validateName=(name)=>{
          if(!name){
            return "City name is required"
          }
           
          return '';
        }
        const validateState=(state)=>{
          if(!state){
            return "state name is required"
          }
           
          
          return '';
        }
        
         
        const addLocation =  (event) => {
          event.preventDefault();
            
        const {name,state } = currentData;
        const newErrors = {};
        newErrors.name=validateName(name);
        newErrors.state=validateState(state);
        //newErrors.totalSites=validateTotalSites(totalSites);
        setErrors(newErrors);
        console.log("dta",currentData)
        console.log("erorrr",newErrors)
        if (Object.values(newErrors).every(error => error === '')) {
            console.log('Form submitted successfully:', currentData);
            LocationServices.addLocation(currentData).then((response)=>{
                toast.success("location added successfully!");
                if(response.status === 200){
                    setCurrentData(initialCityData);
                    console.log(response.data);
                    navigate('/LocationList')
                    
                }
            }).catch((error)=>{
                console.log("error", error)
                toast.error(error.response?.data.message);
            })
        } 
        // else {
        //     console.log('Form has errors. Please correct them.');
        // }
       
    }
            
            
             
            const stateOptions = State.getStatesOfCountry("IN").map(item => ({ value: item.isoCode, label: item.name }));
            const cityOptions = currentData.state
                ? City.getCitiesOfState("IN", currentData.state).map(city => ({ value: city.name, label: city.name }))
                : [];          
                
        
        
    
    
  return (
    <div>
    <div className='container mt-5 mb-5'>
            <div className='row'>
                <div className='card col-md-6 offset-md-3'>
                    <h2 className='text-center' style={{fontWeight:"bold"}}> ADD CITY</h2>
                    <div className='card-body'>
                            <div className='form-group mb-2'> 
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
                                {/* <Form>
                                    <Form.Group className="mb-3" controlId="formTaskName">
                                    {/* <Form.Label>{("City Name")}</Form.Label> */}
                                    {/* <Form.Control
                                        required
                                        type="text"
                                        placeholder="Enter total Sites"
                                        name="totalSites"
                                        value={currentData.totalSites}
                                            onChange={handleInputChange}/>
                                        <Form.Control.Feedback type="invalid">
                                        {errors.totalSites}
                                    </Form.Control.Feedback>
                                    <span style={{display: "flex", color: "red"}}>{errors.totalSites}</span>
                                    </Form.Group>  
                                </Form> */} 
                            </div>
                            <button onClick={addLocation} className='btn btn-success'>Save</button> {" "}
                            <Link to={"/LocationList"} className='btn btn-danger' href='/'>Cancel</Link>
                    </div>
                </div>
            </div>
        </div>
    <ToastContainer />
    </div>
     
       
    
  )
}

export default AddLocation
