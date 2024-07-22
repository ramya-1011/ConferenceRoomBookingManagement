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
import { FcAcceptDatabase } from "react-icons/fc"; 
import { SiGoogleclassroom } from "react-icons/si"; 
import {Container,Row,Col,Card,Button, CardBody} from 'react-bootstrap';

import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';

export default function ConferenceRoom({roomList}) {
  const initialRoomData = {
    id:"",
    type: "",
    description: "",
    capacity: "",  
    floorId: "", 
    siteId: "",
    cityId: "",
  };

  const filterRoomData = {
    cityId: "",
    siteId: "",
    floorId: "",
  };
  const [errors,setErrors]=useState({
    type:"",
    description:"",
    capacity:"",  
  floorId:"", 
  siteId:"",
  cityId:"", 
     
  },[]);
  
 

  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [currentData, setCurrentData] = useState(initialRoomData);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [show, setShow] = useState(false); 
  const [viewCityData, setViewCityData] = useState([]);
  const [viewSiteData, setViewSiteData] = useState([]);
  const [viewFloorData, setViewFloorData] = useState([]);
  const [filterData, setFilterData] = useState(filterRoomData); 
  const [deleteConfirmShow, setDeleteConfirmShow] = useState(false);
const [roomToDelete, setRoomToDelete] = useState(null);

  useEffect(() => {
    getRoomsByFilter();
  }, [filterData.cityId, filterData.siteId, filterData.floorId]);

  const getRoomsByFilter = async () => {
    const result = await RoomServices.getRoomsByFilter(filterData.cityId, filterData.siteId, filterData.floorId);
    setRooms(result.data);
  };

  const BookRoom = (id) => {
    navigate(`/add-booking/${id}`, {
      state: { id: id },
    });
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

 
  
  const confirmAndDeleteRoom = async (id) => {
    try {
       
      const response = await RoomServices.checkBookings(id);
      const message = response.data;
      
       
      const confirmDeletion = window.confirm(message);
      if (confirmDeletion) {
       
        await RoomServices.deleteRoom(id);
        toast.success("Room deleted successfully!");
        getRoomsByFilter();  
      }
    } catch (error) {
      toast.error("Error occurred while checking room bookings.:",error.response);
      // console.log("bjdwb",error)
      console.error("Check bookings error:", error);
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setCurrentData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      
      if (name === "cityId") {
        getSiteByCityId(value);
        setCurrentData((prevData) => ({ ...prevData, siteId: "", floorId: "" })); // Reset site and floor
      } else if (name === "siteId") {
        getFloorsBySiteId(value);
        setCurrentData((prevData) => ({ ...prevData, floorId: "" })); // Reset floor
      }

      return updatedData;
    });
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
  };
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

  const getRoom = async (id) => {
    handleShow();
    const result = await RoomServices.getRoom(id);
    console.log("getRoom:", result.data);
    const roomData=result.data;
    setCurrentData({
      id:roomData.id,
      type:roomData.type,
      description:roomData.description,
      capacity:roomData.capacity,floorId:roomData.floor?.id||"",
      siteId:roomData.site?.id||"",
      cityId:roomData.city?.id||"",
    });
    getSiteByCityId(roomData.city?.id);
    getFloorsBySiteId(roomData.site?.id);
  };

  const updateRoom = (e) => {
    console.log("updating with id", currentData);
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
    RoomServices.updateRoom(currentData.id, currentData)
     .then((response)=>{
        toast.success("Room details updated  successfully!");
        if(response.status === 200){
            setCurrentData(initialRoomData);
            handleClose();
          //  console.log(response.data);
          getRoomsByFilter();
            
        }
    }).catch((error)=>{
        console.log("error", error)
        toast.error(error.response.data);
    })
} else {
    console.log('Form has errors. Please correct them.');
}

}


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

  const getFloorsBySiteId = (siteId) => {
    FloorServices.floorsBySite(siteId).then((response) => {
      setViewFloorData(response.data);
    }).catch((error) => {
      console.log("error loading floors", error);
    });
  };

  const getFloorsBySites = () => {
    FloorServices.floorsBySite(filterData?.siteId).then((response) => {
      setViewFloorData(response.data);
    }).catch((error) => {
      console.log("error getting floors", error);
    });
  };

  useEffect(() => {
    if (filterData.siteId !== '') {
      getFloorsBySites();
    }
  }, [filterData.cityId, filterData.siteId]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterData({ ...filterData, [name]: value });
  };
  const resetFilters = () => {
    setFilterData(filterRoomData); // Reset filter data to initial values
    setViewSiteData([]); // Clear site data
    setViewFloorData([]); // Clear floor data
    getRoomsByFilter(); // Fetch rooms without filters
  };

  console.log(currentData, "hii");

  return (
    <div style={{ width: "80%", margin: "20px auto" }}>
      <h2 style={{ fontWeight: "bold" }} className='text-center'>Rooms List</h2>
       
       <div className="button-container">
        <Link to="/add-room">
          <Button variant="primary">Add Room</Button>
        </Link>
      </div>
      <div className="filter-container">
        <Form.Group className="mb-3">
          <Form.Select 
           className="form-control form-control-equal1"
           enabled value={filterData.cityId} onChange={handleFilterChange} name='cityId'>
            <option value="">Select City</option>
            {viewCityData.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="floor-reset-container mb-3 mr-2">
          <Form.Select  className="form-control form-control-equal1"
          enabled value={filterData?.siteId} onChange={handleFilterChange} name='siteId'>
            <option value="">Select Site</option>
            {viewSiteData.map((item) => (
              <option key={item.id} value={item.id}>{item.siteId}</option>
            ))}
          </Form.Select>
        </Form.Group>
        <div className="floor-reset-container">
          <Form.Group className="mb-3">
            <Form.Select   className="form-control form-control-equal1"
            enabled value={filterData?.floorId} onChange={handleFilterChange} name='floorId'>
              <option value="">Select Floor</option>
              {viewFloorData.map((item) => (
                <option key={item.id} value={item.id}>{item.floorId}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Button variant="secondary" className="reset-button mb-3" onClick={resetFilters}>
            Reset Filters
          </Button>
        </div>
      </div>
      <Table striped bordered hover variant="light">
      {rooms?.length > 0 ? (
            <>
        <thead  style={{ backgroundColor: "#1976d2", height: "40px",textAlign: "center", verticalAlign:"middle"}}>
         
            <th scope="row"  >Id</th>
           
            <th    >Type</th>
            <th scope="row"  >Location Name</th>
            <th scope="row"  >Site</th>
            <th scope="row"  >Floor</th>
            <th scope="row"  >Capacity</th>
            <th scope="row"  >Description</th>
            <th scope="row"  >Actions</th>
          
        </thead>
        <tbody>
          {rooms.map((row, index) => (
            <tr key={row.id} style={{ textAlign: "center",verticalAlign:"middle" }}>
              <td  >{row.id}</td>
            
              <td component="th"   >{row.type}</td>
              <td component="th"    >{row.city?.name}</td>
              <td component="th"    >{row.site?.siteId}</td>
              <td component="th"    >{row.floor?.floorId}</td>
              <td component="th"   >{row.capacity}</td>
              <td component="th"   >{row.description}</td>
              <td component="th"   >
                <IconButton
                  aria-label="book"
                  size="large"
                  onClick={() => BookRoom(row.id)}
                  color="info"
                >
                   <FcAcceptDatabase  fontSize="inherit"/> 
                   
                </IconButton>
                <IconButton
                  aria-label="edit"
                  size="large"
                  onClick={() => getRoom(row.id)}
                  color="info"
                > 
                
                <SiGoogleclassroom fontSize="inherit" />
                 
                </IconButton>
                {/* <IconButton
                  aria-label="delete"
                  size="large"
                  onClick={() => deleteRoom(row.id)}
                  color="error"
                >
                  <DeleteIcon fontSize="inherit" />
                </IconButton> */}
               
        <IconButton  onClick={() => confirmAndDeleteRoom(row.id)}>
          <DeleteIcon />
        </IconButton>
      
              </td>
            </tr>
          ))}
        </tbody>
        </>
        ):(
            <p style={{fontWeight: "bold",textAlign: "center"}}>No Rooms Found</p>
          )}
      </Table>
       
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontWeight: "bold" }}>Edit Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Card>
          <Card.Body> 
                <Form>
                    <Form.Group className='mb-3'> 
                        <Form.Control as='select'  enabled value={currentData?.cityId || ""} onChange={handleInputChange} name='cityId'  title="select City">
                            <option>--Select City--</option>
                            {viewCityData.map((item) => (
                                <option key={item.id} value={item.id}>{item.name}</option>
                            ))}
                        </Form.Control>
                        {errors.cityId && <span style={{ display: "flex", color: "red" }}>{errors.cityId}</span>}
                    </Form.Group>
                    <Form.Group className='mb-3'> 
                        <Form.Control as='select'  enabled value={currentData?.siteId || ""} onChange={handleInputChange} name='siteId'>
                            <option>--Select Site--</option>
                            {viewSiteData.map((item) => (
                                <option key={item.id} value={item.id}>{item.siteId}</option>
                            ))}
                        </Form.Control>
                        {errors.siteId && <span style={{ display: "flex", color: "red" }}>{errors.siteId}</span>}
                    </Form.Group>
                    <Form.Group className='mb-3'> 
                        <Form.Control as='select'    enabled value={currentData?.floorId || ""} onChange={handleInputChange} name='floorId'>
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

                     
                </Form>
                </Card.Body>
         </Card>
         
          
           
           
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={updateRoom}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer/>
    </div>
  );
}