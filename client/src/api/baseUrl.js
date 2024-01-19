import axios from "axios";

const base = 'http://localhost:3000/api'

const baseUrl = axios.create({
    baseURL:base,
    timeout:5000
})

export default baseUrl