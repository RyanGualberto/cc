import axios from "axios";
import { parseCookies } from "nookies";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const { token } = parseCookies();

  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
  }

  return config;
});

export default apiClient;
