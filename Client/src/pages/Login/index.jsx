import Button from "components/Button";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import LoginPageImage from "assets/img/login-page.jpg";
import Logo from "logo.svg";
import userApi from "api/userApi";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "app/userSlice";
import { setIsLoading } from "app/appSlice";

function Login() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    if (username && password) {
      setIsDirty(true);
    } else {
      setIsDirty(false);
    }
  }, [username, password]);
  function login(e) {
    e.preventDefault();

    dispatch(setIsLoading(true));

    const request = { username, password };
    setError("");

    userApi
      .login(request)
      .then((response) => {
        dispatch(getCurrentUser());
        window.localStorage.setItem("token", response);
        history.push("/chats");
        dispatch(setIsLoading(false));
      })
      .catch((error) => {
        var message =
          typeof error === "string"
            ? error
            : "Username or password is incorrect";
        setError(message);
        dispatch(setIsLoading(false));
      });
  }
  return (
    <div className="h-screen grid md:grid-cols-7 place-items-center px-6">
      <img
        src={LoginPageImage}
        alt="login"
        className="md:block hidden col-span-3 w-full ml-44"
      />
      <form
        onSubmit={(e) => login(e)}
        className="container rounded-2xl flex flex-col py-10 md:w-auto md:col-span-4"
      >
        <img src={Logo} alt="login" className="h-20 w-20 mx-auto mb-3" />
        <h1 className="text-3xl font-bold text-primary text-green-600 text-center mb-8">
          Login to TeeChat!
        </h1>

        {error && (
          <span className="bg-red-500 rounded-md text-white text-lg mb-2 py-2 text-center">
            {error ?? "Username or password is incorrect"}
          </span>
        )}
        <div className="space-y-2 mb-3">
          <label htmlFor="username" className="text-lg font-semibold px-1">
            Username or email address
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            id="username"
            type="text"
            className="bg-gray-100 rounded-lg w-full py-2 px-4 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 outline-none transition-all duration-200 mb-2"
          />
        </div>
        <div className="space-y-2 mb-2">
          <label htmlFor="password" className="text-lg font-semibold px-1">
            Password
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            id="password"
            className="bg-gray-100 rounded-lg w-full py-2 px-4 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 outline-none transition-all duration-200"
          />
        </div>

        <Button
          disabled={!isDirty}
          content="Login"
          className="mb-4 mt-2 font-bold"
        />
        <div className="text-center">
          Not a member?{" "}
          <Link to="/register" className="text-green-500 font-bold">
            Sign up now
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
