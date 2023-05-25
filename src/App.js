import React from 'react';
import {Routes, Route, BrowserRouter} from "react-router-dom";
import Products from "./pages/Products";
import Users from "./users";
import Orders from "./pages/Orders";
import Login from "./Login";
import Settings from './pages/Settings';
import Dashboard from "./dashboard";
import OfferSettings from './offers';
import OfferDetailView from './offers/components/OfferDetailView';
import PromoCodes from './promo_codes';
import DeliverySlots from './delivery_slot';
import DeliveryBoys from './delivery_boy';
import TermsAndConditions from './terms_and_conditions';
import EditOffer from './offers/components/EditOffer';
import OrderDetails from './orders/OrderDetails';
import DeliveryCharge from './delivery_charge';
import Register from './authentication/Register';
import ForgotPassword from './authentication/ForgotPassword';

export default function App() {
  return (
   <>
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<Login />}></Route>
        <Route path="/register" exact element={<Register />}></Route>
        <Route path="/reset-password" exact element={<ForgotPassword />}></Route>
        <Route path="/promo-codes" exact element={<PromoCodes />}></Route>
        <Route path="/delivery_slot" exact element={<DeliverySlots />}></Route>
        <Route path="/delivery_boy" exact element={<DeliveryBoys />}></Route>
        <Route path='/delivery_charge' exact element={<DeliveryCharge/>}></Route>
        <Route path="/terms_and_conditions" exact element={<TermsAndConditions />}></Route>
        <Route path="/dashboard" exact element={<Dashboard />}></Route>
        <Route path="/products" exact element={<Products />}></Route>
        <Route path="/users" exact element={<Users />}></Route>
        <Route path="/orders" exact element={<Orders />}></Route>
        <Route path="/settings" exact element={<Settings/>}></Route>
        <Route path="/offer-settings" exact element={<OfferSettings/>}></Route>
        <Route path="/offer-details/:id" exact element={<OfferDetailView/>}></Route>
        <Route path="/order-details/:id" exact element={<OrderDetails/>}></Route>
        <Route path="/edit-offer/:id" exact element={<EditOffer/>}></Route>
      </Routes>
    </BrowserRouter>
   </>
  )
}
