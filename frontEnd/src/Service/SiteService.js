import commonURL from "../commonURL";
const addSite = (data) => {
    return commonURL.post("/site/add-site", data);
};
 

const deleteSite = (id) => {
    return commonURL.delete(`/site/delete/${id}`);
};
 
const getSite = (id) => {
    return commonURL.get(`/site/byId/${id}`);
};
 
const loadSites = () => {
    return commonURL.get("site/sitesList");
};
 
const updateSite = (id, data) => {
    return commonURL.put(`/site/update/${id}`, data);
};

const sitesInLocation=(id)=>{
    return commonURL.get(`/site/byLocation/${id}`);
};
const sitesUsingPagination=(params)=>{
    return commonURL.get(`/site/pagination`,{params})
}
 
const SiteServices = {
    addSite,
    deleteSite,
    getSite,
    loadSites,
     sitesInLocation,
    updateSite,
    sitesUsingPagination,
}
 
export default SiteServices;
 