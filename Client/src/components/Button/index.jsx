import React from "react";
import PropTypes from "prop-types";

Button.propTypes = {
  content: PropTypes.string,
  className: PropTypes.string,
};

function Button({ content, className, onClick, onBlur }) {
  return (
    <>
      <button
        onClick={onClick}
        onBlur={onBlur}
        className={
          "px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 active:bg-green-700 focus:ring-green-300 focus:ring-4 transition-all duration-200" +
          " " +
          (className ?? "")
        }
      >
        {content}
      </button>
    </>
  );
}

export default Button;
