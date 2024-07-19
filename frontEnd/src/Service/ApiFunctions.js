 import axios from 'axios'
   

  class ApiService{
 
   
      async addLocation(locationData) { 
  try {
    const response = await axios.post(` http://localhost:8080/cities/add-city`, locationData, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
} catch (error) {
    throw new Error(`Failed to add location: ${error.message}`);
}
}
async getRoomTypes(){
  try {
    const response=await axios.get(' http://localhost:8080/rooms/types',{
      headers: {
        'Content-Type': 'application/json'
    }
    });
    return response.data;
    
  } catch (error) {
    throw new Error(`Failed to fetch types: ${error.message}`);
  }
}
async addBooking(id,bookingData) { 
  try {
    const response = await axios.post(`http://localhost:8080/booking/book-room/${id}`,bookingData, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
} catch (error) {
    throw new Error(`Failed to add booking: ${error.message}`);
}
}
async addRoom(roomData) { 
  try {
    const response = await axios.post(`http://localhost:8080/rooms/add-room`,roomData, {
      
        headers: {
            'Content-Type': 'application/json' 
              
        } 
    });
    return response.data;
} catch (error) {
    throw new Error(`Failed to add booking: ${error.message}`);
}}
async getRoomById(roomId){
  try{
    const response=await axios.get(`http://localhost:8080/rooms/room-by-id/${roomId}`,{
      headers: {
        'Content-Type': 'application/json',
          
    }
    });
    return response.data;
  }catch (error) {
    throw new Error(`Failed to get room: ${error.message}`);
}
}
   
 
  }

  // fetch('https://example.com/', {
  //   method: 'POST',
  //   headers: {'Content-Type': 'text/plain', },
  //  body:JSON.stringify(sampledata),
  // }).then(result => console.log('success====:', result))
  //   .catch(error => console.log('error============:', error));




 export default new ApiService();