import chatApi from "api/chatApi";
import userApi from "api/userApi";
import {
  setIsLoading,
  setIsOpenPopup,
  setPopupContent,
  setPopupTitle,
} from "app/appSlice";
import { setSelectedId } from "app/chatSlice";
import Button from "components/Button";
import ImageCircle from "components/ImageCircle";
import Popup from "components/Popup";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import constants from "utils/constants";

function CreateChat({ isOpen, setIsOpen }) {
  const [selectedMode, setSelectedMode] = useState(constants.chatType.PRIVATE);
  const [isOpenFriendList, setIsOpenFriendList] = useState(false);
  const [isValidButton, setIsValidButton] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [keyword, setKeyword] = useState("");
  const [friendList, setFriendList] = useState([]);
  const [selectedFriendList, setSelectedFriendList] = useState([]);

  const ref = useRef();
  const friendListRef = useRef();
  const dispatch = useDispatch();

  const [popupTitle, setPopupTitle] = useState("");
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");

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
    return () => {
      setSelectedFriendList([]);
      setGroupName("");
    };
  }, []);

  useEffect(() => {
    if (selectedMode === constants.chatType.GROUP) {
      var result = selectedFriendList?.length >= 2 && groupName;
      setIsValidButton(result);
    } else if (selectedMode === constants.chatType.PRIVATE) {
      setIsValidButton(selectedFriendList?.length !== 0 ? true : false);
    }
  }, [selectedFriendList, groupName, selectedMode]);

  async function handleCreateGroup() {
    await dispatch(setIsLoading(true));

    if (isValidButton) {
      if (selectedMode === constants.chatType.GROUP) {
        const request = {
          participantUserNames: selectedFriendList.map((x) => x.userName),
          name: groupName,
        };
        chatApi
          .createGroupChat(request)
          .then((response) => {
            if (response.id) {
              dispatch(setSelectedId(response.id));
            }
            setSelectedFriendList([]);
            setGroupName("");
          })
          .catch((error) => {
            const message =
              typeof error === "string" ? error : "Something went wrong!";

            openPopup("Failed", message);
          });
      } else if (selectedMode === constants.chatType.PRIVATE) {
        const request = {
          participantUserName: selectedFriendList
            .map((x) => x.userName)
            .shift(),
        };
        chatApi
          .createPrivateChat(request)
          .then((response) => {
            if (response.id) {
              dispatch(setSelectedId(response.id));
            }
            setSelectedFriendList([]);
            setGroupName("");
            setIsOpen(false);
          })
          .catch((error) => {
            var message =
              typeof error === "string" ? error : "Something went wrong!";

            setSelectedFriendList([]);
            setGroupName("");
            openPopup("Failed", message);
          });
      }
    }
    await dispatch(setIsLoading(false));
  }
  function openPopup(title, content) {
    setIsOpenPopup(true);
    setPopupContent(content);
    setPopupTitle(title);
  }
  return isOpen ? (
    <div className="animate-fade fixed grid place-items-center h-screen w-screen px-4 z-30">
      <div
        ref={ref}
        className={
          "md:px-5 md:py-3 flex flex-col bg-white rounded-xl shadow-xl border border-gray-300 w-full md:w-5/6 lg:w-2/5 transition-all duration-300" +
          " " +
          (isOpenFriendList ? "mb-16" : "")
        }
      >
        <Popup
          title={popupTitle}
          isOpen={isOpenPopup}
          content={popupContent}
          onClick={() => setIsOpenPopup(false)}
        />
        <div className="flex px-10 pt-6 pb-5 space-x-7 justify-between h-full items-center">
          <h3 className="font-semibold text-2xl text-green-600">New chat!</h3>

          <div className="relative flex rounded-md items-center border border-green-500 cursor-pointer">
            <div
              className={
                "absolute bg-green-500 w-1/2 h-full rounded-md transition-all duration-200 z-0" +
                " " +
                (selectedMode === constants.chatType.GROUP
                  ? "transform translate-x-full left-0"
                  : "left-0 ")
              }
            ></div>
            <span
              className={
                " px-3 py-2 z-10 text-sm" +
                " " +
                (selectedMode === constants.chatType.PRIVATE
                  ? "text-white"
                  : " text-green-600")
              }
              onClick={() => setSelectedMode(constants.chatType.PRIVATE)}
            >
              Private
            </span>
            <span
              className={
                " px-3 py-2 z-10 text-sm" +
                " " +
                (selectedMode === constants.chatType.GROUP
                  ? "text-white"
                  : " text-green-600")
              }
              onClick={() => setSelectedMode(constants.chatType.GROUP)}
            >
              Group
            </span>
          </div>
        </div>
        <div className="px-10 space-y-4">
          {selectedMode === constants.chatType.GROUP ? (
            <>
              <div className="space-y-2">
                <label htmlFor="groupName" className="font-semibold text-lg">
                  Group name <span className="text-red-500">*</span>
                </label>
                <input
                  id="groupName"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  type="text"
                  className="bg-gray-100 rounded-lg w-full py-2 px-3 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 outline-none transition-all duration-200 mb-2 "
                />
              </div>
              <div ref={friendListRef} className="space-y-2">
                <label htmlFor="search" className="font-semibold text-lg">
                  Find Friends
                </label>
                <div className="relative">
                  <input
                    id="search"
                    type="search"
                    onFocus={() => setIsOpenFriendList(true)}
                    value={keyword}
                    autoComplete="off"
                    onChange={(e) => setKeyword(e.target.value)}
                    className="bg-gray-100 rounded-lg w-full py-2 px-3 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 outline-none transition-all duration-200 mb-2 "
                  />
                  {isOpenFriendList && (
                    <>
                      <div className="animate-fade absolute top-full bg-white border border-gray-400 border-opacity-50 rounded-lg w-full py-4 md:px-8 px-6 space-y-1 max-h-72 overflow-y-auto select-none z-10 shadow-xl">
                        <h4 className="font-semibold mb-2">Friend list</h4>
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
                              className="h-full w-full rounded-lg px-3 py-2 flex items-center space-x-2  bg-gray-100 hover:bg-green-200 cursor-pointer transform active:scale-100 hover:scale-105 hover:shadow-xl transition-all duration-300"
                            >
                              <ImageCircle size="sm" src={friend.avatarUrl} />
                              <span className="break-full w-full overflow-ellipsis truncate">
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
                <label htmlFor="search" className="font-semibold text-lg">
                  Selected <span className="text-red-500">*</span>{" "}
                  <span className="text-sm text-gray-400">
                    {"(At least 2 people. Click to remove)"}
                  </span>
                </label>
                <div className="bg-white border border-gray-400 border-opacity-50 rounded-lg w-full py-4 md:px-8 px-6 space-y-1 max-h-72 overflow-y-auto select-none">
                  {selectedFriendList.map((friend, index) => (
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
                      className="h-full w-full rounded-lg px-3 py-2 flex items-center space-x-2  bg-gray-100 hover:bg-red-200 cursor-pointer transform active:scale-100 hover:scale-105 hover:shadow-xl transition-all duration-300"
                    >
                      <ImageCircle size="sm" src={friend.avatarUrl} />
                      <span className="break-full w-full overflow-ellipsis truncate">
                        {friend.fullName ?? "Unknown"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div ref={friendListRef} className="space-y-2">
              <label htmlFor="selectFriend" className="font-semibold text-lg">
                Select Friends
              </label>
              <div className="relative">
                <input
                  id="selectFriend"
                  type="search"
                  onFocus={() => setIsOpenFriendList(true)}
                  value={keyword}
                  autoComplete="off"
                  onChange={(e) => setKeyword(e.target.value)}
                  className="bg-gray-100 rounded-lg w-full py-2 px-3 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 outline-none transition-all duration-200 mb-2 "
                />
                {isOpenFriendList && (
                  <>
                    <div className="animate-fade absolute top-full bg-white border border-gray-400 border-opacity-50 rounded-lg w-full space-y-1 max-h-72 overflow-y-auto select-none z-10 shadow-xl py-4 md:px-8 px-6 ">
                      <h4 className="font-semibold mb-2 text-start">
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
                        .map((friend, index) => (
                          <div
                            onClick={() => {
                              var result = [];
                              result.push(friend);
                              setIsOpenFriendList(false);
                              setSelectedFriendList(result);
                            }}
                            key={Math.random() + index}
                            className="h-full w-full rounded-lg px-3 py-2 flex items-center space-x-2  bg-gray-100 hover:bg-green-200 cursor-pointer transform active:scale-100 hover:scale-105 hover:shadow-xl transition-all duration-300"
                          >
                            <ImageCircle size="sm" src={friend.avatarUrl} />
                            <span className="break-full w-full overflow-ellipsis truncate">
                              {friend.fullName ?? "Unknown"}
                            </span>
                          </div>
                        ))}
                    </div>
                  </>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="search" className="font-semibold text-lg">
                  Selected <span className="text-red-500">*</span>{" "}
                  <span className="text-sm text-gray-400">
                    {"(Click to remove)"}
                  </span>
                </label>
                <div className="bg-white border border-gray-400 border-opacity-50 rounded-lg w-full py-4 md:px-8 px-6 space-y-1 max-h-72 overflow-y-auto select-none">
                  {selectedFriendList.map((friend, index) => {
                    if (index === 0) {
                      return (
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
                          className="h-full w-full rounded-lg px-3 py-2 flex items-center space-x-2  bg-gray-100 hover:bg-red-200 cursor-pointer transform active:scale-100 hover:scale-105 hover:shadow-xl transition-all duration-300"
                        >
                          <ImageCircle size="sm" src={friend.avatarUrl} />
                          <span className="break-full w-full overflow-ellipsis truncate">
                            {friend.fullName ?? "Unknown"}
                          </span>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end px-10 py-6 space-x-4">
          <div className="space-x-2 flex items-center">
            <Button outline content="Close" onClick={() => setIsOpen(false)} />
            <Button
              disabled={!isValidButton}
              content="Create"
              onClick={() => handleCreateGroup()}
            />
          </div>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}

export default CreateChat;
