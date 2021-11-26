import Logo from "logo.png";

const Loader = ({ className, isOpen = true }) => {
  let circleCommonClasses =
    "h-3 w-3 bg-gradient-to-br from-green-300 to-green-600 shadow-md rounded-full";

  return (
    <>
      <div
        className={
          "z-50 flex flex-col h-screen w-screen justify-center items-center fixed transition-all duration-200 bg-white dark:bg-dark-secondary" +
          " " +
          (isOpen ? "animate-fadeIn" : "animate-fadeOut") +
          (" " + className ?? "")
        }
      >
        <img src={Logo} className="w-20 h-20 mb-10" alt="logo" />
        <div className="flex justify-center items-center transition-all duration-200">
          <div className={`${circleCommonClasses} mr-3 animate-bounce`}></div>
          <div
            className={`${circleCommonClasses} mr-3 animate-bounce200`}
          ></div>
          <div className={`${circleCommonClasses} animate-bounce400`}></div>
        </div>
      </div>
    </>
  );
};

export default Loader;
