import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import UseAccessHook from "../hooks/UseAccessHook";
import Alert from "@mui/material/Alert";

const pageToAccessKeyMapping = {
  "/dashboard": "VIEW_DASHBOARD",
  "/users": "VIEW_USERS",
  "/orders": "VIEW_ORDERS",
  "/promo-codes": "VIEW_PROMOCODE",
  "/delivery_slot": "VIEW_DELIVERY_SLOT",
  "/delivery_boy": "VIEW_DELIVERY_BOY",
  "/offer-settings": "VIEW_OFFER_SETTINGS",
  "/delivery_charge": "VIEW_DELIVERY_CHARGES",
  "/category": "VIEW_CATEGORY",
  "/settings": "VIEW_SETTINGS",
  "/terms_and_conditions": "VIEW_TERMS_AND_CONDITIONS",
  "/push_notification": "VIEW_NOTIFICATIONS",
  "/privacy_and_policy": "VIEW_PRIVACY_SETTINGS",
  "/contact_us": "VIEW_CONTACT_US",
};

const ProtectedRoute = ({ children }) => {
  const user = window.localStorage.getItem("token");
  let location = useLocation();
  console.log("is User logged in =>", user, location);

  const [checkingAccess, hasAccess] = UseAccessHook(
    pageToAccessKeyMapping[location.pathname]
  );

  console.log("DOES USER HAVE ACCESS TO THIS ROUTE??", hasAccess);
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return !checkingAccess && hasAccess ? (
    children
  ) : (
    <Alert severity="info" style={{margin: '10px'}}>
      You do not have access to view this page. Please contact administrator at{" "}
      <i>albamart786@gmail.com or +917903423922</i>{" "}to know more.
    </Alert>
  );
};

export default ProtectedRoute;
