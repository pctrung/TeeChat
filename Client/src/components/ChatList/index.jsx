import React, { useState } from "react";
import moment from "moment";
import constants from "utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedId } from "app/chatSlice";
import ImageCircle from "components/ImageCircle";

function ChatList() {
  const chats = useSelector((state) => state.chats.chats);
  const selectedId = useSelector((state) => state.chats.selectedId);
  const currentUser = useSelector((state) => state.users.currentUser);
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
          getCurrentChats(chats, keyword).map((chat, index) => {
            const currentUserName = currentUser.userName;
            const friend = chat.participants
              ?.filter((x) => x.userName !== currentUserName)
              .shift();

            let lastMessage = {};
            if (chat.messages?.length !== 0) {
              lastMessage = chat.messages?.reduce((a, b) =>
                a.dateCreated > b.dateCreated ? a : b,
              );
            }
            return (
              <div
                key={Date.now() + index}
                className={
                  "select-none w-full h-20 flex flex-start cursor-pointer hover:bg-gray-100  p-2 rounded-2xl transition-all duration-300 ease-in " +
                  (selectedId === chat.id ? "bg-gray-100" : "")
                }
                onClick={() => handleClick(chat.id)}
              >
                <ImageCircle
                  src={chat.groupAvatarUrl ?? friend.avatarUrl}
                  size="full"
                />

                <div className="font-primary flex flex-col px-3 py-2 justify-between truncate">
                  <span className="text-gray-800 truncate">
                    {chat.type === constants.chatType.PRIVATE
                      ? friend?.fullName
                      : chat.name ?? constants.NO_NAME_GROUP}
                  </span>
                  <span className="text-sm text-gray-500 truncate">
                    {(lastMessage.content ? lastMessage.content + " • " : "") +
                      moment(
                        new Date(lastMessage.dateCreated ?? chat.dateCreated),
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

function getCurrentChats(chats, keyword) {
  var result = sortChat(chats);
  result = searchChat(result, keyword);
  return result;
}

function sortChat(chats) {
  if (chats) {
    return [...chats].sort((chatA, chatB) => {
      let lastMessageA = {};
      let lastMessageB = {};
      // check if chat no message => return date created of chat
      if (chatA.messages?.length !== 0) {
        lastMessageA = chatA.messages?.reduce((a, b) => {
          return a.dateCreated > b.dateCreated ? a : b;
        });
      } else {
        lastMessageA.dateCreated = chatA.dateCreated;
      }
      if (chatB.messages?.length !== 0) {
        lastMessageB = chatB.messages?.reduce((a, b) =>
          a.dateCreated > b.dateCreated ? a : b,
        );
      } else {
        lastMessageB.dateCreated = chatB.dateCreated;
      }
      if (lastMessageA?.dateCreated < lastMessageB?.dateCreated) {
        return 1;
      } else {
        return -1;
      }
    });
  }
}

function searchChat(chats, keyword) {
  if (chats) {
    return chats.filter((chat) => {
      let isValid = chat.participants.some((x) => {
        if (x.fullName.toLowerCase().includes(keyword.toLowerCase())) {
          return true;
        }
        return false;
      });
      return (
        isValid || chat.name?.toLowerCase().includes(keyword.toLowerCase())
      );
    });
  }
}
