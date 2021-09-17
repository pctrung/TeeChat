import { setIsLoading } from "app/appSlice.js";
import { useDispatch } from "react-redux";
import useApi from "./useApi.js";

const baseApiUrl = "/users";

export default function useUserApi() {
  const Api = useApi();
  const dispatch = useDispatch();

  const userApi = {
    login: (content) => {
      dispatch(setIsLoading(true));
      const url = `${baseApiUrl}/login`;
      return Api.post(url, content);
    },
    register: (content) => {
      content.firstName = content?.firstName?.substring(0, 49);
      content.lastName = content?.lastName?.substring(0, 49);

      dispatch(setIsLoading(true));
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
      dispatch(setIsLoading(true));
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
  return userApi;
}
