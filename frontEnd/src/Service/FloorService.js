import commonURL from "../commonURL";
const addFloor = (data) => {
    return commonURL.post("/floor/add", data);
};
 

const deleteFloor = (id) => {
    return commonURL.delete(`/floor/force/${id}`);
};
 
const getFloor = (id) => {
    return commonURL.get(`/floor/byId/${id}`);
};
 
const loadFloors = () => {
    return commonURL.get("floor/getAll");
};
const floorsBySite=(id)=>{
    return commonURL.get(`/floor/getBySite/${id}`);
};
const getFloorsByFilter = (cityId, siteId) => {
    return commonURL.get(`/floor/filter?cityId=${cityId}&siteId=${siteId}`);
};
 
const updateFloor = (id, data) => {
    return commonURL.put(`/floor/update/${id}`, data);
};
 
const FloorServices = {
    addFloor,
      getFloorsByFilter,
    deleteFloor,
    getFloor,
    loadFloors,
     floorsBySite,
    updateFloor,
}
 
export default FloorServices;