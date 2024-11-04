import axios from "axios";

const api = axios.create({
  // baseURL: "//localhost:3000/api", // for development
  baseURL: "http://3.64.123.41:3000/api",
  // process.env.NODE_ENV === "production" ? "/http://3.64.123.41:3000/api" : "//localhost:3000/api",
  // process.env.NODE_ENV === "production" ? "/api" : "//localhost:3000/api",
});

api.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("jwt-trello_clone") || null;
    // removing the first and last character of the token, which are quotes

    if (token) {
      token = token?.slice(1, -1);
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
