import { useEffect, useState } from "react";

const Loader = ({ className, isOpen = true }) => {
  let circleCommonClasses = "h-3 w-3 bg-green-300 rounded-full";
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
          "z-50  animate-fade flex h-screen w-screen justify-center items-center fixed transition-all duration-200 bg-white " +
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
