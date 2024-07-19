import React, { useState } from 'react';
import { Link, NavLink } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown'; 
import { DropdownItem } from 'react-bootstrap'; 
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import { RiFolderInfoFill } from "react-icons/ri";
import ContactMailIcon from '@mui/icons-material/ContactMail';
import { TfiMenuAlt } from "react-icons/tfi"; 
import Groups3Icon from '@mui/icons-material/Groups3';
import Groups2Icon from '@mui/icons-material/Groups2';
import { IoLocationSharp } from "react-icons/io5";
import BeenhereIcon from '@mui/icons-material/Beenhere';
import SavedSearchIcon from '@mui/icons-material/SavedSearch';
import { FaMagnifyingGlassLocation } from "react-icons/fa6";
import { BsBuildingsFill } from "react-icons/bs";
import { GrSteps } from "react-icons/gr";
import MeetingRoomSharpIcon from '@mui/icons-material/MeetingRoomSharp';

import IconButton from "@mui/material/IconButton"; 

function NavBar  ()  {
  const [click]=useState(false)
  const handleClick=()=>(!click)
  return (
    
      <nav className="navbar navbar-expand-lg  navbar-dark bg-secondary">
        <div className='container'>
        
    <Link className="navbar-brand" to="/"> 
    <IconButton >
    <Groups2Icon  fontSize='large'/>
    </IconButton>
       Conference Room Management System</Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent" >
      <ul className="navbar-nav mr-auto  mb-2 mb-lg-0">
        <li className="nav-item ">
           
          <Link className="nav-link " aria-current="page" exact to="/" >
            <IconButton>
          <MapsHomeWorkIcon fontSize="inherit" /></IconButton>Home</Link>
        </li>
        <li className="nav-item ">
          <Link className="nav-link" aria-current="page" exact to="/About"> <IconButton>
          <RiFolderInfoFill /></IconButton>About</Link>
        </li>
        
        <li className="nav-item">
              <Link className="nav-link" aria-current="page" exact to="/Contact"><IconButton>
                <ContactMailIcon fontSize='inherit '/></IconButton>
                Contact
              </Link>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" aria-current="page" exact to="/LocationList"><IconButton>
              <IoLocationSharp /></IconButton>
                Cities !
              </NavLink>
            </li>  
            {/* <li className="nav-item">
              <NavLink className="nav-link" aria-current="page" exact to="/SiteList">
                Sites
              </NavLink>
            </li>   */}
            <li className="nav-item">
              <NavLink className="nav-link" aria-current="page" exact to="/RoomsList">
              <IconButton >
             <MeetingRoomSharpIcon fontSize='inherit'/></IconButton>
                Rooms
              </NavLink>
            </li> 
            <li className="nav-item ">
             
            </li>  
            <li className="nav-item">
              <NavLink className="nav-link mr-2" aria-current="page" exact to="/BookingList"><IconButton>
             < SavedSearchIcon/></IconButton>
                Find Bookings
              </NavLink>
              </li> 
      </ul> 
    </div> 
    <Dropdown>
      <Dropdown.Toggle variant="secondary" id="dropdown-basic">
      <TfiMenuAlt />
        MENU
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <DropdownItem>
        <NavLink className="nav-link" exact to="/LocationList"   style={{paddingLeft: '30px'}}>
        <FaMagnifyingGlassLocation />
              City List
      </NavLink>
        </DropdownItem>
        <DropdownItem>
        <NavLink className="nav-link" exact to="/SiteList"   style={{paddingLeft: '30px'}}>
        <BsBuildingsFill />
            Site List
      </NavLink>

        </DropdownItem>
        <DropdownItem>
        <NavLink className="nav-link"   exact to="/FloorsList"style={{paddingLeft: '30px'}}>
        <GrSteps />
                Floors List
              </NavLink>
        </DropdownItem>
      
      <DropdownItem>
      <NavLink className="nav-link" exact to="/RoomsList"  style={{paddingLeft: '30px'}}>
        <Groups3Icon fontSize='inherit'/>
            Rooms List
      </NavLink>
      </DropdownItem>
         
      </Dropdown.Menu>
    </Dropdown> 
     
      
  </div>
 
</nav>
    
  )
}

export default NavBar
 
 
               
             
           
 
