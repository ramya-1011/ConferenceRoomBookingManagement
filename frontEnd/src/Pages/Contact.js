import React from 'react'
import AddLocationIcon from '@mui/icons-material/AddLocation';
import { FaPhoneAlt } from "react-icons/fa";

const Contact = () => {
  return (
    <div>
    <section className='py-4 bg-info'>  
      <div className='container'>
        <div className='row'>
          <div className='col-md-4 my-auto'>
            <h4> Contact Us</h4> 
          </div>
          <div className='col-md-8 my-auto'>
            <h6 > Home/Get In Touch.!</h6> 
          </div>
        </div> 
        </div> 
      </section>
      <section className='section bg-light'>
  <div className='container'>
    <div className='row'>
      <div className='col-md-12  mb-4  text-center'> 
      <h3 className='main-heading'>  Contact Information </h3> 
      </div > 
      <div className='col-md-6 '> 
        <div className='card shadow'>
         
        <div className='card-body'>
          <h5  > <AddLocationIcon/>Meet us at:</h5>  
          <p>
            <li>Gurgaon, Haryana, pincode:455665</li>  
            <li>Hyderabad, Telangana, pincode:500053</li> 
            <li>Banglore, Karnataka, pincode:560001</li>  
            </p>
          </div>
          </div> 
      </div>
      
      <div className='col-md-6 '> 
        <div className='card shadow'>
         
        <div className='card-body'>
          <h5  > < FaPhoneAlt/> Contact Us:</h5> 
          
          <p><li>
        GGN Ph:040-9347024445
          </li>
          <li>
        HYD Ph:040-9347024477
          </li>
          <li>
        BGL Ph:040-9347024475
          </li>
          <li>
          mail:abc@123gmail.com
          </li>
          
          </p>
          </div>
          </div>
          </div> </div>
      </div>
      </section>
    </div>
)
}

export default Contact

