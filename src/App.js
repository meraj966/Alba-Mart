import React from 'react';
import {Routes, Route, BrowserRouter} from "react-router-dom";
import Products from "./pages/Products";
import Users from "./users";
import Orders from "./pages/Orders";
import Login from "./Login";
import Settings from './pages/Settings';
import Dashboard from "./dashboard";
import Coupan from "./pages/Coupan";
import OfferSettings from './offers';
import OfferDetailView from './offers/components/OfferDetailView';


export default function App() {
  return (
   <>
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<Login />}></Route>
        <Route path="/coupan" exact element={<Coupan />}></Route>
        <Route path="/dashboard" exact element={<Dashboard />}></Route>
        <Route path="/products" exact element={<Products />}></Route>
        <Route path="/users" exact element={<Users />}></Route>
        <Route path="/orders" exact element={<Orders />}></Route>
        <Route path="/settings" exact element={<Settings/>}></Route>
        <Route path="/offer-settings" exact element={<OfferSettings/>}></Route>
        <Route path="/offer-details/:id" exact element={<OfferDetailView/>}></Route>
      </Routes>
    </BrowserRouter>
   </>
  )
}
