import api from "./api";


  const getDashboard = () => api.get("/admin/dashboard").then((r) => r.data);

  
  // const  getUsers = async(params) =>{
    //    const response = await api.get("/admin/users",  {params});
    //    return response.data;
    // }
  const getUsers = (params) => api.get("/admin/users", { params }).then((r) => r.data);
    
 const  getUserById = (id) => api.get(`/admin/users/${id}`).then((r) => r.data);

  const createUser = (data) => api.post("/admin/users", data).then((r) => r.data);

  const getStores = (params) =>api.get("/admin/stores", { params }).then((r) => r.data);

  const createStore = (data) => api.post("/admin/stores", data).then((r) => r.data);






export const adminApi = {
  getDashboard , getUsers , getUserById , createUser , getStores , createStore

};
