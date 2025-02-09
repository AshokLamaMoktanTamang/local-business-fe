import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./layout/fulllayout";
import BusinessLayout from "./layout/businesslayout";
import Home from "./pages/home";
import BusinessDashboard from "./pages/businessDashboard";
import RegisterBusiness from "./pages/registerBusiness";
import MyBusiness from "./pages/myBusiness";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route element={<Home />} />
        </Route>

        <Route path="/business" element={<BusinessLayout />}>
          <Route element={<BusinessDashboard />} />
          <Route path="register" element={<RegisterBusiness />} />
          <Route path="my-businesses" element={<MyBusiness />} />
        </Route>
      </Routes>
    </Router>
  );
}
