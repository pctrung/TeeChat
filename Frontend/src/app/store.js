import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "app/chatSlice";
import appReducer from "app/appSlice";
import userReducer from "app/userSlice";

const rootReducer = {
  chats: chatReducer,
  app: appReducer,
  users: userReducer,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
