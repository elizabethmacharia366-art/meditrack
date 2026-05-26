// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import {
  login as apiLogin,
  register as apiRegister,
  adminLogin as apiAdminLogin,
  setAuthToken,
} from "../service/api";

export const AuthContext = createContext();

const persist = (user, token) => {
  if (user) localStorage.setItem("user", JSON.stringify(user));
  else localStorage.removeItem("user");
  setAuthToken(token || null);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedToken) setAuthToken(storedToken);
    setLoading(false);
  }, []);

  // Calls the backend; if "role" is "admin", uses /auth/admin-login.
  const login = async ({ email, password, role }) => {
    const fn = role === "admin" ? apiAdminLogin : apiLogin;
    const { data } = await fn({ email, password, role });
    const nextUser = { id: data.id, name: data.name, email: data.email, role: data.role };
    setUser(nextUser);
    persist(nextUser, data.token);
    return nextUser;
  };

  const register = async ({
    name,
    email,
    password,
    role,
    location,
    hospitalName,
  }) => {
    const { data } = await apiRegister({
      name,
      email,
      password,
      role,
      location,
      hospitalName,
    });
    if (data.pending) {
      return {
        pending: true,
        message: data.message,
        verificationLink: data.verificationLink,
        ...data,
      };
    }
    if (!data.token) {
      return data;
    }
    const nextUser = { id: data.id, name: data.name, email: data.email, role: data.role };
    setUser(nextUser);
    persist(nextUser, data.token);
    return { ...nextUser, verificationLink: data.verificationLink };
  };

  const logout = () => {
    setUser(null);
    persist(null, null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
