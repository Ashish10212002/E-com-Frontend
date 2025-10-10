import axios from "axios";

const API = axios.create({
  baseURL: "/api",
});
delete API.defaults.headers.common["Authorization"];
export default API;
