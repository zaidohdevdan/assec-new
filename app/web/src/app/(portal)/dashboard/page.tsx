"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { FileText, Mail, Heart, ArrowRight } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { AdminAnalyticsSection } from "@/components/analytics/AdminAnalyticsSection";

interface MessageItem {
  id: string;
  read: boolean;
}

export default function DashboardPage() {
  const [stats, setStats] = React.useState({
    notices: 0,
    benefits: 0,
    messages: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [resNotices, resBenefits, resContact] = await Promise.all([
          apiFetch("/notices"),
          apiFetch("/benefits?all=true"),
          apiFetch("/contact"),
        ]);

        let noticesCount = 0;
        let benefitsCount = 0;
        let contactMessages: MessageItem[] = [];

        if (resNotices.ok) {
          const notices = await resNotices.json();
          noticesCount = notices.length;
        }

        if (resBenefits.ok) {
          const benefits = await resBenefits.json();
          benefitsCount = benefits.length;
        }

        if (resContact.ok) {
          contactMessages = await resContact.json();
        }

        setStats({
          notices: noticesCount,
          benefits: benefitsCount,
          messages: contactMessages.length,
          unreadMessages: contactMessages.filter((m) => !m.read).length,
        });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, []);

  return (
    <div className="space-y-8 animate-none">
      {/* Top Header */}
      <div>
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-primary">
          Métricas de Visitas
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Acompanhe o tráfego do portal (visitantes logados e públicos) e o resumo do acervo institucional.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center gap-4 p-6">
          <div className="p-4 bg-primary text-accent rounded-lg">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-primary block">
              {loading ? "..." : stats.notices}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Avisos e Notícias
            </span>
          </div>
        </Card>

        <Card className="flex items-center gap-4 p-6">
          <div className="p-4 bg-primary text-accent rounded-lg">
            <Heart className="h-6 w-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-primary block">
              {loading ? "..." : stats.benefits}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Benefícios Cadastrados
            </span>
          </div>
        </Card>

        <Link href="/portal/propostas" className="block group">
          <Card className="flex items-center justify-between gap-4 p-6 h-full transition-colors group-hover:border-accent">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-primary text-accent rounded-lg relative">
                <Mail className="h-6 w-6" />
                {!loading && stats.unreadMessages > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 h-5 min-w-5 px-1 bg-amber-500 text-primary rounded-full flex items-center justify-center text-[10px] font-extrabold">
                    {stats.unreadMessages}
                  </span>
                )}
              </div>
              <div>
                <span className="text-2xl font-extrabold text-primary block">
                  {loading ? "..." : stats.messages}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary block">
                  Propostas & Contatos
                </span>
                {!loading && stats.unreadMessages > 0 && (
                  <span className="text-[11px] font-bold text-amber-700">
                    {stats.unreadMessages} pendente(s)
                  </span>
                )}
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
          </Card>
        </Link>
      </div>

      {/* Analytics Section (Visitas Logados vs Não Logados) */}
      <AdminAnalyticsSection />
    </div>
  );
}
