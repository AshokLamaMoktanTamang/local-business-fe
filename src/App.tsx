import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./layout/fulllayout";
import Home from "./pages/home";
// import Layout from "@/components/Layout";
// import Home from "@/pages/Home";
// import About from "@/pages/About";
// import Contact from "@/pages/Contact";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} /> */}
          {/* Add more routes as needed */}
        </Routes>
      </Layout>
    </Router>
  );
}
