import EmojiIcon from "assets/icons/emoji.svg";
import ImageIcon from "assets/icons/image-icon.svg";
import SendIconNormal from "assets/icons/send-icon.svg";
import ClickableIcon from "components/ClickableIcon";
import Picker from "emoji-picker-react";
import useChatApi from "hooks/useChatApi";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";

ChatInput.propTypes = {
  chatId: PropTypes.number,
};

function ChatInput({ chatId }) {
  const [content, setContent] = useState("");
  const [isOpenEmoji, setIsOpenEmoji] = useState(false);
  const ref = useRef();

  const chatApi = useChatApi();

  async function onSendMessage(e) {
    e.preventDefault();
    if (!content) {
      return;
    }
    setContent("");

    var request = { content };
    await chatApi.sendMessage(chatId, request);
  }

  const onEmojiClick = (event, emojiObject) => {
    if (emojiObject?.emoji) {
      setContent(content + emojiObject?.emoji);
    }
  };

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (isOpenEmoji && ref.current && !ref.current.contains(e.target)) {
        setIsOpenEmoji(false);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [isOpenEmoji]);

  async function sendImage(e) {
    var file = e.target.files[0];
    const formData = new FormData();
    formData.append("Image", file);

    await chatApi.sendImage(chatId, formData);
  }
  return (
    <div>
      <form
        onSubmit={(e) => onSendMessage(e)}
        className="flex justify-between items-center space-x-1 pl-4 pr-2 md:pr-6 z-0"
      >
        <div className="relative w-full flex">
          <input
            id="imageFile"
            type="file"
            hidden
            accept="image/png, image/jpg, image/tiff, image/tif, image/jpeg"
            onChange={sendImage}
          />
          <label htmlFor="imageFile">
            <ClickableIcon className="h-10 w-10 p-2 mr-2" icon={ImageIcon} />
          </label>
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            type="text"
            placeholder="Aa"
            className="bg-gray-200 dark:bg-dark-secondary rounded-3xl w-full py-2 px-4 pr-12 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 outline-none transition-all duration-200 relative"
          />
          <div ref={ref} position="relative">
            <ClickableIcon
              className="absolute h-10 w-10 p-2 right-1 top-0"
              icon={EmojiIcon}
              onClick={() => setIsOpenEmoji(!isOpenEmoji)}
            />
            <div
              className={
                "animate-fade absolute right-0 bottom-full " +
                " " +
                (isOpenEmoji ? "visible" : "invisible")
              }
            >
              <Picker onEmojiClick={onEmojiClick} />
            </div>
          </div>
        </div>

        <button>
          <ClickableIcon
            disableAutoFocus
            icon={SendIconNormal}
            className="w-12 h-12 p-3"
          />
        </button>
      </form>
    </div>
  );
}

export default ChatInput;
