import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authcontext";

// Shows a one-time greeting after login/registration, then a persistent
// "Welcome, <name>" header on subsequent visits to the dashboard.
export default function WelcomeBanner({ subtitle }) {
  const { user } = useContext(AuthContext);
  const [mode, setMode] = useState("none"); // "back" | "new" | "none"

  useEffect(() => {
    const greet = sessionStorage.getItem("greet");
    if (greet === "back" || greet === "new") {
      setMode(greet);
      sessionStorage.removeItem("greet");
    }
  }, []);

  if (!user) return null;

  const name = user.name || user.email || "there";

  const headline =
    mode === "new"
      ? `Welcome, ${name}! Your account is ready.`
      : mode === "back"
      ? `Welcome back, ${name}!`
      : `Welcome, ${name}`;

  const isHighlight = mode !== "none";

  return (
    <div
      className={
        "mb-6 rounded-lg p-4 shadow " +
        (isHighlight
          ? "bg-green-50 border border-green-200"
          : "bg-white border border-gray-100")
      }
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2
            className={
              "text-xl font-semibold " +
              (isHighlight ? "text-green-700" : "text-gray-800")
            }
          >
            {headline}
          </h2>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
        <span className="hidden sm:inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 capitalize">
          {user.role}
        </span>
      </div>
    </div>
  );
}
