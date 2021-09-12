import React from "react";
import PropTypes from "prop-types";

ClickableIcon.propTypes = {
  className: PropTypes.string,
  alt: PropTypes.string,
};

function ClickableIcon({ className, icon, iconClass, alt, onClick, onBlur }) {
  return (
    <>
      <div
        onBlur={onBlur}
        onClick={onClick}
        className={
          "p-1 rounded-full hover:bg-gray-200 active:bg-gray-300 dark:hover:bg-dark-hover dark:border-dark-third transition-all duration-200 cursor-pointer ease-in dark:active:bg-dark-third active:scale-90 active:transform select-none " +
          (className ?? "")
        }
      >
        {icon ? (
          <img
            alt={alt ?? "Clickable Icon"}
            src={icon}
            onClick={onClick}
            className="w-full"
          />
        ) : (
          <i
            className={
              "text-center align-middle text-xl text-black dark:text-dark-txt w-7 h-7 " +
              " " +
              iconClass
            }
          ></i>
        )}
      </div>
    </>
  );
}

export default ClickableIcon;
