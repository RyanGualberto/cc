import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://recebee.local:3000",
  headers: {
    "Content-type": "application/json"
  }
});

export default apiClient;