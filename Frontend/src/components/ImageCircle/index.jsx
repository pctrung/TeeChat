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
  const xsSize = "h-5 w-5 md:h-6 md:w-6";
  const smSize = "h-6 w-6 md:h-8 md:w-8";
  const mdSize = "h-10 w-10 md:h-12 md:w-12";
  const lgSize = "h-14 w-14 md:h-16 md:w-16";
  const xlSize = "h-22 w-22 md:h-24 md:w-24";
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
            "select-none bg-white rounded-full object-cover flex-shrink-0" +
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
