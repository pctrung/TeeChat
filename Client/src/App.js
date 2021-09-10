import { setPopup } from "app/appSlice";
import Loader from "components/Loader";
import Popup from "components/Popup";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
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
          <Redirect exact from="/" to="/chats" />

          <Route path="/chats" component={Chat} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/notfound" component={NotFound} />
          <Route path="/forbid" component={Forbid} />
          <Route path="/ServerError" component={ServerError} />
          <Route component={Chat} />
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
