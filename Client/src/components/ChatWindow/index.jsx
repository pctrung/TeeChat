import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import moment from "moment";
import DefaultAvatar from "assets/img/default-avatar.jpg";
import currentUser from "utils/currentUser";
import constants from "utils/constants";
import LeftArrowIcon from "assets/icons/left-arrow-icon.svg";
import SendIconNormal from "assets/icons/send-icon.svg";
import { setSelectedId } from "app/chatSlice";
import ClickableIcon from "components/ClickableIcon";
import chatApi from "api/chatApi";

function ChatWindow({ chat }) {
  const dispatch = useDispatch();

  const [content, setContent] = useState("");
  const [isShowTime, setIsShowTime] = useState(false);

  const currentUserName = currentUser.userName;
  const friend = chat.participants
    ?.filter((x) => x.userName !== currentUserName)
    .shift();

  function backToChats() {
    const action = setSelectedId(0);
    dispatch(action);
  }
  async function onSendMessage(e) {
    e.preventDefault();
    if (!content) {
      return;
    }

    var request = { content };
    await chatApi.sendMessageAsync(chat.id, request);

    setContent("");
  }

  return (
    <div className="flex flex-col w-full h-screen pb-4 ">
      {/* Header chat window */}
      <div className="w-full h-20 border-b-2 border-gray-200 flex justify-between items-center px-4 ">
        <div className="flex justify-between items-center space-x-3">
          <img
            src={LeftArrowIcon}
            alt="Arrow icon"
            className="h-5 w-5 md:hidden text-green-500 cursor-pointer"
            onClick={backToChats}
          />
          <img
            src={friend?.avatarUrl ?? DefaultAvatar}
            alt="Avatar"
            className="h-12 w-12 rounded-full object-cover"
          />
          <span className="text-lg font-semibold truncate w-60 md:w-96">
            {chat.type === constants.chatType.PRIVATE
              ? friend?.fullName
              : chat.name ?? constants.NO_NAME_GROUP}
          </span>
        </div>
      </div>
      {/* End header chat window */}

      {/* Chat content */}
      <div className="overflow-y-scroll flex-grow  px-4 pb-4 pt-2 space-y-1 flex flex-col justify-end">
        {chat.messages?.map((message, index) =>
          message.senderUserName === currentUser.userName ? (
            <div
              key={index + Math.random()}
              className="flex flex-col items-end"
            >
              {isShowTime && (
                <span className="transition-all animate-fade text-sm text-gray-400 left-0 bottom-full mb-1 ml-1 space-x-2 md:w-80 w-60 truncate overflow-ellipsis text-right">
                  {moment(
                    new Date(message.dateCreated),
                    "YYYYMMDD",
                  ).calendar() ?? ""}
                </span>
              )}
              <span
                onClick={() => setIsShowTime(!isShowTime)}
                className="bg-green-500 text-white rounded-3xl px-4 py-2
                break-all rounded-br-none"
              >
                {message.content}
              </span>
            </div>
          ) : (
            <div
              key={index + Math.random()}
              className="flex items-end space-x-2"
            >
              <img
                src={message.senderAvatarUrl ?? DefaultAvatar}
                alt="Avatar"
                className="h-8 w-8 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <span className="text-sm text-gray-400 left-0 bottom-full mb-1 ml-1 space-x-2 md:w-80 w-60 truncate overflow-ellipsis">
                  {message.senderFullName +
                    " - " +
                    moment(
                      new Date(message.dateCreated),
                      "YYYYMMDD",
                    ).calendar() ?? ""}
                </span>
                <span className="bg-gray-200 rounded-3xl px-4 py-2 break-all rounded-bl-none">
                  {message.content}
                </span>
              </div>
            </div>
          ),
        )}
      </div>
      {/* End chat content */}

      {/* Chat input */}
      <form
        onSubmit={(e) => onSendMessage(e)}
        className="flex justify-between items-center space-x-5 pl-4 pr-6"
      >
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          type="text"
          placeholder="Aa"
          className="bg-gray-200 rounded-3xl w-full py-2 px-4 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 outline-none transition-all duration-200"
        />
        <ClickableIcon icon={SendIconNormal} className="w-12 h-12 p-3" />
      </form>

      {/* End chat input */}
    </div>
  );
}

export default ChatWindow;