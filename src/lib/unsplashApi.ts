import axios from "axios";

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

console.log(UNSPLASH_ACCESS_KEY);

const unsplashApi = axios.create({
  baseURL: "https://api.unsplash.com/",
  headers: {
    "Accept-version": "v1",
    Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
  },
});

export default unsplashApi;
