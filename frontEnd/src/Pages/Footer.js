 
import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <section className='section footer bg-dark text-white' >
        <div className='container'>
            <div className='row'>
                <div className='col-md-4'>
                    <h6> Comany Information</h6>
                    <hr/>
                    <p>we provide solutions for hustle free booking of meetings rooms in our company all across the country.
                        A one-stop solution for your conference, meetings , sessions,events!!
                    </p>
                </div>
                <div className='col-md-4'>
                    <h6> Quick Links</h6>
                    <hr/>
                    <div> <Link to="/" > Home</Link></div>
                    <div> <Link to="/about" > About</Link></div>
                    <div> <Link to="/Contact" > Contact Us</Link></div>
                    <div> <Link to="/LocationList" >Location</Link></div>
                </div>
                <div className='col-md-4'>
                    <h6> Contact Information</h6>
                    <hr/>
                    <div className='text-white mb-1'> Gurgaon Haryana </div>
                    <div className='text-white mb-1'> Hyderabad Telangana </div>
                    <div className='text-white mb-1'> Banglore Karnataka </div>
                     
                </div>
            </div>

        </div>
    </section>
  )
}

export default Footer
