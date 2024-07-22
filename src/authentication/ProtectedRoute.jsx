import React from "react";
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AppContext } from "../context";
import {
  generalAccessURLS,
  isAdminUser,
  userHasViewAccessToRoute,
} from "./utils";
import AccessDenied from "../components/reusable/AccessDenied";
import { ADMIN_URL } from "../urls";

const ProtectedRoute = ({ children, userInfo }) => {
  const user = window.localStorage.getItem("token");
  let location = useLocation();
  const hasAccess = generalAccessURLS.includes(location.pathname)
    ? true
    : location.pathname != ADMIN_URL
    ? userHasViewAccessToRoute(userInfo, location.pathname)
    : isAdminUser(userInfo);
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return hasAccess ? children : <AccessDenied />;
};

export default ProtectedRoute;
