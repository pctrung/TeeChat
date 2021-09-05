import Api from "./Api.js";

const baseApiUrl = "/users";

const userApi = {
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
};

export default userApi;
