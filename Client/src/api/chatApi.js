import Api from "./Api.js";

const baseApiUrl = "/chats";

const chatApi = {
  getAllAsync: async () => {
    const url = `${baseApiUrl}`;
    var result = await Api.get(url);
    return result;
  },
  sendMessageAsync: async (chatId, content) => {
    const url = `${baseApiUrl}/${chatId}/send`;
    var result = await Api.post(url, content);
    return result;
  },
};

export default chatApi;
