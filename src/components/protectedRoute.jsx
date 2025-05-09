import React from "react";
import { Navigate } from "react-router-dom";

export function isAuthenticated() {
  return !!localStorage.getItem("accessToken");
}

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    // Redirect to login if not authenticated
    return <Navigate to="/auth/login" replace />;
  }

  // Render the protected component if authenticated
  return children;
};

export default ProtectedRoute;