const DefaultName = {
  NO_NAME_GROUP: "No name",
  NO_NAME_USER: "Unknown",
};

const ChatType = {
  PRIVATE: 1,
  GROUP: 2,
};

const ChatClient = {
  RECEIVE_MESSAGE: "ReceiveMessage",
  RECEIVE_CHAT: "ReceiveChat",
  RECEIVE_UPDATED_CHAT: "ReceiveUpdatedChat",
  RECEIVE_UPDATED_GROUP_AVATAR: "ReceiveUpdatedGroupAvatar",
  RECEIVE_ADD_READ_BY_USERNAME: "ReceiveAddReadByUserName",
  RECEIVE_UPDATED_ONLINE_USERNAME_LIST: "ReceiveUpdatedOnlineUserNameList",
};

export { ChatType, DefaultName, ChatClient };
