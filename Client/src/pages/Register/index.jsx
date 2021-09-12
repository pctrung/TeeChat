import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import * as yup from "yup";

import Logo from "logo.png";
import userApi from "api/userApi";
import { setIsLoading } from "app/appSlice";
import LoginPageImage from "assets/img/login-page.jpg";
import Button from "components/Button";
import Popup from "components/Popup";

function Register() {
  const [isChanged, setIsChanged] = useState(false);
  const [isExistsUserName, setIsExistsUserName] = useState(true);
  const [popup, setPopup] = useState({
    isOpen: false,
    content: "",
    title: "Notification",
  });

  const dispatch = useDispatch();
  const history = useHistory();

  // yup validation
  const schema = yup.object().shape({
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
    userName: yup
      .string()
      .required("User Name is required")
      .min(6, "Username must be 6-20 characters")
      .max(20, "Username must be 6-20 characters")
      .test(
        "checkUsername",
        "Username does not contain special characters",
        (value) => {
          return checkRegex(
            value,
            "^(?=[a-zA-Z0-9._])(?!.*[_.]{2})[^_.].*[^_.]$",
          );
        },
      )
      .test(
        "existsUsername",
        "Username is already taken",
        (value) => !isExistsUserName,
      ),
    email: yup
      .string()
      .required("Email is required")
      .test("checkEmail", "Email is invalid", (value) => {
        return checkRegex(
          value,
          /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
        );
      }),
    password: yup
      .string()
      .required("Password is required")
      .test(
        "checkPassword",
        "Passwords must be at least 6 characters, one digit, one uppercase, one non alphanumeric character",
        (value) => {
          return checkRegex(
            value,
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[#$^+=!*()@%&]).{8,}$",
          );
        },
      ),
    confirmPassword: yup
      .string()
      .required("Confirm Password is required")
      .test(
        "ConfirmPasswordMatch",
        "Password and Confirmation Password must match",
        (confirmPassword) => {
          return confirmPassword === watch.password;
        },
      ),
  });

  // react hook form
  const {
    register,
    handleSubmit,
    control,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {},
  });
  const watch = useWatch({
    control,
  });

  useEffect(() => {
    userApi.checkUserNameExists(watch.userName).then((response) => {
      if (response.isExists) {
        setError(
          "userName",
          {
            type: "required",
            message: `Username '${watch.userName}' is already taken`,
          },
          { shouldFocus: true },
        );
        setIsExistsUserName(true);
      } else {
        clearErrors("userName");
        setIsExistsUserName(false);
      }
    });
  }, [watch.userName]);

  useEffect(() => {
    const onChange = () => {
      var isValid =
        watch.firstName &&
        watch.lastName &&
        watch.userName &&
        watch.email &&
        watch.password &&
        watch.confirmPassword;

      if (isValid) {
        setIsChanged(true);
        return;
      }
      setIsChanged(false);
    };

    onChange();
  }, [watch]);

  // handle submit
  const onSubmit = (content) => {
    dispatch(setIsLoading(true));

    userApi
      .register(content)
      .then((response) => {
        openPopup(
          "Success",
          <span>
            "Create account successfully! Please{" "}
            <Link className="font-bold text-green-600" to="/login">
              log in
            </Link>
            !"
          </span>,
        );
        reset({});
      })
      .catch((error) => {
        const message =
          typeof error === "string"
            ? error
            : "Cannot create account. Oops! Something went wrong!";
        openPopup("Create account failed", message);
      });
    dispatch(setIsLoading(false));
  };

  function openPopup(title, content) {
    const popup = {
      isOpen: true,
      title: title,
      content: content,
    };
    setPopup(popup);
  }

  return (
    <>
      <Popup
        title={popup.title}
        isOpen={popup.isOpen}
        content={popup.content}
        onClick={() => {
          setPopup({ isOpen: false });
          history.push("/login");
        }}
      />
      <div className="z-10 h-screen grid md:grid-cols-7 place-items-center px-6">
        <img
          src={LoginPageImage}
          alt="login"
          className="md:block hidden col-span-3 w-full ml-44"
        />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="container rounded-2xl flex flex-col py-10 md:w-full md:col-span-4 md:px-20 lg:px-48"
        >
          <img src={Logo} alt="login" className="h-20 w-20 mx-auto mb-3" />
          <h1 className="text-3xl font-bold text-primary text-green-600 text-center mb-8">
            Sign up to TeeChat!
          </h1>
          <div className="mb-3 grid grid-cols-2 place-items-start ">
            <div className="col-span-1 space-y-2 mr-2 w-full">
              <label htmlFor="fistName" className="text-lg font-semibold ">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register("firstName")}
                type="text"
                className="bg-gray-100 rounded-lg w-full py-2 px-3 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 outline-none transition-all duration-200"
              />
              <div className="text-red-500 text-sm">
                {errors.firstName?.message}
              </div>
            </div>
            <div className="col-span-1 space-y-2 ml-2 w-full">
              <label htmlFor="lastName" className="text-lg font-semibold ">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register("lastName")}
                type="text"
                className="bg-gray-100 rounded-lg w-full py-2 px-3 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 outline-none transition-all duration-200 mb-2"
              />
              <div className="text-red-500 text-sm">
                {errors.lastName?.message}
              </div>
            </div>
          </div>
          <div className="space-y-2 mb-3">
            <label htmlFor="userName" className="text-lg font-semibold ">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              {...register("userName")}
              type="text"
              className="bg-gray-100 rounded-lg w-full py-2 px-3 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 outline-none transition-all duration-200 mb-2"
            />
            <div className="text-red-500 text-sm">
              {errors.userName?.message}
            </div>
          </div>
          <div className="space-y-2 mb-3">
            <label htmlFor="email" className="text-lg font-semibold ">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              {...register("email")}
              type="text"
              className="bg-gray-100 rounded-lg w-full py-2 px-3 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 outline-none transition-all duration-200 mb-2"
            />
            <div className="text-red-500 text-sm">{errors.email?.message}</div>
          </div>

          <div className="space-y-2 mb-2">
            <label htmlFor="password" className="text-lg font-semibold ">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              {...register("password")}
              className="bg-gray-100 rounded-lg w-full py-2 px-3 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 outline-none transition-all duration-200"
            />
            <div className="text-red-500 text-sm">
              {errors.password?.message}
            </div>
          </div>
          <div className="space-y-2 mb-2">
            <label htmlFor="confirmPassword" className="text-lg font-semibold ">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              {...register("confirmPassword")}
              className="bg-gray-100 rounded-lg w-full py-2 px-3 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 outline-none transition-all duration-200"
            />
            <div className="text-red-500 text-sm">
              {errors.confirmPassword?.message}
            </div>
          </div>
          <Button
            disabled={!isChanged}
            content="Sign Up"
            className="mb-4 mt-2 font-bold"
          />
          <div className="text-center">
            Already a member?{" "}
            <Link to="/login" className="text-green-500 font-bold">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}

export default Register;

function checkRegex(value, regex) {
  if (value && regex) {
    var pattern = new RegExp(regex);
    var res = pattern.test(value);
    return res;
  }
}
