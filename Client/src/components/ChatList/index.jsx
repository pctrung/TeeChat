import React, { useEffect, useState } from "react";
import moment from "moment";
import currentUser from "utils/currentUser";
import DefaultAvatar from "assets/img/default-avatar.jpg";
import constants from "utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedId } from "app/chatSlice";

function ChatList() {
  const chats = useSelector((state) => state.chats.chats);
  const selectedId = useSelector((state) => state.chats.selectedId);
  const dispatch = useDispatch();

  const [keyword, setKeyword] = useState("");

  function handleClick(id) {
    if (id !== selectedId) {
      const action = setSelectedId(id);
      dispatch(action);
    }
  }

  return (
    <>
      <input
        type="search"
        className="my-3 rounded-3xl bg-gray-100 px-4 py-2 focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 outline-none transition-all duration-200 w-full"
        placeholder="Search user"
        onChange={(e) => setKeyword(e.target.value)}
      />
      <div className="h-full space-y-2 overflow-y-auto">
        {chats &&
          [...chats]
            .sort((chatA, chatB) => {
              const lastMessageA = chatA.messages.reduce((a, b) =>
                a.dateCreated > b.dateCreated ? a : b,
              );
              const lastMessageB = chatB.messages.reduce((a, b) =>
                a.dateCreated > b.dateCreated ? a : b,
              );
              if (lastMessageA.dateCreated < lastMessageB.dateCreated) {
                return 1;
              } else {
                return -1;
              }
            })
            .filter((chat) => {
              let isValid = chat.participants.some((x) => {
                if (x.fullName.toLowerCase().includes(keyword.toLowerCase())) {
                  return true;
                }
                return false;
              });
              return (
                isValid ||
                chat.name?.toLowerCase().includes(keyword.toLowerCase())
              );
            })
            .map((chat, index) => {
              const currentUserName = currentUser.userName;
              const friend = chat.participants
                ?.filter((x) => x.userName !== currentUserName)
                .shift();

              const lastMessage = chat.messages.reduce((a, b) =>
                a.dateCreated > b.dateCreated ? a : b,
              );
              return (
                <div
                  key={Date.now() + index}
                  className={
                    "select-none w-full h-20 flex flex-start cursor-pointer hover:bg-gray-100  p-2 rounded-2xl transition-all duration-300 ease-in " +
                    (selectedId === chat.id ? "bg-gray-100" : "")
                  }
                  onClick={() => handleClick(chat.id)}
                >
                  <img
                    src={friend.avatarUrl ?? DefaultAvatar}
                    alt={friend?.fullName + " avatar"}
                    className="h-full rounded-full"
                  />
                  <div className="font-primary flex flex-col px-3 py-2 justify-between truncate">
                    <span className="text-gray-800 truncate">
                      {chat.type === constants.chatType.PRIVATE
                        ? friend?.fullName
                        : chat.name ?? constants.NO_NAME_GROUP}
                    </span>
                    <span className="text-sm text-gray-500 truncate">
                      {lastMessage.content +
                        " • " +
                        moment(
                          new Date(lastMessage.dateCreated),
                          "YYYYMMDD",
                        ).fromNow()}
                    </span>
                  </div>
                </div>
              );
            })}
      </div>
    </>
  );
}

export default ChatList;
