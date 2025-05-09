import React from "react";
import { Navigate } from "react-router-dom";

export function isAuthenticated() {
  return !!localStorage.getItem("access_token");
}

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {

    return <Navigate to="/auth/login" replace />;
  }

  // Render the protected component if authenticated
  return children;
};

export default ProtectedRoute;