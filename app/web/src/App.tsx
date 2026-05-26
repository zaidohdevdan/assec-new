import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import Benefits from "./pages/Benefits";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MemberArea from "./pages/MemberArea";
import Dashboard from "./pages/Dashboard";
import Inns from "./pages/Inns";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/layout/ProtectedRoute";

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="sobre" element={<About />} />
          <Route path="beneficios" element={<Benefits />} />
          <Route path="servicos" element={<Services />} />
          <Route path="pousadas" element={<Inns />} />
          <Route path="contato" element={<Contact />} />
          <Route path="area-associado" element={<MemberArea />} />

        </Route>

        {/* Rotas Protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}
