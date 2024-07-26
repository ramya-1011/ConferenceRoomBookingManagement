import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; 
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import RoomServices from '../../Service/RoomService.js'; 
import {Container,Row,Col,Card,Button, CardBody} from 'react-bootstrap';
import Form from "react-bootstrap/Form"; 
 
const AddBooking = () => {
    const location = useLocation();
    const path = location.state;
 
    const initialBookingData ={
        
            roomId:path?.id, 
        confirmationCode:"",
        employeeName: '',
         employeeId:'',
         employee_ph_no:'',
         bookingDate:'',
         startTime:'',
         endTime:'',
         attendees:'',
        
    };
    const navigate=useNavigate();
    const[errors, setErrors] = useState({
         
         
        employeeName: '',
         employeeId:'',
         employee_ph_no:'',
         bookingDate:'',
         startTime:'',
         endTime:'',
         attendees:'',
    },[]);
    const[currentData, setCurrentData] = useState(initialBookingData); 
    const handleInputChange = (e) => {
        const{name, value} = e.target;
      setCurrentData({...currentData,[name]:value});
      switch (name) {
          case 'employeeName':
          setErrors({...errors,employeeName:validateEmployeeName(value)});
          break;
          case 'employeeId':
            setErrors({...errors,employeeId:validateEmployeeId(value)});
            break;
          case 'employee_ph_no':
          setErrors({...errors,employee_ph_no:validatePhoneNumber(value)});
          break;
          case 'bookingDate':
          setErrors({...errors,bookingDate:validateBookingDate(value)});
        break;
        // case 'startTime':
        //   setErrors({...errors, startTime:validateStartTime(value)});
        //   break;
        //   case'endTime':
        //   setErrors({...errors,endTime:validateEndTime(value)});
        //   break;
          case'attendees':
          setErrors({...errors,attendees:validateAttendees(value)});
          break;
      default:
        break;
      
      };
    }
    const validateAttendees = (attendees) => {
        if (! attendees) {
          return ' Number of Attendees is required';
        }else if(parseInt(attendees) <= 0){
            return 'attendees must be greater than 0'
        }else if (!/^\d+$/.test(attendees)) {
            return 'Attendees can only be in Numbers';
          }
        return '';
      };
      const validatePhoneNumber = (employee_ph_no) => {
        if (! employee_ph_no) {
          return 'Phone Number is required';
        } else if (!/^\d+$/.test(employee_ph_no)) {
            return 'Phone Number can only contain digits';
          }
        return '';
      };
      const validateEmployeeId = (employeeId) => {
        if (! employeeId) {
          return 'Employee Id is required';
        } else if (!/^\d+$/.test(employeeId)) {
            return ' Employee Id can only contain digits';
          }
        return '';
      };
      const validateEmployeeName=(employeeName)=>{
        if(!employeeName){
          return "Employee Name is required"
        }
        else if (!/^[a-zA-Z\-]+$/.test(employeeName)) {
          return 'Name should only contain alphabetic characters';
        }
        return '';
      }
      
      const validateBookingDate = (bookingDate) => {
        if (!bookingDate) {
          return "Date is required";
        }
      
        // Create a Date instance for the booking date
        const bookingDateInstance = new Date(bookingDate);
        // Create a Date instance for the current date
        const currentDate = new Date();
      
        
        bookingDateInstance.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);
      
        // Check if the booking date is in the past
        if (bookingDateInstance < currentDate) {
          return "Booking date cannot be in the past.";
        }
      
        return '';
      };
      
      
      const validateStartTime = (startTime) => {
        if(!startTime){
          return "Start Time is required"
        }
          
        return '';
      };
      const validateEndTime = (endTime) => {
        if(!endTime){
          return "End Time is required"
        }
          
        return '';
      };
      
    
   
 

