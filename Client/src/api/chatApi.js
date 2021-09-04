import Api from "./Api.js";

const baseApiUrl = "/chats";

const chatApi = {
  getAll: () => {
    const url = `${baseApiUrl}`;
    return Api.get(url);
  },
  sendMessage: (chatId, content) => {
    const url = `${baseApiUrl}/${chatId}/send`;
    return Api.post(url, content);
  },
};

export default chatApi;
