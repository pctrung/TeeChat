import { appendMessageToChat, readMessage, setSelectedId } from "app/chatSlice";
import InfoIcon from "assets/icons/info-icon.svg";
import LeftArrowIcon from "assets/icons/left-arrow-icon.svg";
import ChatInput from "components/ChatInput";
import ClickableIcon from "components/ClickableIcon";
import EditChat from "components/EditChat";
import ImageCircle from "components/ImageCircle";
import useChatApi from "hooks/useChatApi";
import useMessagePagination from "hooks/useMessagePagination";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import constants from "utils/constants";

function ChatWindow({ chat }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.users.currentUser);
  const chatApi = useChatApi();

  const [showTimeIndexes, setShowTimeIndexes] = useState([]);
  const [isOpenInfoPopup, setIsOpenInfoPopup] = useState(false);

  let currentUserName = currentUser.userName;

  const friend =
    chat?.participants.length > 1
      ? chat?.participants
          ?.filter((x) => x.userName !== currentUserName)
          .shift()
      : currentUser;

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

  // infinity scrolling
  const [page, setPage] = useState(1);
  const { appendChat, hasMore, loading, error } = useMessagePagination(
    chat,
    page,
  );
  const endMessageRef = useRef();

  useEffect(() => {
    if (chat?.numOfUnreadMessages > 0) {
      chatApi.readMessage(chat.id).then((res) => {
        dispatch(readMessage(chat.id));
      });
    }
  }, [chat]);

  useEffect(() => {
    dispatch(appendMessageToChat(appendChat));
  }, [appendChat]);

  const scrollToBottom = () => {
    if (endMessageRef) {
      endMessageRef.current.scrollIntoView();
    }
  };

  useEffect(() => {
    if (chat.page < 2) {
      scrollToBottom();
    }
  }, [chat]);

  function loadMore() {
    if (page < chat.pageCount) {
      setPage((prevPage) => prevPage + 1);
    }
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
        <div className="w-full border-b border-gray-300 dark:border-dark-third flex justify-between items-center md:p-4 md:py-7 p-3 py-5 overflow-hidden">
          <div className="flex min-w-0 justify-start items-center space-x-3">
            <img
              src={LeftArrowIcon}
              alt="Arrow icon"
              className="h-5 w-5 md:hidden cursor-pointer"
              onClick={backToChats}
            />
            <ImageCircle
              src={
                chat?.groupAvatarUrl !== ""
                  ? chat?.groupAvatarUrl
                  : friend?.avatarUrl
              }
            />
            <span className="text-lg font-semibold dark:text-dark-txt truncate overflow-hidden">
              {chat?.type === constants.chatType.PRIVATE
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
        <div className="flex-grow overflow-y-auto overflow-x-hidden px-4 pb-4 pt-2 space-y-1 flex flex-col">
          {loading && (
            <div className="text-gray-500 text-center my-2">Loading...</div>
          )}
          {hasMore && !loading && (
            <div className="flex">
              <button
                className="mx-auto px-4 bg-gray-200 py-2 rounded-lg transform active:scale-95 hover:bg-gray-300 dark:hover:bg-dark-hover dark:bg-dark-third dark:text-gray-300 text-xs md:text-sm transition-all duration-200"
                onClick={loadMore}
              >
                Load more messages...
              </button>
            </div>
          )}
          {!hasMore && (
            <div className="text-gray-500 text-xs md:text-sm text-center mb-2">
              Date created:{" "}
              {moment(new Date(chat.dateCreated), "YYYYMMDD").format(
                "MMMM Do YYYY, h:mm:ss a",
              )}
            </div>
          )}
          <div>{error && "Error"}</div>
          {[...chat.messages]
            ?.sort((messageA, messageB) => {
              return messageA.dateCreated > messageB.dateCreated ? 1 : -1;
            })
            .map((message, index) =>
              message.senderUserName === currentUser.userName ? (
                <>
                  <div
                    key={index + Math.random()}
                    className="flex flex-col items-end w-full"
                  >
                    {showTimeIndexes.includes(index) && (
                      <span className="transition-all animate-fade text-xs md:text-sm text-gray-400 left-0 bottom-full mb-1 ml-1 space-x-2 md:w-80 w-60 truncate overflow-ellipsis text-right">
                        {moment(
                          new Date(message.dateCreated),
                          "YYYYMMDD",
                        ).calendar() ?? ""}
                      </span>
                    )}
                    {message.imageUrl ? (
                      <img
                        onClick={() => handleMessageClick(index)}
                        className="md:max-w-300 max-w-200 rounded-lg shadow transition-all duration-200 cursor-pointer"
                        src={message.imageUrl}
                        alt="Message"
                      />
                    ) : (
                      <span
                        onClick={() => handleMessageClick(index)}
                        className={
                          "text-white rounded-3xl md:px-5 md:py-3 px-3 py-2 break-word rounded-br-none cursor-pointer overflow-x-auto max-w-3/4 text-sm md:text-base" +
                          " " +
                          (showTimeIndexes.includes(index)
                            ? "bg-green-600 dark:bg-green-800"
                            : "bg-gradient-to-br from-green-400 to-green-600 dark:from-green-500 dark:to-green-800 shadow-md")
                        }
                      >
                        {message.content}
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <div
                  key={index + Math.random()}
                  className="flex items-end space-x-2"
                >
                  <ImageCircle
                    src={
                      chat?.participants
                        .filter((x) => x.userName === message.senderUserName)
                        .shift()?.avatarUrl
                    }
                    size="sm"
                  />
                  <div className="flex flex-col w-full items-start">
                    {(showTimeIndexes.includes(index) ||
                      chat?.type === constants.chatType.GROUP) && (
                      <span className="transition-all animate-fade text-xs md:text-sm text-gray-400 bottom-full mb-1 ml-1 space-x-2 md:w-80 w-60 truncate overflow-ellipsis text-left">
                        {message.senderFullName +
                          " - " +
                          moment(
                            new Date(message.dateCreated),
                            "YYYYMMDD",
                          ).calendar() ?? ""}
                      </span>
                    )}
                    {message.imageUrl ? (
                      <img
                        onClick={() => handleMessageClick(index)}
                        className="md:max-w-300 max-w-200 rounded-lg shadow cursor-pointer"
                        src={message.imageUrl}
                        alt="Message"
                      />
                    ) : (
                      <span
                        className={
                          " rounded-3xl md:px-5 md:py-3 px-3 py-2 break-word rounded-bl-none shadow-sm cursor-pointer overflow-x-auto max-w-3/4 text-sm md:text-base" +
                          " " +
                          (showTimeIndexes.includes(index)
                            ? "bg-gray-300 dark:bg-dark-third"
                            : "bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-500 dark:to-gray-600 ")
                        }
                        onClick={() => handleMessageClick(index)}
                      >
                        {message.content}
                      </span>
                    )}
                  </div>
                </div>
              ),
            )}
          <div ref={endMessageRef}></div>
        </div>
        {/* End chat content */}

        <ChatInput chatId={chat.id} />
      </div>
    </>
  );
}

export default ChatWindow;
