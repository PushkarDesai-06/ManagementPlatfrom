import Axios from "axios";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const axios = Axios.create({
  baseURL: backendURL,
  withCredentials: true,
});

export default axios;
