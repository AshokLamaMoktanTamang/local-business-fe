import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./layout/fulllayout";
import BusinessLayout from "./layout/businesslayout";
import Home from "./pages/home";
import BusinessDashboard from "./pages/businessDashboard";
import RegisterBusiness from "./pages/registerBusiness";
import MyBusiness from "./pages/myBusiness";

import "./App.scss";
import AdminLayout from "./layout/adminLayout";
import AdminBusiness from "./pages/adminBusiness";
import BusinessDetail from "./pages/businessDetailPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="" element={<Home />} />
          <Route path=":businessId" element={<BusinessDetail />} />
        </Route>

        <Route path="/business" element={<BusinessLayout />}>
          <Route path="" element={<BusinessDashboard />} />
          <Route path="register" element={<RegisterBusiness />} />
          <Route path="my-businesses" element={<MyBusiness />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="" element={<AdminBusiness />} />
        </Route>
      </Routes>
    </Router>
  );
}
