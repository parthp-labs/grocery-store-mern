import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoute({ user, children, adminOnly, redirect = "/" }) {
  const location = useLocation();

  if (!user) {
    // toast.info("Please login to access cart");
    return (
      <Navigate
        to={`${redirect}?redirect_to=${location.pathname}${location.search}`}
      />
    );
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/account" />;
  }

  return children ? children : <Outlet />;
}

export default ProtectedRoute;
