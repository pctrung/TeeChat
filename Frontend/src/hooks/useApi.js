import { setIsLoading, setPopup } from "app/appSlice";
import axios from "axios";
import queryString from "query-string";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

export default function useApi() {
  const dispatch = useDispatch();
  const history = useHistory();

  const Api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 300000,
    headers: {
      "Content-Type": "application/json",
    },
    paramsSerializer: (params) => queryString.stringify(params),
  });

  Api.interceptors.request.use(async (config) => {
    var token = window.localStorage.getItem("token");

    var newConfig = config;
    if (token) {
      newConfig = {
        ...config,
        headers: { Authorization: `Bearer ${token}` },
      };
    }
    return newConfig;
  });
  Api.interceptors.response.use(
    (response) => {
      dispatch(setIsLoading(false));

      if (response && response.data) {
        return response.data;
      }
      return response;
    },
    (error) => {
      dispatch(setIsLoading(false));
      var message =
        typeof error.response?.data === "string"
          ? error.response?.data
          : "Oops, something went wrong! Please contact administrator.";

      if (error.response) {
        switch (error.response.status) {
          case 401:
            window.localStorage.removeItem("token");
            history?.push("/login");
            break;
          case 403:
            history?.push("/ForBid");
            break;
          case 500:
            history?.push("/ServerError");
            break;
          default:
            // for model binding error
            message = error.response?.data?.errors
              ? objToString(error.response?.data?.errors)
              : message;

            if (!message.toLowerCase().includes("username or password")) {
              openPopup("Notification", message);
            }
            return Promise.reject(error.response?.data);
        }
      }
      if (!message.toLowerCase().includes("username or password")) {
        openPopup("Notification", message);
      }
      return Promise.reject(error?.response?.data);
    },
  );

  function openPopup(title, content) {
    const popup = {
      isOpen: true,
      title: title,
      content: content,
    };
    dispatch(setPopup(popup));
  }
  function closePopup() {
    const popup = {
      isOpen: false,
    };
    dispatch(setPopup(popup));
  }

  return Api;
}

// utils function for model binding convert
function objToString(obj) {
  let str = "";
  for (const val of Object.values(obj)) {
    str += `${val.toString()}, `;
  }
  str = str.substring(0, str.length - 2);
  return str;
}
