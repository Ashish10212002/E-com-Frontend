import axios from "axios";

// Check if the browser is running locally
const isLocal = window.location.hostname === "localhost";

const API = axios.create({
  // If local, use localhost:8080. If deployed, use Render.
  baseURL: isLocal 
    ? "http://localhost:8080/api" 
    : "https://e-com-webapp.onrender.com/api",
});
// baseURL: "https://e-com-webapp.onrender.com/api",
// });
delete API.defaults.headers.common["Authorization"];

export default API;