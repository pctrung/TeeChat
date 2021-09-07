import { HubConnectionBuilder } from "@microsoft/signalr";
import chatApi from "api/chatApi";
import userApi from "api/userApi";
import { setIsLoading, setPopup } from "app/appSlice";
import {
  addChat,
  addMessage,
  editChat,
  editGroupAvatar,
  refreshChats,
  setSelectedId,
} from "app/chatSlice";
import { updateUser } from "app/userSlice";
import ChatList from "components/ChatList";
import ChatWindow from "components/ChatWindow";
import Header from "components/Header";
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
          dispatch(setIsLoading(false));
        })
        .catch((error) => {
          var message =
            typeof error === "string"
              ? error
              : "Cannot get any chats. Please login and try again!";
          dispatch(setIsLoading(false));
          openPopup("Error", message);
        });

      userApi
        .getCurrentUser()
        .then((response) => {
          dispatch(updateUser(response));
          dispatch(setIsLoading(false));
        })
        .catch((error) => {
          var message =
            typeof error === "string"
              ? error
              : "Cannot get any chats. Please login and try again!";
          dispatch(setIsLoading(false));
          openPopup("Error", message);
        });
    }

    fetchData();
  }, []);

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
    if (connection && !connection.connectionStarted) {
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
          connection.on("ReceiveUpdatedGroupAvatar", (response) => {
            const action = editGroupAvatar(response);
            dispatch(action);
          });
        })
        .catch((error) => {
          var message =
            typeof error === "string" ? error : "Something went wrong!";

          console.error("Connection failed: ", error);
          openPopup("Connection failed", message);
        });
    }
    return () => {
      if (connection && connection.connectionStarted) {
        connection.stop();
      }
    };
  }, [connection]);

  function openPopup(title, content) {
    const popup = {
      isOpen: true,
      title: title,
      content: content,
    };
    dispatch(setPopup(popup));
  }

  return (
    <>
      <div className="animate-fade grid grid-cols-12 h-screen w-screen">
        <div
          className={
            "animate-fade lg:col-span-3 md:col-span-4 col-span-12 md:flex flex-col h-screen border-r-2 border-gray-200 px-4" +
            (selectedId !== 0 ? " hidden" : "")
          }
        >
          <Header logout={logout} />
          <ChatList />
        </div>
        {!selectedId ? (
          chats?.length === 0 ? (
            <div className="animate-fade hidden text-lg items-center justify-center lg:col-span-9 md:col-span-8 col-span-12 md:flex h-full w-full ">
              You do not have any chats, please create a chat
            </div>
          ) : (
            <div className="animate-fade hidden text-lg items-center justify-center lg:col-span-9 md:col-span-8 col-span-12 md:flex h-full w-full ">
              Select a chat to start
            </div>
          )
        ) : (
          <div className="animate-fade lg:col-span-9 md:col-span-8 col-span-12 flex h-screen w-full overflow-y-auto">
            <ChatWindow chat={chats.find((chat) => chat.id === selectedId)} />
          </div>
        )}
      </div>
    </>
  );
}

export default Chat;
