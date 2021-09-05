import Button from "components/Button";
import React from "react";
import PropTypes from "prop-types";

Popup.propTypes = {
  title: PropTypes.string,
  isOpen: PropTypes.bool,
  onClick: PropTypes.func,
};

function Popup({ title, isOpen, content, onClick }) {
  return (
    isOpen && (
      <div className="px-4 animate-fade h-screen fixed w-screen flex justify-center items-center bg-gray-500 bg-opacity-30 z-50">
        <div className="bg-white py-8 px-8 w-full md:w-2/3 lg:w-2/5 flex flex-col justify-between items-start rounded-xl space-y-6">
          <h3 className="font-semibold text-2xl break-all">
            {title !== "" ? title : "Notification"}
          </h3>
          <span className="break-all">
            {content ?? "Something went wrong!"}
          </span>
          <div className="w-full flex justify-end">
            <Button content="Close" onClick={onClick} />
          </div>
        </div>
      </div>
    )
  );
}

export default Popup;
