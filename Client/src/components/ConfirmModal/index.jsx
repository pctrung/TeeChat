import Button from "components/Button";
import React from "react";
import PropTypes from "prop-types";

ConfirmModal.propTypes = {
  title: PropTypes.string,
  isOpen: PropTypes.bool,
  confirmButtonTitle: PropTypes.string,
  confirmButtonAction: PropTypes.func,
};

function ConfirmModal({
  title,
  isOpen,
  content = "Are you sure?",
  closeAction,
  confirmButtonTitle,
  confirmButtonAction,
}) {
  return (
    isOpen && (
      <div className="px-4 animate-fade h-screen fixed inset-0 w-screen flex justify-center items-center bg-gray-500 bg-opacity-30 z-50">
        <div className="bg-white py-8 px-8 w-full md:w-2/3 lg:w-2/5 flex flex-col justify-between items-start rounded-xl space-y-6">
          <h3 className="font-semibold text-2xl break-words">
            {title !== "" ? title : "Notification"}
          </h3>
          <span className="break-words">{content}</span>
          <div className="w-full flex justify-end space-x-2">
            <Button outline content="No" onClick={closeAction} />
            <Button
              content={confirmButtonTitle ?? "Ok"}
              onClick={confirmButtonAction}
            />
          </div>
        </div>
      </div>
    )
  );
}

export default ConfirmModal;
