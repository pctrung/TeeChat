import { combineReducers, createSlice } from "@reduxjs/toolkit";

const chats = createSlice({
  name: "chats",
  initialState: [],
  reducers: {
    addChat: (state, action) => {
      var isExists = state.some((chat) => chat.id === action.payload.id);
      if (!isExists) {
        state.push(action.payload);
      }
    },
    editChat: (state, action) => {
      const updatedChat = action.payload;
      const index = state.findIndex((chat) => {
        return chat.id === updatedChat.id;
      });
      if (index >= 0) {
        state[index].name = updatedChat.name;
        state[index].participants = updatedChat.participants;
      }
    },
    editGroupAvatar: (state, action) => {
      const updatedChatId = action.payload.chatId;
      const index = state.findIndex((chat) => {
        return chat.id === updatedChatId;
      });
      if (index >= 0) {
        state[index].groupAvatarUrl = action.payload?.groupAvatarUrl;
      }
    },
    appendMessageToChat: (state, action) => {
      const chatToAppend = action.payload;
      const messagesToAppend = chatToAppend?.messages;
      const index = state.findIndex((chat) => {
        return chat.id === chatToAppend.id;
      });
      if (index >= 0) {
        state[index].totalRecords = chatToAppend.totalRecords;
        state[index].limit = chatToAppend.limit;
        state[index].page = chatToAppend.page;
        state[index].pageCount = chatToAppend.pageCount;
        if (chatToAppend.keyword) {
          state[index].messages = messagesToAppend;
        } else {
          state[index].messages =
            state[index].messages.concat(messagesToAppend);
        }
      }
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
    addNotification: (state, action) => {
      const chatId = action.payload;
      const index = state.findIndex((chat) => {
        return chat.id === chatId;
      });
      if (index >= 0) {
        state[index].numOfUnreadMessages += 1;
      }
    },
    readMessage: (state, action) => {
      const chatId = action.payload;
      const index = state.findIndex((chat) => {
        return chat.id === chatId;
      });
      if (index >= 0) {
        state[index].numOfUnreadMessages = 0;
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

export const {
  addChat,
  editChat,
  refreshChats,
  addMessage,
  appendMessageToChat,
  editGroupAvatar,
  readMessage,
  addNotification,
} = chats.actions;
export const { setSelectedId } = selectedId.actions;
export default reducer;
