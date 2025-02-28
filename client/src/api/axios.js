import axios from "axios";

const instance = axios.create({
    baseURL:"http://localhost:3000/api",
    withCredentials: true
})

export default instance
// "https://productive-life-api.onrender.com/api"
// "http://localhost:3000/api"