import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import moment from "moment";
import DefaultAvatar from "assets/img/default-avatar.jpg";
import constants from "utils/constants";
import LeftArrowIcon from "assets/icons/left-arrow-icon.svg";
import InfoIcon from "assets/icons/info-icon.svg";
import { setSelectedId } from "app/chatSlice";
import ChatInput from "components/ChatInput";
import ImageCircle from "components/ImageCircle";
import ClickableIcon from "components/ClickableIcon";
import EditChat from "components/EditChat";

function ChatWindow({ chat }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.users.currentUser);

  const [showTimeIndexes, setShowTimeIndexes] = useState([]);
  const [isOpenInfoPopup, setIsOpenInfoPopup] = useState(false);

  let currentUserName = currentUser.userName;

  const friend = chat.participants
    ?.filter((x) => x.userName !== currentUserName)
    .shift();

  function backToChats() {
    const action = setSelectedId(0);
    dispatch(action);
  }

  function handleMessageClick(index) {
    var result = [...showTimeIndexes];
    const i = result.findIndex((x) => x === index);
    if (i >= 0) {
      result = result.filter((x) => x !== index);
    } else {
      result.push(index);
    }
    setShowTimeIndexes(result);
  }

  return (
    <>
      <EditChat
        isOpen={isOpenInfoPopup}
        setIsOpen={setIsOpenInfoPopup}
        chat={chat}
      />
      <div className="flex flex-col w-full h-full pb-4">
        {/* Header chat window */}
        <div className="w-full border-b-2 border-gray-200 flex justify-between items-center md:p-4 p-3">
          <div className="flex justify-between items-center space-x-3">
            <img
              src={LeftArrowIcon}
              alt="Arrow icon"
              className="h-5 w-5 md:hidden cursor-pointer"
              onClick={backToChats}
            />
            <ImageCircle src={friend?.avatarUrl} />
            <span className="text-lg font-semibold truncate w-60 md:w-96">
              {chat.type === constants.chatType.PRIVATE
                ? friend?.fullName
                : chat.name ?? constants.NO_NAME_GROUP}
            </span>
          </div>
          <ClickableIcon
            className="h-10 w-10 p-2 mr-2"
            icon={InfoIcon}
            onClick={() => setIsOpenInfoPopup(!isOpenInfoPopup)}
          />
        </div>
        {/* End header chat window */}

        {/* Chat content */}
        <div className="flex-grow overflow-y-auto h-full px-4 pb-4 pt-2 space-y-1 flex flex-col justify-end ">
          {chat.messages?.map((message, index) =>
            message.senderUserName === currentUser.userName ? (
              <div
                key={index + Math.random()}
                className="flex flex-col items-end"
              >
                {showTimeIndexes.includes(index) ? (
                  <>
                    <span className="transition-all animate-fade text-sm text-gray-400 left-0 bottom-full mb-1 ml-1 space-x-2 md:w-80 w-60 truncate overflow-ellipsis text-right">
                      {moment(
                        new Date(message.dateCreated),
                        "YYYYMMDD",
                      ).calendar() ?? ""}
                    </span>
                    <span
                      onClick={() => handleMessageClick(index)}
                      className="bg-green-600 text-white rounded-3xl px-4 py-2
                break-all rounded-br-none cursor-pointer"
                    >
                      {message.content}
                    </span>
                  </>
                ) : (
                  <span
                    onClick={() => handleMessageClick(index)}
                    className="bg-green-500 text-white rounded-3xl px-4 py-2
                break-all rounded-br-none cursor-pointer"
                  >
                    {message.content}
                  </span>
                )}
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
                <div className="flex flex-col items-start">
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

        <ChatInput chatId={chat.id} />
      </div>
    </>
  );
}

export default ChatWindow;
