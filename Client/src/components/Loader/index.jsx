import { useEffect, useState } from "react";

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
      <div
        className={
          "z-50  animate-fade flex h-screen w-screen justify-center items-center fixed transition-all duration-200 bg-white dark:bg-gray-800" +
          (isEnding ? " hidden" : "") +
          (" " + className ?? "")
        }
      >
        <div className={`${circleCommonClasses} mr-3 animate-bounce`}></div>
        <div className={`${circleCommonClasses} mr-3 animate-bounce200`}></div>
        <div className={`${circleCommonClasses} animate-bounce400`}></div>
      </div>
    )
  );
};

export default Loader;
