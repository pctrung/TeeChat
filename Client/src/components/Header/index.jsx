import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

import NewChatIcon from "assets/icons/new-chat-icon.svg";
import MenuIcon from "assets/icons/menu-icon.svg";
import ClickableIcon from "../ClickableIcon";
import DarkModeIcon from "assets/icons/dark-mode-icon.svg";
import SignOutIcon from "assets/icons/sign-out-icon.svg";
import DefaultAvatar from "assets/img/default-avatar.jpg";
import currentUser from "utils/currentUser";

Header.propTypes = {
  userAvatar: PropTypes.string,
};

function Header() {
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

  return (
    <div className="h-24 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <img
          src={userAvatar ?? DefaultAvatar}
          alt="Avatar"
          className="h-12 w-12 rounded-full object-cover"
        />
        <h1 className="font-bold text-3xl">Chats</h1>
      </div>
      <div className="flex space-x-1">
        <ClickableIcon icon={NewChatIcon} />
        <div className="relative" ref={ref}>
          <ClickableIcon
            icon={MenuIcon}
            onClick={() => setIsOpenMenu(!isOpenMenu)}
          />
          {isOpenMenu && (
            <div className="animate-fade transition-all duration-200 absolute right-0 md:left-0 border border-gray-200 bg-white w-52 rounded-lg shadow-md overflow-hidden p-2 ">
              <button className="flex space-x-3 w-full pl-2 pr-4 py-2 rounded-md text-left hover:bg-gray-200 active:bg-gray-300 transition-all duration-200">
                <img
                  src={DarkModeIcon}
                  alt="Dark mode icon"
                  className="w-6 h-6"
                />
                <span>Dark mode</span>
              </button>
              <button className="flex space-x-3 w-full pl-2 pr-4 py-2 rounded-md text-left hover:bg-gray-200 active:bg-gray-300 transition-all duration-200">
                <img
                  src={SignOutIcon}
                  alt="Dark mode icon"
                  className="w-6 h-6"
                />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
