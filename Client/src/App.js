import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

import userApi from "api/userApi";
import { setPopup } from "app/appSlice";
import Loader from "components/Loader";
import Popup from "components/Popup";
import Chat from "./pages/Chat";
import Forbid from "./pages/Forbid";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import ServerError from "./pages/ServerError";

function App() {
  const isLoading = useSelector((state) => state.app.isLoading);
  const popup = useSelector((state) => state.app.popup);
  const dispatch = useDispatch();

  function closePopup() {
    dispatch(setPopup({ isOpen: false }));
  }
  return (
    <>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Loader isOpen={isLoading} className="z-50" />
        <Popup
          title={popup.title}
          isOpen={popup.isOpen}
          content={popup.content}
          onClick={closePopup}
        />

        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/forbid" component={Forbid} />
          <Route path="/ServerError" component={ServerError} />
          <PrivateRoute path="/chats" component={Chat} />
          <PrivateRoute exact path="/" component={Chat} />
          <Route path="*" component={NotFound} />
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;

function PrivateRoute({ component: Component, ...rest }) {
  const isLogin = window.localStorage.getItem("token") ? true : false;
  return (
    <Route
      {...rest}
      render={(props) =>
        isLogin === true ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  );
}
