import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "app/store";

import "./index.css";
import App from "./App";
import "boxicons/css/boxicons.min.css";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root"),
);
