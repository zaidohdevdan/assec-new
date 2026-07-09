"use client";

import * as React from "react";
import Link from "next/link";
import { NewsImage } from "@/components/ui/NewsImage";
import { apiFetch } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Calendar, ArrowRight, ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Article {
  id: string;
  title: string;
  summary: string | null;
  content: string;
  type: string;
  tags: string[];
  coverImage: string | null;
  active: boolean;
  createdAt: string;
}

const FALLBACK_NEWS: Article[] = [
  {
    id: "1",
    title: "Vitória Jurídica: ASSEC assegura direitos de servidor em processo administrativo",
    summary: "Através da atuação da assessoria jurídica especializada da associação, foi revertida a decisão desfavorável e garantida a justa defesa profissional.",
    content: "",
    type: "Jurídico",
    tags: ["Defesa", "PAD", "Jurídico"],
    coverImage: null,
    active: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "2",
    title: "Nova parceria com rede de clínicas médicas oferece até 50% de desconto",
    summary: "Nova parceria amplia o leque de atendimento médico e exames laboratoriais em Fortaleza e Região Metropolitana para todos os associados e dependentes.",
    content: "",
    type: "Parcerias",
    tags: ["Saúde", "Convênio", "Descontos"],
    coverImage: null,
    active: true,
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "3",
    title: "Torneio Integração de Segurança Pública da ASSEC 2026",
    summary: "As inscrições estão abertas para o campeonato anual de futebol society. Venha integrar com as demais forças policiais do Ceará.",
    content: "",
    type: "Lazer",
    tags: ["Esporte", "Integração", "Lazer"],
    coverImage: null,
    active: true,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "4",
    title: "ASSEC discute pauta salarial da segurança pública com deputados estaduais",
    summary: "Diretoria reuniu-se com a comissão parlamentar para apresentar as demandas urgentes de valorização da carreira e infraestrutura de trabalho.",
    content: "",
    type: "Institucional",
    tags: ["Pauta Salarial", "Assembleia", "Diretoria"],
    coverImage: null,
    active: true,
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export function NewsCarousel() {
  const [articles, setArticles] = React.useState<Article[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    async function load() {
      try {
        const res = await apiFetch("/notices");
        if (res.ok) {
          const data: Article[] = await res.json();
          const activeOnes = data.filter(a => a.active);
          setArticles(activeOnes.length > 0 ? activeOnes : FALLBACK_NEWS);
        } else {
          setArticles(FALLBACK_NEWS);
        }
      } catch (err) {
        console.error("[NewsCarousel] Error fetching:", err);
        setArticles(FALLBACK_NEWS);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const nextSlide = () => {
    if (articles.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % articles.length);
  };

  const prevSlide = () => {
    if (articles.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-text-secondary gap-3 h-80">
        <div className="h-6 w-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        <span className="text-sm font-medium">Carregando notícias...</span>
      </div>
    );
  }

  // Slice news items for rendering (show current, prev, next in desktop grid or slide them)
  return (
    <section className="py-16 sm:py-24 bg-bg-page border-b border-border font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-accent-dark uppercase tracking-widest text-xs font-bold block mb-2">Comunicação</span>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-primary">
              Notícias Recentes & Avisos
            </h2>
            <p className="text-text-secondary text-sm sm:text-base mt-2 max-w-2xl">
              Fique por dentro das últimas decisões jurídicas, parcerias conveniadas e ações de valorização das forças de segurança do Ceará.
            </p>
          </div>
          
          {/* Nav buttons */}
          {articles.length > 1 && (
            <div className="flex items-center gap-2 self-start md:self-end">
              <button 
                onClick={prevSlide}
                className="p-2.5 rounded-full border border-border bg-white text-primary hover:bg-slate-50 hover:text-accent-dark transition-all focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label="Notícia anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={nextSlide}
                className="p-2.5 rounded-full border border-border bg-white text-primary hover:bg-slate-50 hover:text-accent-dark transition-all focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label="Próxima notícia"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Carousel Viewport */}
        <div className="relative">
          {/* Desktop/Tablet Layout: 3 Cards or Slider */}
          <div className="hidden md:grid grid-cols-3 gap-6">
            {/* Show 3 items starting from currentIndex */}
            {Array.from({ length: Math.min(3, articles.length) }).map((_, idx) => {
              const itemIdx = (currentIndex + idx) % articles.length;
              const article = articles[itemIdx];
              return (
                <ArticleCard key={article.id} article={article} />
              );
            })}
          </div>

          {/* Mobile Layout: 1 Card with sliding effect */}
          <div className="md:hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <ArticleCard article={articles[currentIndex]} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pagination dots for Mobile */}
          {articles.length > 1 && (
            <div className="flex justify-center gap-1.5 mt-8 md:hidden">
              {articles.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    currentIndex === idx ? "w-6 bg-accent-dark" : "w-2.5 bg-slate-300"
                  }`}
                  aria-label={`Ir para slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Call to action to see all news */}
        <div className="text-center mt-12">
          <Link
            href="/noticias"
            className="inline-flex items-center gap-2 text-accent-dark hover:text-primary font-bold transition-colors text-sm hover:underline"
          >
            <span>Ver todo o nosso informativo</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Card className="flex flex-col h-full bg-white border border-border hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden group">
      {/* Thumbnail */}
      <div className="relative w-full aspect-video bg-slate-100 overflow-hidden shrink-0">
        {article.coverImage ? (
          <NewsImage
            src={article.coverImage}
            alt={article.title}
            fill
            variant="card"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
            <ImageIcon className="h-10 w-10 mb-1" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">ASSEC Informativo</span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5">
        {/* Date and Category Tag */}
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest mb-3">
          <span className="px-2 py-0.5 rounded-full bg-primary/5 text-primary">
            {article.type}
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <Calendar className="h-3 w-3" />
            {new Date(article.createdAt).toLocaleDateString("pt-BR")}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-serif font-bold text-base text-primary mb-2 line-clamp-2 leading-snug group-hover:text-accent-dark transition-colors duration-200">
          {article.title}
        </h3>

        {/* Summary */}
        {article.summary && (
          <p className="text-text-secondary text-xs leading-relaxed mb-4 line-clamp-3">
            {article.summary}
          </p>
        )}

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4 mt-auto">
            {article.tags.slice(0, 3).map((t) => (
              <span key={t} className="text-[9px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Action Link */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
          <Link
            href={`/noticias/${article.id}`}
            className="inline-flex items-center gap-1 text-accent-dark font-bold text-xs group-hover:text-primary transition-colors hover:underline"
          >
            <span>Ler matéria</span>
            <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 duration-200" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
