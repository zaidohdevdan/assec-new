import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Campanha de Filiação | ASSEC",
  description:
    "Associe-se à ASSEC — Associação dos Servidores da Segurança do Ceará. Desconto de 5% em folha e benefícios exclusivos.",
  robots: { index: false, follow: false }, // não indexar landing pages de campanha
};

export default function CampaignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0d1f3c] to-[#0a1628]">
      {children}
    </div>
  );
}
