import axios, { AxiosInstance } from "axios";

// Create a new Axios instance
const instance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT, // Replace with your API base URL
  timeout: 5000, // Set a timeout value if needed
  headers: {
    "Content-Type": "application/json", // Set your desired headers
  },
});

export default instance;
