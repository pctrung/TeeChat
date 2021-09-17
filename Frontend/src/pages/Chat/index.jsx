import { HubConnectionBuilder } from "@microsoft/signalr";
import {
  addChat,
  addMessage,
  addNotification,
  editChat,
  editGroupAvatar,
  refreshChats,
  setSelectedId,
} from "app/chatSlice";
import { updateUser } from "app/userSlice";
import ChatList from "components/ChatList";
import ChatWindow from "components/ChatWindow";
import Header from "components/Header";
import useChatApi from "hooks/useChatApi";
import useUserApi from "hooks/useUserApi";
import Logo from "logo.png";
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

  const chatApi = useChatApi();
  const userApi = useUserApi();

  function logout() {
    window.localStorage.removeItem("token");
    connection.stop();
    history.push("/login");
  }

  useEffect(() => {
    async function fetchData() {
      chatApi
        .getAll()
        .then((response) => {
          dispatch(refreshChats(response.data));
        })
        .catch((error) => {
          console.error("Connection failed: ", error);
        });

      userApi.getCurrentUser().then((response) => {
        dispatch(updateUser(response));
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
      connection.start().then((result) => {
        connection.on("ReceiveMessage", (response) => {
          const action = addMessage(response);
          dispatch(action);
          if (response.chatId && selectedId !== response.id) {
            dispatch(addNotification(response.chatId));
          }
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
      });
    }
    return () => {
      if (connection && connection.connectionStarted) {
        connection.stop();
      }
    };
  }, [connection]);

  return (
    <>
      <div className="dark:bg-dark-primary dark:text-white  animate-fade grid grid-cols-12 h-screen w-screen overflow-hidden">
        <div
          className={
            "animate-fade lg:col-span-3 md:col-span-4 col-span-12 md:flex flex-col h-screen border-r px-4 dark:border-dark-third border-gray-300 pt-1" +
            (selectedId !== 0 ? " hidden" : "flex")
          }
        >
          <Header logout={logout} />
          <ChatList />
        </div>
        {!selectedId ? (
          chats?.length === 0 ? (
            <div className="dark:bg-black animate-fade hidden text-lg items-center justify-center lg:col-span-9 md:col-span-8 col-span-12 md:flex flex-col h-full w-full ">
              <img src={Logo} className="w-32 h-32 mb-3" alt="logo" />
              <span className="text-center">
                {" "}
                Welcome to{" "}
                <span className="text-green-600 dark:text-green-400 font-bold">
                  TeeChat!
                </span>{" "}
                <br />
                You do not have any chats, please start a chat!{" "}
              </span>
              <span></span>
            </div>
          ) : (
            <div className="dark:bg-black animate-fade hidden text-lg items-center justify-center lg:col-span-9 md:col-span-8 col-span-12 md:flex flex-col h-full w-full ">
              <img src={Logo} className="w-32 h-32 mb-3" alt="logo" />
              <span className="text-center">
                {" "}
                Welcome to{" "}
                <span className="text-green-600 dark:text-green-400 font-bold">
                  TeeChat!
                </span>{" "}
                <br />
                Select a chat to start.{" "}
              </span>
            </div>
          )
        ) : (
          <div className="dark:bg-dark-primary md:dark:bg-black animate-fade lg:col-span-9 md:col-span-8 col-span-12 flex h-screen w-full overflow-y-auto">
            <ChatWindow chat={chats.find((chat) => chat.id === selectedId)} />
          </div>
        )}
      </div>
    </>
  );
}

export default Chat;
