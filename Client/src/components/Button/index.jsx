import React from "react";
import PropTypes from "prop-types";

Button.propTypes = {
  content: PropTypes.string,
  className: PropTypes.string,
};

function Button({ content, className, onClick, onBlur, disabled }) {
  return (
    <>
      <button
        disabled={disabled}
        onClick={onClick}
        onBlur={onBlur}
        className={
          "px-4 py-2 rounded-lg bg-green-500 text-white  focus:ring-green-300 focus:ring-4 transition-all duration-200 disabled:opacity-50 outline-none" +
          " " +
          (className ?? "") +
          " " +
          (!disabled
            ? "hover:bg-green-600 active:bg-green-700"
            : "cursor-default")
        }
      >
        {content}
      </button>
    </>
  );
}

export default Button;
