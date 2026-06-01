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
import AdminRoute from "./components/layout/AdminRoute";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersManagement from "./pages/admin/UsersManagement";
import ContactMessages from "./pages/admin/ContactMessages";
import Layout from "./components/layout/Layout";

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
          {/* Rotas Públicas */}
          <Route index element={<Home />} />
          <Route path="sobre" element={<About />} />
          <Route path="beneficios" element={<Benefits />} />
          <Route path="servicos" element={<Services />} />
          <Route path="pousadas" element={<Inns />} />
          <Route path="contato" element={<Contact />} />
          <Route path="area-associado" element={<MemberArea />} />

        </Route>

        {/* Rotas Protegidas (usuários autenticados) */}
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>

        {/* Rotas Protegidas (admin) */}
        <Route element={<AdminRoute />}>
          <Route path="admin-dashboard" element={<AdminDashboard />} />
          <Route path="admin-usuarios" element={<UsersManagement />} />
          <Route path="admin-mensagens" element={<ContactMessages />} />
        </Route>
      </Routes>
    </Router>
  );
}
