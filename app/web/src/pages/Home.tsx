import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import HeroSection from "../components/home/HeroSection";
import BenefitsSection from "../components/home/BenefitsSection";
import FeaturedServiceSection from "../components/home/FeaturedServiceSection";
import CtaSection from "../components/home/CtaSection";

export default function Home() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  // Se usuário está autenticado, redireciona para seu dashboard
  useEffect(() => {
    if (token && user) {
      const destination = user.role === "ADMIN" ? "/admin-dashboard" : "/dashboard";
      navigate(destination, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Se está sendo redirecionado, não renderizar a página
  if (token && user) {
    return null;
  }

  return (
    <>
      <HeroSection />
      <BenefitsSection />
      <FeaturedServiceSection />
      <CtaSection />
    </>
  );
}
