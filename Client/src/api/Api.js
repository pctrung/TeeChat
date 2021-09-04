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
    return response;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          window.location.href = "/login";
          break;
        case 403:
          window.location.href = "/ForBid";
          break;
      }
    }
    console.error(error?.response);
    return Promise.reject(error?.response?.data);
  },
);

export default Api;
