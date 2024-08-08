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
import SubCategoryDetails from "./category/components/SubCategoryDetails";
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
import Variant from "./varient";
import VariantDetails from "./varient/components/VariantDetails";
import Admin from "./pages/Admin";
import { useContext } from "react";
import { AppContext } from "./context";
import * as URLS from "./urls";

function AppRoutes() {
  const { userInfo } = useContext(AppContext);

  const protectedElement = (element) => (
    <ProtectedRoute userInfo={userInfo}>{element}</ProtectedRoute>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path={URLS.HOME_URL} exact element={<Login />} />
        <Route path={URLS.REGISTER_URL} exact element={<Register />} />
        <Route
          path={URLS.RESET_PASSWORD_URL}
          exact
          element={<ForgotPassword />}
        />
        <Route
          path={URLS.PROMOCODE_URL}
          exact
          element={protectedElement(<PromoCodes />)}
        />
        <Route
          path={URLS.DELIVERY_SLOT_URL}
          exact
          element={protectedElement(<DeliverySlots />)}
        />
        <Route
          path={URLS.DELIVERY_BOY_URL}
          exact
          element={protectedElement(<DeliveryBoys />)}
        />
        <Route
          path={URLS.DELIVERY_CHARGE_URL}
          exact
          element={protectedElement(<DeliveryCharge />)}
        />
        <Route
          path={URLS.TERMS_AND_CONDITIONS_URL}
          exact
          element={protectedElement(<TermsAndConditions />)}
        />
        <Route
          path={URLS.FAQ_URL}
          exact
          element={protectedElement(<FAndQ />)}
        />
        <Route
          path={URLS.DASHBOARD_URL}
          exact
          element={protectedElement(<Dashboard />)}
        />
        <Route
          path={URLS.PRODUCTS_URL}
          exact
          element={protectedElement(<Products />)}
        />
        <Route
          path={URLS.VARIANT_URL}
          exact
          element={protectedElement(<Variant />)}
        />
        <Route
          path={URLS.USERS_URL}
          exact
          element={protectedElement(<Users />)}
        />
        <Route
          path={URLS.ORDERS_URL}
          exact
          element={protectedElement(<Orders />)}
        />
        <Route
          path={URLS.SETTINGS_URL}
          exact
          element={protectedElement(<Settings />)}
        />
        <Route
          path={URLS.PUSH_NOTIFICATION_URL}
          exact
          element={protectedElement(<PushNotification />)}
        />
        <Route
          path={URLS.PRIVACY_POLICY_URL}
          exact
          element={protectedElement(<PrivacyAndPolicy />)}
        />
        <Route
          path={URLS.CONTACT_US_URL}
          exact
          element={protectedElement(<ContactDetails />)}
        />
        <Route
          path={URLS.CATEGORY_URL}
          exact
          element={protectedElement(<CategoryDetails />)}
        />
        <Route
          path={URLS.OFFER_SETTINGS_URL}
          exact
          element={protectedElement(<OfferSettings />)}
        />
        <Route
          path={`${URLS.OFFER_DETAILS_URL}/:id`}
          exact
          element={protectedElement(<OfferDetailView />)}
        />
        <Route
          path={`${URLS.ORDER_DETAILS_URL}/:id`}
          exact
          element={protectedElement(<OrderDetails />)}
        />
        <Route
          path={`${URLS.DELIVERY_BOY_DETAILS_URL}/:id`}
          exact
          element={protectedElement(<DeliveryBoyDetails />)}
        />
        <Route
          path={`${URLS.VARIANT_DETAILS_URL}/:id`}
          exact
          element={protectedElement(<VariantDetails />)}
        />
        <Route
          path={`${URLS.SUB_CATEGORY_URL}/:id`}
          exact
          element={protectedElement(<SubCategoryDetails />)}
        />
        <Route
          path={`${URLS.EDIT_OFFER_DETAILS_URL}/:id`}
          exact
          element={protectedElement(<EditOffer />)}
        />
        <Route
          path={`${URLS.ORDER_PREVIEW_URL}/:id`}
          element={protectedElement(<OrderPreview />)} // Add this route for OrderPreview
        />
        <Route
          path={URLS.ADMIN_URL}
          element={protectedElement(<Admin />)} // Add this route for OrderPreview
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
