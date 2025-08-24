import axios from "axios";

const API = axios.create({
    baseURL: "http://192.168.1.81:3000",
    timeout: 5000,
});

export default API;

