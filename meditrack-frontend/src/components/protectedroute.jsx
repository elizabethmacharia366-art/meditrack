import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/authcontext";
import { RoleContext } from "../context/rolecontext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useContext(AuthContext);

  const { role } = useContext(RoleContext);

  console.log("AuthContext user:", user);
  console.log("RoleContext role:", role);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to={`/${role}`} replace />;
  }

  return children;
}