const  saveBooking = (event) =>{
  event.preventDefault();
          const { employeeId,employeeName,employee_ph_no,attendees,bookingDate,startTime,endTime
           } = currentData;
          const newErrors = {};
      
          newErrors.employeeId = validateEmployeeId( employeeId);
          newErrors.employeeName = validateEmployeeName( employeeName);
          newErrors.employee_ph_no = validatePhoneNumber(employee_ph_no );
          newErrors.attendees = validateAttendees( attendees);
         newErrors.bookingDate=validateBookingDate(bookingDate);
          newErrors.startTime=validateStartTime(startTime);
         newErrors.endTime=validateEndTime(endTime);
           
         
     
          setErrors(newErrors);
          if (Object.values(newErrors).every(error => error === '')) {
              console.log(' booking added successfully:', currentData);
               RoomServices.addBooking(currentData).then((response)=>{
                  toast.success("Bokking added successfully!");
                  if(response.status === 200){
                      setCurrentData(initialBookingData);
                      console.log(response.data);
                    navigate('/BookingList')
                  }
   
  }).catch((error)=>{
      toast.error(error.response?.data.message);
      console.log("error", error)
  })
}
}
 
  return (
 
<Container className='mt-3'>
<Row className='justify-content-center'>
    <Col md={6}>
         <Card>
          <Card.Body>
             
                <h2 className='text-center' style={{ fontWeight: 'bold' }}>ADD BOOKING</h2>
                <Form>
                     
                   
                    <Form.Group className='mb-2'>
                        <Form.Label> Room Id:</Form.Label>
                        <Form.Control
                            type='text'
                            name='roomId'
                           disabled value={path?.id}
                           
                        />
                        
                    </Form.Group>
                    <Form.Group className='mb-3'>
                    <Form.Label> Booking Date:</Form.Label>
                        <Form.Control
                           required
                           type="date" 
                           placeholder='Enter booking date' 
                           name='bookingDate'
                           value={currentData.bookingDate}
                           onChange={handleInputChange}
                        />
                        {errors.bookingDate && <span style={{ display: "flex", color: "red" }}>{errors.bookingDate}</span>}
                    </Form.Group>                               
                              
<Form.Group className='mb-3'>
<Form.Label> Start Time:</Form.Label>
                        <Form.Control
                            required
                            type="time" 
                            placeholder='Enter Start'
                            name="startTime"
                            value={ currentData.startTime} 
                            onChange={handleInputChange}
                        />
                        {errors.startTime && <span style={{ display: "flex", color: "red" }}>{errors.startTime}</span>}
                    </Form.Group>
                    <Form.Group className='mb-3'>
                    <Form.Label> End Time:</Form.Label>
                        <Form.Control
                            required
                            type="time" 
                            placeholder='Enter End Time'
                            name="endTime"
                            value={ currentData.endTime} 
                            onChange={handleInputChange}
                        />
                        {errors.endTime && <span style={{ display: "flex", color: "red" }}>{errors.endTime}</span>}
                    </Form.Group> 
<Form.Group className='mb-3'>
                     
                         

                        <Form.Control
                            type='text'
                            name="attendees"
                            value={ currentData.attendees}
                            onChange={handleInputChange}
                            maxLength={3}
                            placeholder='Enter attendees'
                            max={50}
                        />
                        
                        {errors.attendees && <span style={{ display: "flex", color: "red" }}>{errors.attendees}</span>}
                    </Form.Group> 
 
                    <Form.Group className='mb-3'>
                       
                        <Form.Control
                            type='text'
                            name="employeeName"
                            value={currentData.employeeName}
                            onChange={handleInputChange}
                            maxLength={20}
                            placeholder='Enter Employee Name'
                        />
                        {errors.employeeName && <span style={{ display: "flex", color: "red" }}>{errors.employeeName}</span>}
                    </Form.Group>
                    <Form.Group className='mb-3'>
                       
                        <Form.Control
                            type='text'
                            name="employeeId" 
                            value={ currentData.employeeId}
                            onChange={handleInputChange}
                            maxLength={10}
                            placeholder='Enter Employee Id'
                        />
                        {errors.employeeId && <span style={{ display: "flex", color: "red" }}>{errors.employeeId}</span>}
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        
                        <Form.Control
                            type='text'
                            name="employee_ph_no"
                            value={ currentData.employee_ph_no}
                            onChange={handleInputChange}
                            maxLength={10}
                            placeholder='Enter Employee Phone Number'
                        />
                        {errors.employee_ph_no && <span style={{ display: "flex", color: "red" }}>{errors.employee_ph_no}</span>}
                    </Form.Group>
                    
                          
                    <div style={{ display: 'flex', justifyContent: 'center' }}> 
                   
                    <Button variant='success'  onClick={saveBooking} style={{ marginRight: '10px' }}>Save</Button>{' '}
                    <Link to='/RoomsList'>
                        <Button variant='danger'>Cancel</Button>
                    </Link></div>
                </Form>
                </Card.Body>
         </Card>
           
        
    </Col>
</Row>
<ToastContainer />
</Container>
  )
}
 
export default AddBooking;
