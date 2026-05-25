import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./Index.css";
import { AuthProvider } from "./context/authcontext";
import { RoleProvider } from "./context/rolecontext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RoleProvider>
        <App />
      </RoleProvider>
    </AuthProvider>
  </React.StrictMode>
);
