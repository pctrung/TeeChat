import React, { useState } from "react";
import PropTypes from "prop-types";
import ClickableIcon from "components/ClickableIcon";
import SendIconNormal from "assets/icons/send-icon.svg";
import chatApi from "api/chatApi";

ChatInput.propTypes = {
  onSubmit: PropTypes.func,
};

function ChatInput({ chatId }) {
  const [content, setContent] = useState("");
  async function onSendMessage(e) {
    e.preventDefault();
    if (!content) {
      return;
    }

    var request = { content };
    await chatApi.sendMessageAsync(chatId, request);

    setContent("");
  }
  return (
    <div>
      <form
        onSubmit={(e) => onSendMessage(e)}
        className="flex justify-between items-center space-x-3 pl-4 pr-6"
      >
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          type="text"
          placeholder="Aa"
          className="bg-gray-200 rounded-3xl w-full py-2 px-4 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 outline-none transition-all duration-200"
        />
        <ClickableIcon icon={SendIconNormal} className="w-12 h-12 p-3" />
      </form>
    </div>
  );
}

export default ChatInput;
