import DefaultAvatar from "assets/img/default-avatar.jpg";
import PropTypes from "prop-types";
import React from "react";

ImageCircle.propTypes = {
  src: PropTypes.string,
  className: PropTypes.string,
  alt: PropTypes.string,
  size: PropTypes.string,
};

function ImageCircle({
  src = DefaultAvatar,
  className = "",
  alt = "Avatar",
  size = "md",
}) {
  const xsSize = "h-6 w-6";
  const smSize = "h-8 w-8";
  const mdSize = "h-12 w-12";
  const lgSize = "h-16 w-16";
  const xlSize = "h-24 w-24";
  const fullSize = "h-full w-full";
  var realSize;
  switch (size) {
    case "xs":
      realSize = xsSize;
      break;
    case "sm":
      realSize = smSize;
      break;
    case "lg":
      realSize = lgSize;
      break;
    case "xl":
      realSize = xlSize;
      break;
    case "full":
      realSize = fullSize;
      break;
    default:
      realSize = mdSize;
  }
  return (
    <>
      <img
        className={
          realSize +
            " " +
            "select-none  rounded-full object-cover " +
            " " +
            className ?? ""
        }
        src={!src || src === "" ? DefaultAvatar : src}
        alt={alt}
      />
    </>
  );
}

export default ImageCircle;
