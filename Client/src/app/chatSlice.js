import { combineReducers, createSlice } from "@reduxjs/toolkit";

const chats = createSlice({
  name: "chats",
  initialState: [],
  reducers: {
    addChat: (state, action) => {
      state.push(action.payload);
    },
    refreshChats: (state, action) => {
      state = action.payload;
      return state;
    },
    addMessage: (state, action) => {
      const newMessage = action.payload;
      const index = state.findIndex((chat) => {
        return chat.id === newMessage.chatId;
      });
      if (index >= 0) {
        state[index].messages.push(newMessage?.message);
      }
    },
  },
});

const selectedId = createSlice({
  name: "selectedId",
  initialState: 0,
  reducers: {
    setSelectedId: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});

const reducer = combineReducers({
  chats: chats.reducer,
  selectedId: selectedId.reducer,
});

export const { addChat, refreshChats, addMessage } = chats.actions;
export const { setSelectedId } = selectedId.actions;
export default reducer;
