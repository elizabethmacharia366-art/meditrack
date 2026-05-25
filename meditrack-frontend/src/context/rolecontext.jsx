import React, { createContext, useContext } from "react";
import { AuthContext } from "./authcontext";

export const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const role = user?.role || "guest"; // patient, doctor, admin

  return (
    <RoleContext.Provider value={{ role }}>
      {children}
    </RoleContext.Provider>
  );
};
