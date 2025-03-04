import React from "react";
import { Route, Routes } from "react-router-dom";
import Categories from "../Pages/Categories";
import Subcat from "../Pages/Subcat";
import Users from "../Pages/Users";
import Products from "../Pages/Products";
import Product from "../Pages/Product";
import AddProduct from "../Pages/AddProduct";
import Transaction from "../Pages/Transaction";
import Orders from "../Pages/Orders";
import NewOrder from "../Pages/NewOrder";
import UpdateOrder from "../Pages/UpdateOrder";
import Banners from "../Pages/Banners";
import Drivers from "../Pages/Drivers";
import Edit from "../Pages/Edit";
import Pincode from "../Pages/Pincode";
import Testimonial from "../Pages/Testimonial";
import Setting from "../Pages/Setting";
import Notification from "../Pages/Notification";
import NotificationLowWallet from "../Pages/NotificationLowWallet";
import DeliveryReport from "../Pages/DeliveryReport";
import UpcomingOrders from "../Pages/UpcomingOrders";
import UpcomingSubsOrder from "../Pages/UpcomingSubsOrder";
import Webappsetting from "../Pages/Webappsetting";
import Loocation from "../Pages/Loocation";
import Paymentgetway from "../Pages/Paymentgetway";
import Socialmedia from "../Pages/Socialmedia";
import InvoiceSettings from "../Pages/InvoiceSetting";

function Dashboard() {
  return (
    <div className="dashboard" style={{ padding: "10px 18px" }}>
      <Routes>
        <Route path="/" element={<DeliveryReport />} />
        <Route path="/DeliveryReport" element={<DeliveryReport />} />
        <Route path="/upcoming-orders" element={<UpcomingOrders />} />
        <Route path="/upcoming-subs-orders" element={<UpcomingSubsOrder />} />
        <Route path="/Categories" element={<Categories />} />
        <Route path="/subcategory" element={<Subcat />} />
        <Route path="/Users" element={<Users />} />
        <Route path="/Drivers" element={<Drivers />} />
        <Route path="/Products" element={<Products />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/Transaction" element={<Transaction />} />
        <Route path="/Orders" element={<Orders />} />
        <Route path="/neworder" element={<NewOrder />} />
        <Route path="/order/:id" element={<UpdateOrder />} />
        <Route path="/Banners" element={<Banners />} />
        <Route path="/About-Us" element={<Edit page={1} />} />
        <Route path="/Privicy" element={<Edit page={2} />} />
        <Route path="/Terms" element={<Edit page={3} />} />
        <Route path="/Pincode" element={<Pincode />} />
        <Route path="/Testimonial" element={<Testimonial />} />
        <Route path="/Setting" element={<Setting />} />
        <Route path="/Notification" element={<Notification />} />
        <Route
          path="/Low-Wallet-Notification"
          element={<NotificationLowWallet />}
        />
        <Route path="/web-app-setting" element={<Webappsetting />} />
        <Route path="/invoice-setting" element={<InvoiceSettings />} />
        <Route path="/delivery-location" element={<Loocation />} />
        <Route path="/payment-getway" element={<Paymentgetway />} />
        <Route path="/social-media" element={<Socialmedia />} />
        <Route path="*" element={<h2>Page not found</h2>} />
      </Routes>
    </div>
  );
}

export default Dashboard;
