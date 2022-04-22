import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App";
import { UserProvider } from "./Api/userContext";
import { MsgProvider } from "./Api/msgContext";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserProvider>
      <MsgProvider>
        <Router>
          <App />
        </Router>
      </MsgProvider>
    </UserProvider>
  </React.StrictMode>
);

reportWebVitals();
