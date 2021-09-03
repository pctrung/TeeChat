import Api from "./Api.js";

const baseApiUrl = "/users";

const userApi = {
  loginAsync: async (content) => {
    const url = `${baseApiUrl}/login`;
    var result = await Api.post(url, content);
    return result;
  },
};

export default userApi;
