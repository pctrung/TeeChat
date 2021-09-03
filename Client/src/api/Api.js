import axios from "axios";
import queryString from "query-string";

const Api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

Api.interceptors.request.use(async (config) => {
  var token = window.localStorage.getItem("token");

  var newConfig = config;
  if (token) {
    newConfig = {
      ...config,
      headers: { Authorization: `Bearer ${token}` },
    };
  }
  return newConfig;
});
Api.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
  },
  (error) => {
    console.log(error.data);
    if (error.response) {
      switch (error.response.status) {
        case 401:
          window.location.href = "/login";
          break;
        case 403:
          window.location.href = "/ForBid";
          break;
        case 404:
          window.location.href = "/NotFound";
          break;
        default:
          window.location.href = "/NotFound";
      }
    }
    if (error.response && !error.response.data) {
      switch (error.response.status) {
        case 401:
          error.response.data = "You must be logged in to system";
          break;
        case 403:
          error.response.data = "You are not allowed to access";
          break;
        case 404:
          error.response.data = "Not found resources";
          break;
        default:
          error.response.data = "Something went wrong!";
      }
    }
    if (error.response) {
      return Promise.reject(error.response);
    } else {
      window.location.href = "/ServerError";
    }
  },
);

export default Api;
