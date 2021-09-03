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
  },
});

const reducer = combineReducers({
  currentUser: currentUser.reducer,
});

export const { getCurrentUser } = currentUser.actions;
export default reducer;

function decodeCurrentUser() {
  var token = window.localStorage.getItem("token");
  if (token) {
    const user = jwt(token);
    return user;
  }
  return false;
}