import { setPopup } from "app/appSlice";
import { updateUser } from "app/userSlice";
import Button from "components/Button";
import useUserApi from "hooks/useUserApi";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

function UserInfo({ isOpen, setIsOpen, currentUser }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatar, setAvatar] = useState({});

  const userApi = useUserApi();
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
    const request = new FormData();
    request.append("Avatar", avatar);
    request.append("FirstName", firstName);
    request.append("LastName", lastName);

    userApi.updateUser(request).then((response) => {
      dispatch(updateUser(response));
      openPopup("Success", "Update info successfully!");
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
    <div className="animate-fade fixed inset-0 grid place-items-center h-screen w-screen px-4 py-10  z-30 bg-gray-500 bg-opacity-30 dark:bg-dark-primary dark:bg-opacity-50">
      <div
        ref={ref}
        className={
          "w-full md:w-5/6 lg:w-2/5 md:px-14 px-10 md:py-3 flex flex-col dark:bg-dark-secondary dark:border-dark-third bg-white rounded-xl shadow-xl border border-gray-300 transition-all duration-300"
        }
      >
        <h3 className="pt-6 pb-5 font-semibold text-2xl text-green-600 dark:text-green-400">
          User info!
        </h3>
        <div className="space-y-4">
          <div className="mb-3 flex flex-col md:grid md:grid-cols-2 md:place-items-start space-y-4 md:space-y-0">
            <div className="md:col-span-1 md:mr-2 space-y-2">
              <label
                htmlFor="fistName"
                className="text-lg font-semibold dark:text-dark-txt"
              >
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                type="text"
                className="bg-gray-100 dark:bg-dark-third rounded-lg w-full py-2 px-3 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 outline-none transition-all duration-200"
              />
            </div>
            <div className="md:col-span-1 md:ml-2 space-y-2">
              <label
                htmlFor="lastName"
                className="text-lg font-semibold dark:text-dark-txt"
              >
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                type="text"
                className="bg-gray-100 dark:bg-dark-third rounded-lg w-full py-2 px-3 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 outline-none transition-all duration-200 mb-2"
              />
            </div>
            <div className="space-y-2 flex flex-col">
              <label
                htmlFor="avatar"
                className="text-lg font-semibold dark:text-dark-txt"
              >
                Avatar
              </label>
              <input
                id="avatar"
                onChange={(e) => setAvatar(e.target.files[0])}
                type="file"
                className="w-full"
                accept="image/png, image/jpg, image/tiff, image/tif, image/jpeg"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 items-center py-6">
            <Button outline content="Close" onClick={() => setIsOpen(false)} />
            <Button content="Save" onClick={() => submit()} />
          </div>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}
export default UserInfo;
