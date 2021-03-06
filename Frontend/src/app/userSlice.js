import { combineReducers, createSlice } from "@reduxjs/toolkit";
import jwt from "jwt-decode";

const currentUser = createSlice({
  name: "currentUser",
  initialState: {},
  reducers: {
    getCurrentUser: (state, action) => {
      var user = decodeCurrentUser();
      if (user) {
        state = user;
        return state;
      }
    },
    updateUser: (state, action) => {
      if (action.payload.userName) {
        state = action.payload;
        return state;
      }
    },
  },
});

const onlineUserNameList = createSlice({
  name: "onlineUserNameList",
  initialState: [],
  reducers: {
    updateOnlineUserNameList: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});

const reducer = combineReducers({
  currentUser: currentUser.reducer,
  onlineUserNameList: onlineUserNameList.reducer,
});

export const { getCurrentUser, updateUser } = currentUser.actions;
export const { updateOnlineUserNameList } = onlineUserNameList.actions;
export default reducer;

function decodeCurrentUser() {
  var token = window.localStorage.getItem("token");
  if (token) {
    const user = jwt(token);
    return user;
  }
  return false;
}
