import commonURL from "../commonURL";

 
 
 
const addLocation = (data) => {
    return commonURL.post("/cities/add-city", data);
};
 
 
 
const deleteLocation = (id) => {
    return commonURL.delete(`/cities/${id}`);
};
const forceDeleteLocation = (id) => {
    return commonURL.delete(`/cities/force/${id}`);
};
 
const getLocation = (id) => {
    return commonURL.get(`/cities/byId/${id}`);
};
 
const loadLocations = () => {
    return commonURL.get("cities/citiesList");
};
 
const updateLocation = (id, data) => {
    return commonURL.put(`/cities/update/${id}`, data);
};
 
const LocationServices = {
    addLocation,
      
    deleteLocation,
    getLocation,
    loadLocations,
    forceDeleteLocation,
     
    updateLocation,
}
 
export default LocationServices;
 