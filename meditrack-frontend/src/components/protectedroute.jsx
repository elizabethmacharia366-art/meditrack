import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/authcontext";
import { RoleContext } from "../context/rolecontext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  const { role } = useContext(RoleContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          info: "Please sign in with the correct account role.",
          role: allowedRoles.length === 1 ? allowedRoles[0] : "",
          from: location.pathname,
        }}
      />
    );
  }

  return children;
}
