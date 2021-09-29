import React from "react";
import NotFoundImg from "assets/img/not-found.jpg";
import Button from "components/Button";
import { Link } from "react-router-dom";

function NotFound({ message }) {
  return (
    <div className="animate-fadeIn fixed h-screen w-screen flex flex-col justify-center items-center space-y-8 px-2">
      <img className="md:w-1/3 object-cover" src={NotFoundImg} alt="Error" />
      <span className=" font-bold text-2xl md:text-3xl text-center">
        {message ?? "Not found resources"}
      </span>
      <Link to="/">
        <Button content="Return home page" />
      </Link>
    </div>
  );
}

export default NotFound;
