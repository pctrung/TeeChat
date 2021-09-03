import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "app/chatSlice";
import appReducer from "app/appSlice";

const rootReducer = {
  chats: chatReducer,
  app: appReducer,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
