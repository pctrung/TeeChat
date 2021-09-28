import { HubConnectionBuilder } from "@microsoft/signalr";
import {
  addChat,
  addMessage,
  addNotification,
  addReadByUserName,
  editChat,
  editGroupAvatar,
  refreshChats,
  setSelectedId,
} from "app/chatSlice";
import { updateOnlineUserNameList, updateUser } from "app/userSlice";
import ChatList from "components/ChatList";
import ChatWindow from "components/ChatWindow";
import Header from "components/Header";
import useChatApi from "hooks/useChatApi";
import useUserApi from "hooks/useUserApi";
import Logo from "logo.png";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { ChatClient } from "utils/Constant";

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
    connection?.stop();
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

      userApi
        .getCurrentUser()
        .then((response) => {
          dispatch(updateUser(response));
        })
        .catch((error) => {
          logout();
        });
    }

    fetchData();
  }, []);

  // for realtime
  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(process.env.REACT_APP_CHAT_HUB_URL, {
        accessTokenFactory: () => localStorage.getItem("token"),
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection && !connection.connectionStarted) {
      connection.start().then((result) => {
        connection.on(ChatClient.RECEIVE_MESSAGE, (response) => {
          const action = addMessage(response);
          dispatch(action);
          if (response.chatId && selectedId !== response.chatId) {
            dispatch(addNotification(response.chatId));
          }
        });
        connection.on(ChatClient.RECEIVE_CHAT, (chat) => {
          const action = addChat(chat);
          dispatch(action);
          if (chat.creatorUserName === currentUser.userName) {
            dispatch(setSelectedId(chat.id));
          }
        });
        connection.on(ChatClient.RECEIVE_UPDATED_CHAT, (chat) => {
          const action = editChat(chat);
          dispatch(action);
        });
        connection.on(ChatClient.RECEIVE_UPDATED_GROUP_AVATAR, (response) => {
          const action = editGroupAvatar(response);
          dispatch(action);
        });
        connection.on(ChatClient.RECEIVE_ADD_READ_BY_USERNAME, (response) => {
          const action = addReadByUserName(response);
          dispatch(action);
        });
        connection.on(
          ChatClient.RECEIVE_UPDATED_ONLINE_USERNAME_LIST,
          (response) => {
            const action = updateOnlineUserNameList(response);
            dispatch(action);
          },
        );
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
      <div className="dark:bg-dark-primary dark:text-white  animate-fadeIn grid grid-cols-12 h-screen w-screen overflow-hidden">
        <div
          className={
            "animate-fadeIn lg:col-span-3 md:col-span-4 col-span-12 md:flex flex-col h-screen border-r px-4 dark:border-dark-third border-gray-300 pt-1" +
            (selectedId !== 0 ? " hidden" : "flex")
          }
        >
          <Header logout={logout} />
          <ChatList />
        </div>
        {!selectedId ? (
          chats?.length === 0 ? (
            <div className="dark:bg-black animate-fadeIn hidden text-lg items-center justify-center lg:col-span-9 md:col-span-8 col-span-12 md:flex flex-col h-full w-full ">
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
            <div className="dark:bg-black animate-fadeIn hidden text-lg items-center justify-center lg:col-span-9 md:col-span-8 col-span-12 md:flex flex-col h-full w-full ">
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
          <div className="dark:bg-dark-primary md:dark:bg-black animate-fadeIn lg:col-span-9 md:col-span-8 col-span-12 flex h-screen w-full overflow-y-auto">
            <ChatWindow chat={chats.find((chat) => chat.id === selectedId)} />
          </div>
        )}
      </div>
    </>
  );
}

export default Chat;
