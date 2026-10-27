import { MetadataRoute } from "next";
import { getServerApiBase } from "@/lib/api";

interface Notice {
  id: string;
  active: boolean;
  updatedAt: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://assecce.com.br";

  // Static routes
  const staticRoutes = [
    "",
    "/sobre",
    "/beneficios",
    "/noticias",
    "/contato",
    "/acessibilidade",
    "/associe-se",
    "/politica-de-privacidade",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/noticias" ? "daily" : "monthly",
    priority: route === "" ? 1.0 : route === "/associe-se" ? 0.9 : 0.8,
  }));

  // Dynamic routes: fetch active notices from backend
  let noticeEntries: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${getServerApiBase()}/notices`, {
      next: { revalidate: 60, tags: ["sitemap"] },
    });
    if (res.ok) {
      const notices: Notice[] = await res.json();
      noticeEntries = notices
        .filter((n) => n.active)
        .map((notice) => ({
          url: `${baseUrl}/noticias/${notice.id}`,
          lastModified: new Date(notice.updatedAt),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        }));
    }
  } catch (err) {
    // Fallback: if backend is down (e.g. during build), only return static routes
    console.warn("[sitemap] Failed to fetch notices, using static routes only:", err);
  }

  return [...staticEntries, ...noticeEntries];
}
