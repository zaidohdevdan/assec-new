import * as React from "react";
import { redirect } from "next/navigation";
import { NoticiasClient, type Article } from "./NoticiasClient";

const API_BASE =
  process.env.INTERNAL_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3001";

async function getNotices(): Promise<Article[]> {
  try {
    const res = await fetch(`${API_BASE}/notices`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    }
  } catch (err) {
    console.error("[getNotices] Fetch failed:", err);
  }
  return [];
}

export default async function NoticiasPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  if (id) {
    redirect(`/noticias/${id}`);
  }

  const initialArticles = await getNotices();

  return <NoticiasClient initialArticles={initialArticles} />;
}
