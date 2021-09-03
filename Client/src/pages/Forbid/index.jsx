import React from "react";
import ForbidImg from "assets/img/forbid.jpg";
import Button from "components/Button";
import { Link } from "react-router-dom";

function Forbid({ message }) {
  return (
    <div className="fixed h-screen w-screen flex flex-col justify-center items-center space-y-8">
      <img className="w-1/3 object-cover" src={ForbidImg} alt="Error" />
      <span className="font-bold text-3xl">
        {message ?? "You don't have permission to access this resources"}
      </span>
      <Link to="/">
        <Button content="Return home page" />
      </Link>
    </div>
  );
}

export default Forbid;