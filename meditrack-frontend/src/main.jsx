import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./Index.css";
import { AuthProvider } from "./context/AuthContext";
import { RoleProvider } from "./context/RoleContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RoleProvider>
        <App />
      </RoleProvider>
    </AuthProvider>
  </React.StrictMode>
);
