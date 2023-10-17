import axios from "axios";

const con=process.env.REACT_APP_API;
  console.log(con, '7');
const API = axios.create({
    baseURL: 'http://localhost:8000/',
    withCredentials:true,
})
API.defaults.withCredentials = true;
export default API
