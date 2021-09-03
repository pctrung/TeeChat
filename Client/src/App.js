import React from "react";
import { BrowserRouter, Switch, Redirect, Route } from "react-router-dom";

import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Forbid from "./pages/Forbid";
import ServerError from "./pages/ServerError";

function App() {
  return (
    <>
      <BrowserRouter>
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
