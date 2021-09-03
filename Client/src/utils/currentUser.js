import jwt from "jwt-decode";

const currentUser = {
  userName: getUserName(),
  avatarUrl: getAvatarUrl(),
};

function getUserName() {
  var user = getCurrentUser();
  if (user) {
    return user.UserName;
  }
}

function getAvatarUrl() {
  var user = getCurrentUser();
  if (user) {
    return user.avatarUrl;
  }
}

function getCurrentUser() {
  var token = window.localStorage.getItem("token");
  if (token) {
    const user = jwt(token);
    return user;
  }
  return false;
}

export default currentUser;
