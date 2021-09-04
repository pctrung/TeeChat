import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import ClickableIcon from "components/ClickableIcon";
import SendIconNormal from "assets/icons/send-icon.svg";
import EmojiIcon from "assets/icons/emoji.svg";
import chatApi from "api/chatApi";
import Picker from "emoji-picker-react";

ChatInput.propTypes = {
  onSubmit: PropTypes.func,
};

function ChatInput({ chatId }) {
  const [content, setContent] = useState("");
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [isOpenEmoji, setIsOpenEmoji] = useState(false);
  const ref = useRef();

  async function onSendMessage(e) {
    e.preventDefault();
    if (!content) {
      return;
    }

    var request = { content };
    await chatApi.sendMessageAsync(chatId, request);

    setContent("");
  }

  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
    if (chosenEmoji?.emoji) {
      setContent(content + chosenEmoji?.emoji);
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

  return (
    <div>
      <form
        onSubmit={(e) => onSendMessage(e)}
        className="flex justify-between items-center space-x-3 pl-4 pr-6"
      >
        <div className="relative w-full">
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            type="text"
            placeholder="Aa"
            className="bg-gray-200 rounded-3xl w-full py-2 px-4 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 outline-none transition-all duration-200 relative"
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
