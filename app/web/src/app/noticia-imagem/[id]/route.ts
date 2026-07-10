const API_BASE =
  process.env.INTERNAL_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3001";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const url = `${API_BASE}/notices/${id}`;
    const res = await fetch(url);
    if (!res.ok) {
      return new Response("Notícia não encontrada", { status: 404 });
    }
    const article = await res.json();
    const coverImage = article.coverImage;

    if (!coverImage) {
      return new Response("Sem imagem de capa", { status: 404 });
    }

    // 1. If it's already a public HTTP/HTTPS URL
    if (
      coverImage.startsWith("http") &&
      !coverImage.includes("localhost") &&
      !coverImage.includes("127.0.0.1") &&
      !coverImage.includes("backend:")
    ) {
      return Response.redirect(coverImage);
    }

    // 2. If it's a data URL (base64) - This is how it's stored in the DB
    if (coverImage.startsWith("data:")) {
      const matches = coverImage.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (!matches) {
        return new Response("Formato de imagem inválido", { status: 400 });
      }

      const contentType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, "base64");

      return new Response(buffer, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=86400, s-maxage=86400",
        },
      });
    }

    // 3. If it's a relative path (e.g. /uploads/image.jpg), fetch it from backend
    if (coverImage.startsWith("/")) {
      const imageRes = await fetch(`${API_BASE}${coverImage}`);
      if (imageRes.ok) {
        const imageBuffer = await imageRes.arrayBuffer();
        return new Response(imageBuffer, {
          headers: {
            "Content-Type": imageRes.headers.get("Content-Type") || "image/jpeg",
            "Cache-Control": "public, max-age=86400, s-maxage=86400",
          },
        });
      }
    }

    return new Response("Imagem não suportada", { status: 400 });
  } catch (err) {
    console.error("[NoticeImageAPI] Error serving cover image:", err);
    return new Response("Erro interno do servidor", { status: 500 });
  }
}
