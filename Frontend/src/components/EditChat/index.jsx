import { setSelectedId } from "app/chatSlice";
import Button from "components/Button";
import ConfirmModal from "components/ConfirmModal";
import ImageCircle from "components/ImageCircle";
import Popup from "components/Popup";
import useChatApi from "hooks/useChatApi";
import useUserApi from "hooks/useUserApi";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import constants from "utils/constants";

function EditChat({ isOpen, setIsOpen, chat }) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const [groupName, setGroupName] = useState(chat?.name);
  const [keyword, setKeyword] = useState("");

  const [isValidButton, setIsValidButton] = useState(false);
  const [friendList, setFriendList] = useState([]);
  const [isOpenFriendList, setIsOpenFriendList] = useState(false);
  const [selectedFriendList, setSelectedFriendList] = useState(
    chat?.participants,
  );

  const chatApi = useChatApi();
  const userApi = useUserApi();

  const [popup, setPopup] = useState({
    isOpen: false,
    content: "",
    title: "Notification",
  });

  const currentUser = useSelector((state) => state.users.currentUser);
  const dispatch = useDispatch();
  const ref = useRef();
  const friendListRef = useRef();

  useEffect(() => {
    setIsValidButton(groupName?.trim() ? true : false);
  }, [groupName]);
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (isOpen && ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [isOpen]);
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (
        isOpenFriendList &&
        friendListRef.current &&
        !friendListRef.current.contains(e.target)
      ) {
        setIsOpenFriendList(false);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [isOpenFriendList]);

  useEffect(() => {
    userApi.getFriendList().then((response) => {
      if (response) {
        setFriendList(response);
      }
    });
  }, []);
  useEffect(() => {
    setSelectedFriendList(chat?.participants);
    setGroupName(chat?.name);
  }, [chat]);

  async function handleEditChat() {
    var currentParticipantUserNames = chat?.participants.map((x) => x.userName);
    var selectedParticipantUserNames = selectedFriendList.map(
      (x) => x.userName,
    );
    var participantFullNamesToAdd = [];
    var participantFullNamesToRemove = [];
    var participantUserNamesToRemove = [];

    // create request with added username and removed username
    selectedFriendList.forEach((user) => {
      if (!currentParticipantUserNames.some((x) => x === user.userName)) {
        participantFullNamesToAdd.push(user.fullName);
      }
    });
    chat?.participants.forEach((user) => {
      if (!selectedParticipantUserNames.some((x) => x === user.userName)) {
        participantFullNamesToRemove.push(user.fullName);
        participantUserNamesToRemove.push(user.userName);
      }
    });

    if (participantFullNamesToRemove.length > 0) {
      var content = "";

      if (
        participantUserNamesToRemove.some((x) => x === currentUser.userName)
      ) {
        if (participantFullNamesToRemove.length === 1) {
          content = "Do you want to leave this group?";
          openModal(content);
          return <></>;
        } else {
          content = "Do you want to leave this group and remove ";
        }
      } else {
        content = "Do you want to remove ";
      }

      participantFullNamesToRemove.forEach((fullName, index) => {
        if (participantUserNamesToRemove[index] !== currentUser.userName) {
          content += `'${fullName}'`;
          if (index !== participantFullNamesToRemove.length - 1) {
            content += ", ";
          }
        }
      });

      content += " from this chat?";
      openModal(content);
    } else {
      await submitEditChat();
    }
  }
  async function submitEditChat() {
    var currentParticipantUserNames = chat?.participants.map((x) => x.userName);
    var selectedParticipantUserNames = selectedFriendList.map(
      (x) => x.userName,
    );
    var participantUserNamesToAdd = [];
    var participantUserNamesToRemove = [];

    // create request with added username and removed username
    selectedParticipantUserNames.forEach((userName) => {
      if (!currentParticipantUserNames.includes(userName)) {
        participantUserNamesToAdd.push(userName);
      }
    });
    currentParticipantUserNames.forEach((userName) => {
      if (!selectedParticipantUserNames.includes(userName)) {
        participantUserNamesToRemove.push(userName);
      }
    });

    const request = {
      newGroupName: groupName,
      participantUserNamesToAdd,
      participantUserNamesToRemove,
    };

    chatApi.updateGroupChat(chat?.id, request);

    const isLeaveGroup = participantUserNamesToRemove.some(
      (x) => x === currentUser.userName,
    );
    if (isLeaveGroup) {
      dispatch(setSelectedId(0));
    }

    closeModal();
    setIsOpen(false);
  }

  async function updateGroupAvatar(e) {
    var file = e.target.files[0];
    const formData = new FormData();
    formData.append("Avatar", file);

    await chatApi.updateGroupAvatar(chat?.id, formData).then((response) => {
      openPopup("Success", "Update group avatar successfully!");
    });
  }

  function openPopup(title, content) {
    const popup = {
      isOpen: true,
      title: title,
      content: content,
    };
    setPopup(popup);
  }
  function openModal(content) {
    setIsOpenModal(true);
    setModalContent(content);
  }
  function closeModal() {
    setIsOpenModal(false);
    setModalContent("");
  }

  return isOpen ? (
    <div className="animate-fade fixed inset-0 grid place-items-center h-screen w-screen px-4 py-10 z-30 bg-gray-500 bg-opacity-30 dark:bg-dark-primary dark:bg-opacity-50">
      <div
        ref={ref}
        className={
          "px-6 md:px-14 md:py-6 flex flex-col bg-white dark:bg-dark-secondary dark:border-dark-third rounded-xl shadow-xl border border-gray-300 w-full md:w-5/6 lg:w-2/5 transition-all duration-300 max-h-full overflow-y-auto" +
          " " +
          (isOpenFriendList ? "mb-16" : "")
        }
      >
        <Popup
          title={popup.title}
          isOpen={popup.isOpen}
          content={popup.content}
          onClick={() => setPopup({ isOpen: false })}
        />
        <ConfirmModal
          isOpen={isOpenModal}
          closeAction={() => setIsOpenModal(false)}
          title="Are you sure?"
          content={modalContent}
          confirmButtonTitle="Yes"
          confirmButtonAction={submitEditChat}
        />
        <div className="flex pt-6 pb-5 h-full">
          <h3 className="font-semibold text-lg md:text-2xl text-green-600 dark:text-green-400">
            Chat info!
          </h3>
        </div>
        <div className="space-y-2 md:space-y-4">
          {chat?.type === constants.chatType.GROUP ? (
            <>
              <div className="space-y-2">
                <label
                  htmlFor="groupName"
                  className="font-semibold dark:text-dark-txt text-base md:text-lg"
                >
                  Group name <span className="text-red-500">*</span>
                </label>
                <input
                  id="groupName"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  type="text"
                  className="dark:bg-dark-third bg-gray-100 rounded-lg w-full py-2 px-3 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 outline-none transition-all duration-200 mb-2 "
                />
              </div>
              <div ref={friendListRef} className="space-y-2">
                <label
                  htmlFor="search"
                  className="font-semibold dark:text-dark-txt text-base md:text-lg"
                >
                  Add Members
                </label>
                <div className="relative">
                  <input
                    id="search"
                    type="search"
                    onFocus={() => setIsOpenFriendList(true)}
                    value={keyword}
                    autoComplete="off"
                    onChange={(e) => setKeyword(e.target.value)}
                    className="dark:bg-dark-third bg-gray-100 rounded-lg w-full py-2 px-3 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 outline-none transition-all duration-200 mb-2 "
                  />
                  {isOpenFriendList && (
                    <>
                      <div className="animate-fade absolute top-full bg-white dark:bg-dark-third border border-gray-400 border-opacity-50 rounded-lg w-full md:py-4 py-2 md:px-8 px-6 space-y-1 max-h-48 md:max-h-72 overflow-y-auto select-none z-10 shadow-2xl ">
                        <h4 className="font-semibold dark:text-gray-200 mb-2">
                          Friend list
                        </h4>
                        {friendList
                          .filter(
                            (x) =>
                              (x.fullName
                                ?.toLowerCase()
                                .includes(keyword?.toLowerCase()) ||
                                x.userName
                                  ?.toLowerCase()
                                  .includes(keyword?.toLowerCase())) &&
                              !selectedFriendList.some(
                                (selected) => selected.userName === x.userName,
                              ),
                          )
                          .sort((a, b) => a.fullName.localeCompare(b.fullName))
                          .map((friend, index) => (
                            <div
                              onClick={() => {
                                var result = [...selectedFriendList];
                                if (
                                  !result.some(
                                    (x) => x.userName === friend.userName,
                                  )
                                ) {
                                  result.push(friend);
                                  setSelectedFriendList(result);
                                }
                              }}
                              key={Math.random() + index}
                              className="h-full w-full rounded-lg px-3 py-2 flex items-center space-x-2  dark:bg-dark-hover bg-gray-100 hover:bg-green-200 dark:hover:bg-green-600 cursor-pointer transform active:scale-100 hover:scale-105 hover:shadow-xl transition-all duration-300"
                            >
                              <ImageCircle
                                size="xs"
                                src={friend.avatarUrl}
                                userName={friend?.userName}
                              />
                              <span className="break-full w-full overflow-ellipsis truncate md:text-base text-sm">
                                {friend.fullName ?? "Unknown"}
                              </span>
                            </div>
                          ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="search"
                  className="font-semibold text-base md:text-lg dark:text-dark-txt"
                >
                  Members <span className="text-red-500">*</span>{" "}
                  <span className="text-sm text-gray-400">
                    {"(Click to remove)"}
                  </span>
                </label>
                <div className="bg-white border dark:bg-dark-third dark:border-dark-third border-gray-400 border-opacity-50 rounded-lg w-full py-4 md:px-8 px-6 space-y-1 max-h-48 md:max-h-72 overflow-y-auto select-none">
                  {[...selectedFriendList]
                    .sort((a, b) => a.fullName.localeCompare(b.fullName))
                    .map((friend, index) => (
                      <div
                        onClick={() => {
                          var result = [...selectedFriendList];
                          var i = result.findIndex(
                            (x) => x.userName === friend.userName,
                          );
                          if (i >= 0) {
                            result.splice(i, 1);
                            setSelectedFriendList(result);
                          }
                        }}
                        key={Math.random() + index}
                        className="h-full w-full rounded-lg px-3 py-2 flex items-center space-x-2 dark:hover:bg-red-500 dark:bg-dark-hover bg-gray-100 hover:bg-red-200 cursor-pointer transform active:scale-100 hover:scale-105 hover:shadow-xl transition-all duration-300"
                      >
                        <ImageCircle
                          size="xs"
                          src={friend.avatarUrl}
                          userName={friend?.userName}
                        />
                        <span className="break-full w-full overflow-ellipsis truncate md:text-base text-sm">
                          {friend.fullName ?? "Unknown"}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
              <div className="space-y-2 mr-2 flex flex-col">
                <label
                  htmlFor="avatar"
                  className="dark:text-dark-txt text-base md:text-lg font-semibold "
                >
                  Group Avatar
                </label>
                <input
                  id="avatar"
                  onChange={updateGroupAvatar}
                  type="file"
                  className="w-full"
                  accept="image/png, image/jpg, image/tiff, image/tif, image/jpeg"
                />
              </div>
            </>
          ) : (
            <div ref={friendListRef} className="space-y-2">
              <div className="font-bold dark:text-dark-txt">
                Created user:{" "}
                <span className="font-normal">{chat?.creatorUserName}</span>
              </div>
              <div className="font-bold dark:text-dark-txt">
                Created date:{" "}
                <span className="font-normal">
                  {moment(new Date(chat?.dateCreated), "YYYYMMDD").format(
                    "MMMM Do YYYY, h:mm:ss a",
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end py-6 space-x-4">
          <div className="space-x-2 flex items-center">
            <Button outline content="Close" onClick={() => setIsOpen(false)} />
            {chat?.type === constants.chatType.GROUP ? (
              <Button
                disabled={!isValidButton}
                content="Save"
                onClick={() => handleEditChat()}
              />
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}

export default EditChat;
