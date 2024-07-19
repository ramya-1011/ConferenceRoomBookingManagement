
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom' ;
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import BookingServices from '../Service/BookingService';

import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton"; 
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

import Button from "react-bootstrap/Button";

const BookingListComponent = () => {
    const navigate=useNavigate();
  const[bookings,setBookings] = useState([])
  const[records,setRecords]=useState([])
  const[searchQuery,setSearchQuery]=useState('');

//   const getAllConferenceRooms = async()=>{
//     const result = await axios.get("http://localhost:8080/booking/all");
//     // setBookings(result.data);
//     // console.log(result.data)
// };
  useEffect(()=>{
    axios.get('http://localhost:8080/booking/all')
    .then(res=> {setBookings(res.data)
               setRecords(res.data);
            })
    .catch(err=>console.log(err));
     
   },[])
  

const deleteBooking = async (id) => {
    if(window.confirm("Are you sure you want to delete Booking?")){
    const result = await BookingServices.deleteBooking(id);
    toast.success("booking deleted Successfully!");
            
    }                              
  };
  const Filter=(e)=>{
    e.preventDefault();
    setSearchQuery(e.target.value)
    setRecords(bookings.filter(f=>f.employeeName.toLowerCase().includes(e.target.value.toLowerCase())))
  }
  const ResetFilter=()=>{
    setRecords(bookings);
    setSearchQuery('')
  }
  return (
    
    <div style={{ width: "80%", margin: "20px auto" }}>
   {/* <Link to={"/find-booking"} className='btn btn-info mb-2 mt-3' href="">find booking!!</Link> */}
     <h2 className='text-center'style={{ fontWeight: "bold" }}> LIST OF BOOKINGS</h2>
     <div style={{display:'flex',alignItems:'center',marginBottom:'10px'}}>
     <input
      type='text' className='form-control mb-3'  value={searchQuery} onChange={Filter} placeholder='Search Bookings by EmployeeName'
      s></input>
     <Button variant="secondary" className="reset-button mb-3" onClick={ResetFilter}>
            Reset
          </Button>
          </div>
     <Table stripped bordered hover variant="light"  >
     {bookings.length > 0 ? (
            <>
         <thead style={{backgroundColor:"#35979cb0",height:"50px"}}>
             <th scope="row" style={{textAlign:"center"}}> Booking Id   </th>
             <th scope="row" style={{textAlign:"center"}}> Room Id </th>
             <th scope="row" style={{textAlign:"center"}}>Employee Name </th>
             <th scope="row" style={{textAlign:"center"}}>Employee Id </th>
             <th scope="row" style={{textAlign:"center"}}>Phone Number </th>
             <th scope="row" style={{textAlign:"center"}}>Booking Date  </th>
             <th scope="row" style={{textAlign:"center"}}>Start Time  </th>
             <th scope="row" style={{textAlign:"center"}}>End Time </th>
             <th scope="row" style={{textAlign:"center"}}>Attendees </th>
             <th scope="row" style={{textAlign:"center"}}> ConfirmationCode</th>
             <th scope="row" style={{textAlign:"center"}}> Action</th>
             
             
            
         </thead>
         <tbody>
             { 
                    records.map((row) =>
                 (
                     <tr key={row.id}>
                         <td component="th" scope="row" style={{textAlign:"center"}}>
                             {row.bookingID}
                         </td>
                         <td component="th" scope="row" style={{textAlign:"center"}}>
                             {row.roomId}
                         </td>
                         <td component="th" scope="row" style={{textAlign:"center"}}>
                             {row.employeeName}
                         </td>
                         <td component="th" scope="row" style={{textAlign:"center"}}>
                             {row.employeeId}
                         </td>
                         <td component="th" scope="row" style={{textAlign:"center"}}>
                             {row.employee_ph_no}
                         </td>
                         <td component="th" scope="row" style={{textAlign:"center"}}>
                             {row.bookingDate}
                         </td>
                         <td component="th" scope="row" style={{textAlign:"center"}}>
                             {row.startTime}
                         </td>
                         <td component="th" scope="row" style={{textAlign:"center"}}>
                             {row.endTime}
                         </td>
                         <td component="th" scope="row" style={{textAlign:"center"}}>
                             {row.attendees}
                         </td>
                         
                         <td component="th" scope="row" style={{textAlign:"center"}}>
                                {row.confirmationCode}
                            </td>
                            <IconButton
                  aria-label="delete"
                  size="large"
                  onClick={() => deleteBooking(row.bookingID)}
                  color="error"
                >
                  <DeleteIcon   fontSize="inherit" />
                </IconButton>
                         
                     </tr>
                 ))
             }
         </tbody>
         </>
        ):(
            <p style={{fontWeight: "bold"}}>No Bookings Found</p>
          )}
     </Table>
      <ToastContainer/>
 </div>
  )
}

export default BookingListComponent
