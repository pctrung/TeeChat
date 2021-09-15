import { useEffect, useState } from "react";
// import Logo from "logo.png";

const Loader = ({ className, isOpen = true }) => {
  let circleCommonClasses =
    "h-3 w-3 bg-gradient-to-br from-green-300 to-green-600 shadow-md rounded-full";
  const [isEnding, setIsEnding] = useState(false);
  useEffect(() => {
    return () => {
      setIsEnding(true);
    };
  }, []);
  return (
    isOpen && (
      <>
        <div
          className={
            "z-50  animate-fade flex flex-col h-screen w-screen justify-center items-center fixed transition-all duration-200 bg-white dark:bg-dark-secondary dark:bg-opacity-50 bg-opacity-50" +
            (isEnding ? " hidden" : "") +
            (" " + className ?? "")
          }
        >
          {/* <img
            src={Logo}
            className="animate-bounce w-20 h-20 mb-10"
            alt="logo"
          /> */}
          <div className="flex justify-center items-center transition-all duration-200">
            <div className={`${circleCommonClasses} mr-3 animate-bounce`}></div>
            <div
              className={`${circleCommonClasses} mr-3 animate-bounce200`}
            ></div>
            <div className={`${circleCommonClasses} animate-bounce400`}></div>
          </div>
        </div>
      </>
    )
  );
};

export default Loader;
