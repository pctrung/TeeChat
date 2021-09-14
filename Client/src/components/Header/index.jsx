import ConfirmModal from "components/ConfirmModal";
import CreateChat from "components/CreateChat";
import ImageCircle from "components/ImageCircle";
import UserInfo from "components/UserInfo";
import useDarkMode from "hooks/useDarkMode";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ClickableIcon from "../ClickableIcon";

Header.propTypes = {
  logout: PropTypes.func,
};

function Header({ logout }) {
  const currentUser = useSelector((state) => state.users.currentUser);

  const [isOpenCreateChat, setIsOpenCreateChat] = useState(false);
  const [isOpenUserInfo, setIsOpenUserInfo] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    content: "",
    confirmButtonTitle: "",
  });

  const { darkMode, setDarkMode } = useDarkMode();

  const userAvatar = currentUser.avatarUrl;
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (isOpenMenu && ref.current && !ref.current.contains(e.target)) {
        setIsOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [isOpenMenu]);

  function openConfirmModal(
    content,
    confirmButtonAction,
    confirmButtonTitle = "Yes",
    title,
  ) {
    const confirmModal = {
      isOpen: true,
      title: title,
      content: content,
      confirmButtonTitle: confirmButtonTitle,
      confirmButtonAction: confirmButtonAction,
    };
    setConfirmModal(confirmModal);
  }

  return (
    <>
      {confirmModal.isOpen && (
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          closeAction={() => setConfirmModal({ isOpen: false })}
          title="Are you sure?"
          content={confirmModal.content}
          confirmButtonTitle={confirmModal.confirmButtonTitle}
          confirmButtonAction={confirmModal.confirmButtonAction}
        />
      )}
      <UserInfo
        currentUser={currentUser}
        isOpen={isOpenUserInfo}
        setIsOpen={setIsOpenUserInfo}
      />
      <CreateChat isOpen={isOpenCreateChat} setIsOpen={setIsOpenCreateChat} />
      <div className="pb-1 pt-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div
            className="transition-all duration-200 ring ring-green-500 p-1 transform active:scale-95 rounded-full cursor-pointer"
            onClick={() => setIsOpenUserInfo((x) => !x)}
          >
            <ImageCircle src={userAvatar} size="md" />
          </div>
          <h1 className="font-bold text-3xl">Chats</h1>
        </div>
        <div className="flex space-x-2 items-center">
          <ClickableIcon
            iconClass="bx bxs-edit"
            onClick={() => setIsOpenCreateChat(true)}
            className="dark:bg-dark-third bg-gray-100"
          />
          <div className="relative" ref={ref}>
            <ClickableIcon
              iconClass="bx bx-dots-horizontal-rounded"
              onClick={() => setIsOpenMenu(!isOpenMenu)}
              className="dark:bg-dark-third bg-gray-100"
            />
            {isOpenMenu && (
              <div className="animate-fade transition-all duration-200 absolute right-0 md:left-0 border border-gray-200 bg-white w-52 rounded-lg shadow-md overflow-hidden p-2 dark:bg-dark-secondary dark:border-dark-third mt-2 select-none">
                <button
                  className="flex items-center space-x-3 w-full pl-2 pr-4 py-2 rounded-md text-left hover:bg-gray-200 active:bg-gray-300 transition-all duration-200 transform active:scale-95 dark:hover:bg-dark-third"
                  onClick={() => setDarkMode(!darkMode)}
                >
                  <span className="p-1 bg-gray-100 dark:bg-dark-hover rounded-full select-none">
                    <i className="bx bx-moon text-center text-xl align-middle text-black dark:text-dark-txt w-7 h-7"></i>
                  </span>
                  <span>Dark Mode</span>
                </button>
                <button
                  className="flex items-center space-x-3 w-full pl-2 pr-4 py-2 rounded-md text-left hover:bg-gray-200 active:bg-gray-300 transition-all duration-200 transform active:scale-95 dark:hover:bg-dark-third"
                  onClick={() => {
                    openConfirmModal("Do you want to log out?", logout);
                  }}
                >
                  <span className="p-1 bg-gray-100 dark:bg-dark-hover rounded-full select-none">
                    <i className="bx bx-log-in-circle text-center text-xl align-middle text-black dark:text-dark-txt w-7 h-7"></i>
                  </span>
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
