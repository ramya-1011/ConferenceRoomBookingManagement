import React from 'react';
 
import img1 from "../carouselImages/img1.png"; 
 
const Slider = () => {
  return (
    <div>
      <div id="carouselExampleCaptions" className="carousel slide"   >
   
  <div className="carousel-inner">
    <div className="carousel-item active">
      <img src={img1} className="d-block w-100 "  alt="..." height="575"/>
      <div className="carousel-caption d-none d-md-block">
        <h4>Optum Conference Rooms</h4>
        <p> Find the perfect Space for your Next meeting....!</p>
      </div>
    </div>
     
  </div>
  
</div>
    </div>
  )
}

export default Slider
