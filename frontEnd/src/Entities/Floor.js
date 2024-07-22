
import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { Link, useNavigate } from "react-router-dom"; 
import Modal from "react-bootstrap/Modal"; 
import Form from "react-bootstrap/Form"; 
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton"; 
import SiteServices from "../Service/SiteService";
import LocationServices from "../Service/LocationService";
import FloorServices from "../Service/FloorService";     
import RoomServices from "../Service/RoomService";  
import { Gi3dStairs } from "react-icons/gi";
import { TbEdit } from "react-icons/tb";
import { FaFilter } from "react-icons/fa"; 
import {Container,Row,Col,Card,Button, CardBody} from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function Floor() {
  const initialFloorData = {
    id:"", 
    floorId: "", 
    siteId: "",
    cityId: "",
  };

  const filterFloorData = {
    cityId: "",
    siteId: "",
     
  };
  const[errors, setErrors] = useState({
         
    siteId: "",
    floorId: "",  
    cityId:"",
},[]);
  
 

  const navigate = useNavigate();
  const [floors, setFloors] = useState([]);
  const [currentData, setCurrentData] = useState(initialFloorData);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [show, setShow] = useState(false); 
  const [viewCityData, setViewCityData] = useState([]);
  const [viewSiteData, setViewSiteData] = useState([]);
  
  const [filterData, setFilterData] = useState(filterFloorData);

  useEffect(() => {
    getFloorsByFilter();
  }, [filterData.cityId, filterData.siteId]);

  const getFloorsByFilter = async () => {
    const result = await FloorServices.getFloorsByFilter(filterData.cityId, filterData.siteId );
    setFloors(result.data);
    console.log("floorss:",result)
  };

  

  useEffect(() => {
    LocationServices.loadLocations()
      .then((response) => {
        setViewCityData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log("error fetching cities", error);
      });
  }, []);

   
    
  const deleteFloor = async (id) => {
    if(window.confirm("Are you sure you want to delete Floor?")){
    const result = await FloorServices.deleteFloor(id);
    toast.success("floor deleted successfully")
    getFloorsByFilter();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setCurrentData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      
      if (name === "cityId") {
        getSiteByCityId(value);
        setCurrentData((prevData) => ({ ...prevData, siteId: "" })); // Reset site and floor
      }  
      return updatedData;
    });
    switch (name) {
      case 'floorId':
        setErrors({ ...errors, floorId: validateFloorId(value) });
        break;
       
      // case 'siteId':
      //   setErrors({ ...errors,  siteId: validateSiteId(value) });
      //   break;
      
      // case 'cityId':
      //   setErrors({ ...errors, cityId: validateCityId(value) });
      //   break;
      
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

  const getFloor = async (id) => {
    handleShow();
    const result = await FloorServices.getFloor(id);
    console.log("getRoom:", result.data);
    const floorData=result.data;
    setCurrentData({
      id:floorData.id,
      floorId:floorData.floorId,
      siteId:floorData.site?.id||"",
      cityId:floorData.city?.id||"",
    });
    getSiteByCityId(floorData.city?.id);
    console.log(floorData,"hiiiiiiiiii")
  
  };

  const updateFloor = (event) => {
    event.preventDefault();
    const {  floorId,siteId, cityId  } = currentData;
    const newErrors = {};

    newErrors.floorId= validateFloorId(floorId);
     
   
    // newErrors.cityId = validateCityId(cityId);
    // newErrors.siteId = validateSiteId(siteId);
   

    setErrors(newErrors);
    if (Object.values(newErrors).every(error => error === '')) {
        console.log(' floor added successfully:', currentData);
        console.log("updating with id", currentData);
        const updatedInfo = { ...currentData,   siteId: currentData.siteId, cityId: currentData.cityId };
         FloorServices.updateFloor(currentData.id, updatedInfo)
         .then((response)=>{
            toast.success("Floor details updated successfully!");
            
            if(response.status === 200){
                setCurrentData(initialFloorData);
                console.log(response.data);
                handleClose();
          getFloorsByFilter();
            }
        }).catch((error)=>{
            console.log("error", error)
            toast.error(error.response.data);
        })
    } else {
        console.log('Form has errors. Please correct them.');
    }
     
  };

  const getSiteByLocation = () => {
    SiteServices.sitesInLocation(filterData.cityId).then((response) => {
      setViewSiteData(response.data);
    }).catch((error) => {
      console.log("error getting sites", error);
    });
  };

  useEffect(() => {
    if (filterData.cityId !== '') {
      getSiteByLocation();
    }
  }, [filterData.cityId]);

  const getSiteByCityId = (cityId) => {
    SiteServices.sitesInLocation(cityId).then((response) => {
      setViewSiteData(response.data);
    }).catch((error) => {
      console.log("error loading sites", error);
    });
  };

   
   

   

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterData({ ...filterData, [name]: value });
  };
  const resetFilters = () => {
    setFilterData(filterFloorData); // Reset filter data to initial values
    setViewSiteData([]); // Clear site data
     
    getFloorsByFilter(); // Fetch rooms without filters
  };

  console.log(floors, "hii");

  return (
    <div style={{ width: "80%", margin: "20px auto" }}>
      <h2 style={{ fontWeight: "bold" }}>Floors List</h2>
       
       <div className="button-container">
        <Link to="/add-floor">
          <Button variant="primary">Add Floor</Button>
        </Link>
      </div>
      <div className="filter-container" > 
      <IconButton>
      <FaFilter  className="   mb-3 "/></IconButton>
        <Form.Group className="mb-3">
          <Form.Select enabled value={filterData.cityId} onChange={handleFilterChange} name='cityId'>
            <option value="">Select City</option>
            {viewCityData.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </Form.Select>
        </Form.Group>
       
        <Form.Group className="floor-reset-container mb-3 mr-2">
          
          <Form.Select enabled value={filterData?.siteId} onChange={handleFilterChange} name='siteId'>
            <option value="">Select Site</option>
            {viewSiteData.map((item) => (
              <option key={item.id} value={item.id}>{item.siteId}</option>
            ))}
          </Form.Select>
        </Form.Group>
        
          <Button variant="info" className="reset-button mb-3" onClick={resetFilters}>
            Reset Filters
          </Button>
        </div>
      
      <Table striped bordered hover variant="light">
      {floors.length > 0 ? (
            <>
   <thead  style={{ backgroundColor: "#1976d2", height: "40px", textAlign: "center", verticalAlign:"middle"}}>
         
            <th scope="row"  >S.No</th>
            <th scope="row"  >Floor Id</th> 
            <th scope="row" >Location Name</th>
            <th scope="row" >Site</th>
            
            <th scope="row" >Actions</th>
         
        </thead>
        <tbody>
          {floors.map((row, index) => (
            <tr key={row.id} style={{   height: "40px",  textAlign: "center",verticalAlign:"middle"}}>
              <td  >{index + 1}</td>
              <td  >{row.floorId}</td> 
              <td  >{row.city?.name}</td>
              <td  >{row.site?.siteId}</td> 
              <td  >
                 
                <IconButton
                  aria-label="edit"
                  size="large"
                  onClick={() => getFloor(row.id)}
                  color="info"
                > 
                <Gi3dStairs fontSize="inherit"/>
                 
                </IconButton>
                <IconButton
                  aria-label="delete"
                  size="large"
                  onClick={() => deleteFloor(row.id)}
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
            <p style={{fontWeight: "bold",textAlign: "center"}}>No Floors Found</p>
          )}
      </Table>
       
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontWeight: "bold" }}>Edit Floor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Card>
          <Card.Body>
             
                 
                <Form>
                    <Form.Group className='mb-3'> 
                        <Form.Control as='select'  enabled value={currentData?.cityId || ""}   onChange={handleInputChange} name='cityId' title="select City">
                            <option>--Select City--</option>
                            {viewCityData.map((item) => (
                                <option key={item.id} value={item.id}>{item.name}</option>
                            ))}
                        </Form.Control>
                        {errors.cityId && <span style={{ display: "flex", color: "red" }}>{errors.cityId}</span>}
                    </Form.Group>
                    <Form.Group className='mb-3'> 
                        <Form.Control as='select'   enabled value={currentData?.siteId || ""} onChange={handleInputChange} name='siteId'>
                            <option>--Select Site--</option>
                            {viewSiteData.map((item) => (
                                <option key={item.id} value={item.id}>{item.siteId}</option>
                            ))}
                        </Form.Control>
                        {errors.siteId && <span style={{ display: "flex", color: "red" }}>{errors.siteId}</span>}
                    </Form.Group>

                    <Form.Group className='mb-3'> 
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
                    
 
                </Form>
                </Card.Body>
         </Card>
           
           
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={updateFloor}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer/>
    </div>
  );
}