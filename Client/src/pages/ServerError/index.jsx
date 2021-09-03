import React from "react";
import ErrorImg from "assets/img/error.jpg";
import Button from "components/Button";
import { Link } from "react-router-dom";

function ServerError({ message }) {
  return (
    <div className="fixed h-screen w-screen flex flex-col justify-center items-center space-y-8">
      <img className="w-1/3 object-cover" src={ErrorImg} alt="Error" />
      <span className="font-bold text-3xl">
        {message ?? "Oops! Something went wrong!"}
      </span>
      <Link to="/">
        <Button content="Return home page" />
      </Link>
    </div>
  );
}

export default ServerError;
