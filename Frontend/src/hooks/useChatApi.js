import { setIsLoading } from "app/appSlice.js";
import { useDispatch } from "react-redux";
import useApi from "./useApi.js";

const baseApiUrl = "/chats";

export default function useChatApi() {
  const Api = useApi();
  const dispatch = useDispatch();

  const chatApi = {
    getAll: () => {
      dispatch(setIsLoading(true));
      const url = `${baseApiUrl}`;
      return Api.get(url);
    },
    getById: (chatId, params) => {
      dispatch(setIsLoading(true));
      const url = `${baseApiUrl}/${chatId}`;
      return Api.get(url, { params });
    },
    sendMessage: (chatId, content) => {
      const url = `${baseApiUrl}/${chatId}/send`;
      return Api.post(url, content);
    },
    readChat: (chatId) => {
      const url = `${baseApiUrl}/${chatId}/read`;
      return Api.patch(url);
    },
    sendImage: (chatId, content) => {
      dispatch(setIsLoading(true));
      const url = `${baseApiUrl}/${chatId}/sendImage`;

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
      return Api.post(url, content);
    },
    updateGroupAvatar: (chatId, content) => {
      dispatch(setIsLoading(true));
      const url = `${baseApiUrl}/${chatId}/avatar`;

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
      return Api.patch(url, content);
    },
    createGroupChat: (content) => {
      content.groupName = content?.groupName?.substring(0, 99);

      dispatch(setIsLoading(true));
      const url = `${baseApiUrl}/group`;
      return Api.post(url, content);
    },
    updateGroupChat: (chatId, content) => {
      content.newGroupName = content?.newGroupName?.substring(0, 99);

      dispatch(setIsLoading(true));
      const url = `${baseApiUrl}/${chatId}`;
      return Api.patch(url, content);
    },
    createPrivateChat: (content) => {
      dispatch(setIsLoading(true));
      const url = `${baseApiUrl}/private`;
      return Api.post(url, content);
    },
  };
  return chatApi;
}
