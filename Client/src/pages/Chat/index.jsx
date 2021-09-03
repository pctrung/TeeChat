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
  refreshChats,
  setSelectedChat,
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
      const openLoadingAction = setIsLoading(true);
      dispatch(openLoadingAction);
      var result = await chatApi.getAllAsync();
      // .catch((error) => {
      //   openPopup("Error", error.data);
      // });
      if (result) {
        const refreshChatAction = refreshChats(result.data);
        dispatch(refreshChatAction);
        if (result.data) {
          const id = result.data[0]?.id;
          const setSelectedIdAction = setSelectedId(id);
          dispatch(setSelectedIdAction);
        }
      }
      const closeLoadingAction = setIsLoading(false);
      dispatch(closeLoadingAction);
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
          });
        })
        .catch((e) => {
          console.error("Connection failed: ", e);
          openPopup("Connection failed", e);
        });
    }
  }, [connection]);

  function openPopup(title, content) {
    const setIsOpenAction = setIsOpenPopup(true);
    const setContentAction = setPopupContent(content);
    const setTileAction = setPopupTitle(title);
    dispatch(setIsOpenAction);
    dispatch(setContentAction);
    dispatch(setTileAction);
  }

  return isLoading ? (
    <Loader />
  ) : (
    <>
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
          <div className="hidden text-lg font-content items-center justify-center lg:col-span-9 md:col-span-8 col-span-12 md:flex h-full w-full ">
            Select a chat to start
          </div>
        ) : (
          <div className="lg:col-span-9 md:col-span-8 col-span-12 flex h-full w-full ">
            <ChatWindow chat={chats.find((chat) => chat.id === selectedId)} />
          </div>
        )}
      </div>
    </>
  );
}

export default Chat;
