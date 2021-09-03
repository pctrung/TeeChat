import { useEffect, useState } from "react";

const Loader = () => {
  let circleCommonClasses = "h-3 w-3 bg-green-300 rounded-full";
  const [isEnding, setIsEnding] = useState(false);
  useEffect(() => {
    return () => {
      setIsEnding(true);
    };
  }, []);
  return (
    <div
      className={
        "flex h-screen w-screen justify-center items-center transition-all duration-200" +
        (isEnding ? "opacity-0" : "")
      }
    >
      <div className={`${circleCommonClasses} mr-3 animate-bounce`}></div>
      <div className={`${circleCommonClasses} mr-3 animate-bounce200`}></div>
      <div className={`${circleCommonClasses} animate-bounce400`}></div>
    </div>
  );
};

export default Loader;
