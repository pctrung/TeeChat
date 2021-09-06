import React from "react";
import DefaultAvatar from "assets/img/default-avatar.jpg";
import PropTypes from "prop-types";

ImageCircle.propTypes = {
  src: PropTypes.string,
  className: PropTypes.string,
  alt: PropTypes.string,
  size: PropTypes.string,
};

function ImageCircle({
  src = DefaultAvatar,
  className,
  alt = "Avatar",
  size = "md",
}) {
  const smSize = "h-6 w-6";
  const mdSize = "h-12 w-12";
  const lgSize = "h-16 w-16";
  const xlSize = "h-24 w-24";
  const fullSize = "h-full w-full";
  var realSize;
  switch (size) {
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
    <div>
      <img
        className={
          realSize + " " + "rounded-full object-cover " + " " + className ?? ""
        }
        src={src}
        alt={alt}
      />
    </div>
  );
}

export default ImageCircle;
