// src/axios.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://e-com-webapp.onrender.com/api", // <- your deployed backend
});

delete API.defaults.headers.common["Authorization"];

export default API;
