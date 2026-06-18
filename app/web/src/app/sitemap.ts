import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://assecce.com.br";
  const routes = [
    "",
    "/sobre",
    "/beneficios",
    "/noticias",
    "/contato",
    "/acessibilidade",
    "/associe-se",
    "/politica-de-privacidade",
    "/validar-carteira",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/noticias" ? "daily" : "monthly",
    priority: route === "" ? 1.0 : route === "/associe-se" ? 0.9 : 0.8,
  }));
}
