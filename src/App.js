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
import DeliveryBoyDetails from "./delivery_boy/components/DeliveryBoyDetails";
import SubCategoryDetails from "./category/components/SubCategoryDetails"
import DeliveryCharge from "./delivery_charge";
import Register from "./authentication/Register";
import ForgotPassword from "./authentication/ForgotPassword";
import FAndQ from "./f_and_q";
import PushNotification from "./push_notification";
import PrivacyAndPolicy from "./privacy_and_policy";
import CategoryDetails from "./category";
import ContactDetails from "./contact_us";
import ProtectedRoute from "./authentication/ProtectedRoute";
import OrderPreview from "./orders/OrderPreview"; // Import the OrderPreview component

export default function App() {
  const protectedElement = (element) => (
    <ProtectedRoute>{element}</ProtectedRoute>
  );
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Login />} />
          <Route path="/register" exact element={<Register />} />
          <Route
            path="/reset-password"
            exact
            element={<ForgotPassword />}
          />
          <Route
            path="/promo-codes"
            exact
            element={protectedElement(<PromoCodes />)}
          />
          <Route
            path="/delivery_slot"
            exact
            element={protectedElement(<DeliverySlots />)}
          />
          <Route
            path="/delivery_boy"
            exact
            element={protectedElement(<DeliveryBoys />)}
          />
          <Route
            path="/delivery_charge"
            exact
            element={protectedElement(<DeliveryCharge />)}
          />
          <Route
            path="/terms_and_conditions"
            exact
            element={protectedElement(<TermsAndConditions />)}
          />
          <Route path="/f_and_q" exact element={protectedElement(<FAndQ />)} />
          <Route
            path="/dashboard"
            exact
            element={protectedElement(<Dashboard />)}
          />
          <Route path="/products" exact element={protectedElement(<Products />)} />
          <Route path="/users" exact element={protectedElement(<Users />)} />
          <Route path="/orders" exact element={protectedElement(<Orders />)} />
          <Route
            path="/settings"
            exact
            element={protectedElement(<Settings />)}
          />
          <Route
            path="/push_notification"
            exact
            element={protectedElement(<PushNotification />)}
          />
          <Route
            path="/privacy_and_policy"
            exact
            element={protectedElement(<PrivacyAndPolicy />)}
          />
          <Route
            path="/contact_us"
            exact
            element={protectedElement(<ContactDetails />)}
          />
          <Route
            path="/category"
            exact
            element={protectedElement(<CategoryDetails />)}
          />
          <Route
            path="/offer-settings"
            exact
            element={protectedElement(<OfferSettings />)}
          />
          <Route
            path="/offer-details/:id"
            exact
            element={protectedElement(<OfferDetailView />)}
          />
          <Route
            path="/order-details/:id"
            exact
            element={protectedElement(<OrderDetails />)}
          />
          <Route
            path="/edit-offer/:id"
            exact
            element={protectedElement(<EditOffer />)}
          />
          <Route
            path="/deliveryboy-details/:id"
            exact
            element={protectedElement(<DeliveryBoyDetails />)}
          />
          <Route
            path="/subCategory/:id"
            exact
            element={protectedElement(<SubCategoryDetails />)}
          />
          <Route
            path="/edit-offer/:id"
            exact
            element={protectedElement(<EditOffer />)}
          />
          <Route
            path="/order-preview/:id"
            element={protectedElement(<OrderPreview />)} // Add this route for OrderPreview
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}
