import jwt from "jwt-decode";
import Api from "./Api.js";

const baseApiUrl = "/users";

const userApi = {
  isLogin: () => {
    var token = window.localStorage.getItem("token");
    if (token && typeof token !== "undefined") {
      if (jwt(token).exp < Date.now() / 1000) {
        localStorage.clear();
        return true;
      }
      return false;
    }
    return false;
  },
  login: (content) => {
    const url = `${baseApiUrl}/login`;
    return Api.post(url, content);
  },
  register: (content) => {
    const url = `${baseApiUrl}/register`;
    return Api.post(url, content);
  },
  checkUserNameExists: (userName) => {
    if (userName) {
      const url = `${baseApiUrl}/${userName}/isExists`;
      return Api.get(url);
    }
    return Promise.reject();
  },
  getFriendList: () => {
    const url = `${baseApiUrl}`;
    return Api.get(url);
  },
  getCurrentUser: () => {
    const url = `${baseApiUrl}/current`;
    return Api.get(url);
  },
  updateUser: (content) => {
    const url = `${baseApiUrl}`;
    Api.interceptors.request.use(async (config) => {
      var token = window.localStorage.getItem("token");
      var newConfig = {};
      if (token) {
        newConfig = {
          ...config,
          headers: {
            "content-type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        };
      }
      return newConfig;
    });
    return Api.put(url, content);
  },
};

export default userApi;
