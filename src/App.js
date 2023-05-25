import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Products from "./pages/Products";
import Users from "./users";
import Orders from "./pages/Orders";
import Login from "./Login";
import Settings from "./pages/Settings";
import Dashboard from "./dashboard";
import OfferSettings from "./offers";
import OfferDetailView from "./offers/components/OfferDetailView";
import PromoCodes from "./promo_codes";
import DeliverySlots from "./delivery_slot";
import DeliveryBoys from "./delivery_boy";
import TermsAndConditions from "./terms_and_conditions";
import EditOffer from "./offers/components/EditOffer";
import OrderDetails from "./orders/OrderDetails";
import DeliveryCharge from "./delivery_charge";
import Register from "./authentication/Register";
import ForgotPassword from "./authentication/ForgotPassword";
import FAndQ from "./f_and_q";
import ProtectedRoute from "./authentication/ProtectedRoute";

export default function App() {
  const protectedElement = (element) => (
    <ProtectedRoute>{element}</ProtectedRoute>
  );
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Login />}></Route>
          <Route path="/register" exact element={<Register />}></Route>
          <Route
            path="/reset-password"
            exact
            element={<ForgotPassword />}
          ></Route>
          <Route
            path="/promo-codes"
            exact
            element={protectedElement(<PromoCodes />)}
          ></Route>
          <Route
            path="/delivery_slot"
            exact
            element={protectedElement(<DeliverySlots />)}
          ></Route>
          <Route path="/delivery_boy" exact element={protectedElement(<DeliveryBoys />)}></Route>
          <Route
            path="/delivery_charge"
            exact
            element={protectedElement(<DeliveryCharge />)}
          ></Route>
          <Route
            path="/terms_and_conditions"
            exact
            element={protectedElement(<TermsAndConditions />)}
          ></Route>
          <Route path="/f_and_q" exact element={protectedElement(<FAndQ />)}></Route>
          <Route path="/dashboard" exact element={protectedElement(<Dashboard />)}></Route>
          <Route path="/products" exact element={protectedElement(<Products />)}></Route>
          <Route path="/users" exact element={protectedElement(<Users />)}></Route>
          <Route path="/orders" exact element={protectedElement(<Orders />)}></Route>
          <Route path="/settings" exact element={protectedElement(<Settings />)}></Route>
          <Route
            path="/offer-settings"
            exact
            element={protectedElement(<OfferSettings />)}
          ></Route>
          <Route
            path="/offer-details/:id"
            exact
            element={protectedElement(<OfferDetailView />)}
          ></Route>
          <Route
            path="/order-details/:id"
            exact
            element={protectedElement(<OrderDetails />)}
          ></Route>
          <Route path="/edit-offer/:id" exact element={protectedElement(<EditOffer />)}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
