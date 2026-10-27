import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/portal/", "/campanhas/", "/login", "/api/"],
    },
    sitemap: "https://assecce.com.br/sitemap.xml",
  };
}
