import { HubConnectionBuilder } from "@microsoft/signalr";
import chatApi from "api/chatApi";
import {
  setIsLoading,
  setIsOpenPopup,
  setPopupContent,
  setPopupTitle,
} from "app/appSlice";
import {
  addChat,
  addMessage,
  editChat,
  refreshChats,
  setSelectedId,
} from "app/chatSlice";
import { getCurrentUser } from "app/userSlice";
import ChatList from "components/ChatList";
import ChatWindow from "components/ChatWindow";
import Header from "components/Header";
import Loader from "components/Loader";
import Popup from "components/Popup";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

function Chat() {
  const [connection, setConnection] = useState(null);
  const history = useHistory();

  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chats.chats);
  const currentUser = useSelector((state) => state.users.currentUser);
  const selectedId = useSelector((state) => state.chats.selectedId);
  const isLoading = useSelector((state) => state.app.isLoading);
  const popupTitle = useSelector((state) => state.app.popupTitle);
  const isOpenPopup = useSelector((state) => state.app.isOpenPopup);
  const popupContent = useSelector((state) => state.app.popupContent);

  function logout() {
    window.localStorage.removeItem("token");
    connection.stop();
    history.push("/login");
  }

  useEffect(() => {
    async function fetchData() {
      dispatch(setIsLoading(true));
      chatApi
        .getAll()
        .then((response) => {
          const refreshChatAction = refreshChats(response.data);
          dispatch(refreshChatAction);
        })
        .catch((error) => {
          var message =
            typeof error === "string"
              ? error
              : "Cannot get any chats. Something went wrong!";
          message = typeof error.data === "string" ? error.data : message;

          openPopup("Error", message);
        });

      dispatch(setIsLoading(false));
    }
    fetchData();

    dispatch(getCurrentUser());
  }, []);

  function onPopupClick() {
    const action = setIsOpenPopup(false);
    dispatch(action);
  }

  // for realtime
  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(process.env.REACT_APP_SERVER_URL + "/hubs/chats", {
        accessTokenFactory: () => localStorage.getItem("token"),
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then((result) => {
          connection.on("ReceiveMessage", (response) => {
            const action = addMessage(response);
            dispatch(action);
          });
          connection.on("ReceiveChat", (chat) => {
            const action = addChat(chat);
            dispatch(action);
            if (chat.creatorUserName === currentUser.userName) {
              dispatch(setSelectedId(chat.id));
            }
          });
          connection.on("ReceiveUpdatedChat", (chat) => {
            const action = editChat(chat);
            dispatch(action);
          });
        })
        .catch((e) => {
          console.error("Connection failed: ", e);
          openPopup("Connection failed", e);
        });
    }
    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, [connection]);

  function openPopup(title, content) {
    const setIsOpenAction = setIsOpenPopup(true);
    const setContentAction = setPopupContent(content);
    const setTileAction = setPopupTitle(title);
    dispatch(setIsOpenAction);
    dispatch(setContentAction);
    dispatch(setTileAction);
  }

  return (
    <>
      <Loader isOpen={isLoading} className="z-50" />
      <Popup
        title={popupTitle}
        isOpen={isOpenPopup}
        content={popupContent}
        onClick={onPopupClick}
      />
      <div className="grid grid-cols-12 h-screen w-screen">
        <div
          className={
            "lg:col-span-3 md:col-span-4 col-span-12 md:flex flex-col h-screen border-r-2 border-gray-200 px-4" +
            (selectedId !== 0 ? " hidden" : "")
          }
        >
          <Header logout={logout} />
          <ChatList />
        </div>
        {!selectedId ? (
          chats?.length === 0 ? (
            <div className="hidden text-lg items-center justify-center lg:col-span-9 md:col-span-8 col-span-12 md:flex h-full w-full ">
              You do not have any chats, please create a chat
            </div>
          ) : (
            <div className="hidden text-lg items-center justify-center lg:col-span-9 md:col-span-8 col-span-12 md:flex h-full w-full ">
              Select a chat to start
            </div>
          )
        ) : (
          <div className="lg:col-span-9 md:col-span-8 col-span-12 flex h-screen w-full ">
            <ChatWindow chat={chats.find((chat) => chat.id === selectedId)} />
          </div>
        )}
      </div>
    </>
  );
}

export default Chat;
