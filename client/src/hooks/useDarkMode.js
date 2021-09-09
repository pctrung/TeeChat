import { useEffect, useState } from "react";

function useDarkMode() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    var mode = window.localStorage.getItem("theme");

    if (mode === "dark") {
      window.document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      window.document.documentElement.classList.add("dark");
      window.localStorage.setItem("theme", "dark");
    } else {
      window.document.documentElement.classList.remove("dark");
      window.localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return { darkMode, setDarkMode };
}

export default useDarkMode;
