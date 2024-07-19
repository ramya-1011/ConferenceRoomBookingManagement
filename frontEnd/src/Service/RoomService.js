import commonURL from "../commonURL"; 
 
const addRoom = (data) => {
    return commonURL.post(`/rooms/add-room`, data);
};
 
const addBooking = (data) => {
    return commonURL.post(`/booking/book-room`, data);
};
 
const deleteRoom = (id) => {
    return commonURL.delete(`/rooms/delete/${id}`);
};
    
const getAllRooms= () => {
    return commonURL.get("/rooms/allRooms");
};
 
const getRoom = (id) => {
    return commonURL.get(`/rooms/room-by-id/${id}`);
};
 
const updateRoom = (id, data) => {
    return commonURL.put(`/rooms/update/${id}`, data);
};
 
const getRoomsByFilter = (cityId, siteId,floorId) => {
    return commonURL.get(`/rooms/filter?cityId=${cityId}&siteId=${siteId}&floorId=${floorId}`);
};
const checkBookings=(id)=>{
    return commonURL.get(`/rooms/${id}/check-bookings`)
}
 
const RoomServices = {
    addRoom,
    addBooking,
    deleteRoom,
    getRoom,
    updateRoom,
    getRoomsByFilter,
    getAllRooms,
    checkBookings
}
 
export default RoomServices;