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
          "px-4 py-2 rounded-lg transition-all text-sm md:text-base duration-200 disabled:opacity-50 outline-none z-0 select-none min-w-70 " +
          " " +
          (outline
            ? "ring-inset ring-1 ring-green-500 bg-white dark:bg-transparent dark:hover:bg-green-500 text-green-500 hover:text-white hover:bg-green-400 active:bg-green-500"
            : "bg-gradient-to-br from-green-400 to-green-600 text-white active:from-green-500 active:to-green-600  ") +
          " " +
          (className ?? "") +
          " " +
          (!disabled ? "active:scale-95 active:transform" : "cursor-default")
        }
      >
        {content}
      </button>
    </>
  );
}

export default Button;
