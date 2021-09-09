import React from "react";
import PropTypes from "prop-types";

ClickableIcon.propTypes = {
  className: PropTypes.string,
  alt: PropTypes.string,
};

function ClickableIcon({ className, icon, alt, onClick, onBlur }) {
  return (
    <>
      <div
        onBlur={onBlur}
        onClick={onClick}
        className={
          "p-1 rounded-full hover:bg-gray-200 active:bg-gray-300 dark:hover:bg-gray-600 dark:active:bg-gray-700 transition-all duration-200 cursor-pointer ease-in active:scale-90 active:transform " +
          (className ?? "")
        }
      >
        <img
          alt={alt ?? "Clickable Icon"}
          src={icon}
          onClick={onClick}
          className="w-full"
        />
      </div>
    </>
  );
}

export default ClickableIcon;
