import React from "react";
import PropTypes from "prop-types";

Button.propTypes = {
  content: PropTypes.string,
  className: PropTypes.string,
};

function Button({
  outline = false,
  content,
  className,
  onClick,
  onBlur,
  disabled,
}) {
  return (
    <>
      <button
        disabled={disabled}
        onClick={onClick}
        onBlur={onBlur}
        className={
          "px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 outline-none z-0" +
          " " +
          (outline
            ? "border border-green-500 bg-white text-green-500 hover:text-white "
            : "bg-green-500 text-white  focus:ring-green-300 ") +
          " " +
          (className ?? "") +
          " " +
          (!disabled
            ? "hover:bg-green-600 active:bg-green-700 active:scale-95 active:transform"
            : "cursor-default")
        }
      >
        {content}
      </button>
    </>
  );
}

export default Button;
