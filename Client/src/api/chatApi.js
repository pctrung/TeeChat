import Api from "./Api.js";

const baseApiUrl = "/chats";

const chatApi = {
  getAll: () => {
    const url = `${baseApiUrl}`;
    return Api.get(url);
  },
  getById: (chatId, params) => {
    const url = `${baseApiUrl}/${chatId}`;
    return Api.get(url, { params });
  },
  sendMessage: (chatId, content) => {
    const url = `${baseApiUrl}/${chatId}/send`;
    return Api.post(url, content);
  },
  sendImage: (chatId, content) => {
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
    const url = `${baseApiUrl}/group`;
    return Api.post(url, content);
  },
  updateGroupChat: (chatId, content) => {
    const url = `${baseApiUrl}/${chatId}`;
    return Api.patch(url, content);
  },
  createPrivateChat: (content) => {
    const url = `${baseApiUrl}/private`;
    return Api.post(url, content);
  },
};

export default chatApi;
