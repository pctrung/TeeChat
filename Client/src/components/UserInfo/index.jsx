import React, { useEffect, useRef, useState } from "react";

import { useDispatch } from "react-redux";
import userApi from "api/userApi";
import { setIsLoading, setPopup } from "app/appSlice";
import { updateUser } from "app/userSlice";
import Button from "components/Button";

function UserInfo({ isOpen, setIsOpen, currentUser }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatar, setAvatar] = useState({});

  const ref = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (isOpen && ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (currentUser.firstName && currentUser.lastName) {
      setFirstName(currentUser.firstName);
      setLastName(currentUser.lastName);
    }
  }, [currentUser]);

  async function submit() {
    await dispatch(setIsLoading(true));

    const request = new FormData();
    request.append("Avatar", avatar);
    request.append("FirstName", firstName);
    request.append("LastName", lastName);

    userApi
      .updateUser(request)
      .then((response) => {
        dispatch(updateUser(response));
        dispatch(setIsLoading(false));
        openPopup("Success", "Update info successfully!");
      })
      .catch((error) => {
        var message =
          typeof error === "string" ? error : "Something went wrong!";
        dispatch(setIsLoading(false));
        openPopup("Notification", message);
      });
    setIsOpen(false);
  }
  function openPopup(title, content) {
    const popup = {
      isOpen: true,
      title: title,
      content: content,
    };
    dispatch(setPopup(popup));
  }

  return isOpen ? (
    <div className="animate-fade fixed inset-0 grid place-items-center h-screen w-screen px-4 z-30">
      <div
        ref={ref}
        className={
          "md:px-5 md:py-3 flex flex-col bg-white rounded-xl shadow-xl border border-gray-300 w-full md:w-5/6 lg:w-2/5 transition-all duration-300"
        }
      >
        <div className="flex px-10 pt-6 pb-5 space-x-7 justify-between h-full items-center">
          <h3 className="font-semibold text-2xl text-green-600">User info!</h3>
        </div>
        <div className="px-10 space-y-4">
          <div className="mb-3 grid grid-cols-2 place-items-start ">
            <div className="col-span-1 space-y-2 mr-2">
              <label htmlFor="fistName" className="text-lg font-semibold ">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                type="text"
                className="bg-gray-100 rounded-lg w-full py-2 px-3 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 outline-none transition-all duration-200"
              />
            </div>
            <div className="col-span-1 space-y-2 ml-2">
              <label htmlFor="lastName" className="text-lg font-semibold ">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                type="text"
                className="bg-gray-100 rounded-lg w-full py-2 px-3 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 outline-none transition-all duration-200 mb-2"
              />
            </div>
          </div>
          <div className="space-y-2 mr-2 flex flex-col">
            <label htmlFor="avatar" className="text-lg font-semibold ">
              Avatar
            </label>
            <input
              id="avatar"
              onChange={(e) => setAvatar(e.target.files[0])}
              type="file"
              accept="image/png, image/jpg, image/tiff, image/tif, image/jpeg"
            />
          </div>
          <div className="flex justify-end  py-6 space-x-4">
            <div className="space-x-2 flex items-center flex-end">
              <Button
                outline
                content="Close"
                onClick={() => setIsOpen(false)}
              />
              <Button content="Save" onClick={() => submit()} />
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}
export default UserInfo;
