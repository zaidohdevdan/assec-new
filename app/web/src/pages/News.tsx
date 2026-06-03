import { motion } from "motion/react";
import { useState } from "react";
import { 
  CalendarDays, 
  Clock, 
  User, 
  ArrowRight, 
  Search, 
  Filter,
  Newspaper,
  Flame
} from "lucide-react";
import { Link } from "react-router-dom";
import XFeed from "../components/news/XFeed";

const CATEGORIES = ["Todas", "Institucional", "Segurança", "Benefícios", "Comunicados"];

const MOCK_NEWS = [
  {
    id: 1,
    category: "Institucional",
    title: "ASSEC conquista novos reajustes e ampliação de convênios para associados",
    excerpt: "Em reunião com a diretoria executiva, foram firmadas novas parcerias que reduzem em até 40% o custo de planos de saúde e odontológicos para servidores da segurança pública.",
    image: "/carousel_2.jpg",
    date: "02 de Junho, 2026",
    author: "Diretoria ASSEC",
    readTime: "4 min",
    isFeatured: true,
  },
  {
    id: 2,
    category: "Segurança",
    title: "Novas viaturas reforçam policiamento ostensivo no Ceará",
    excerpt: "O Governo do Estado realizou a entrega de uma nova frota de veículos equipados com tecnologia de ponta para a Polícia Militar do Ceará.",
    image: "/carousel_5.jpg",
    date: "31 de Maio, 2026",
    author: "Assessoria PMCE",
    readTime: "3 min",
    isFeatured: false,
  },
  {
    id: 3,
    category: "Benefícios",
    title: "Assistência Jurídica 24h registra recorde de atendimentos preventivos",
    excerpt: "O setor jurídico da ASSEC reportou um aumento no suporte preventivo, garantindo total retaguarda legal aos servidores em operações especiais.",
    image: "/carousel_1.jpg",
    date: "28 de Maio, 2026",
    author: "Jurídico ASSEC",
    readTime: "5 min",
    isFeatured: false,
  },
  {
    id: 4,
    category: "Institucional",
    title: "Profissionais da perícia forense participam de congresso nacional",
    excerpt: "Representantes da pericia forense cearense participaram do simpósio nacional de balística e química legal, trazendo novas metodologias para o estado.",
    image: "/carousel_3.jpg",
    date: "24 de Maio, 2026",
    author: "Perícia Forense",
    readTime: "4 min",
    isFeatured: false,
  },
  {
    id: 5,
    category: "Comunicados",
    title: "Tropa de choque realiza treinamento anual integrado de gerenciamento de crises",
    excerpt: "Simulação de operações complexas de preservação da ordem pública reuniu militares de diversas guarnições em Fortaleza.",
    image: "/carousel_4.jpg",
    date: "19 de Maio, 2026",
    author: "Comunicação Choque",
    readTime: "6 min",
    isFeatured: false,
  },
];

const MOST_READ = [
  { id: 1, title: "Calendário de reservas para pousadas de férias do segundo semestre", date: "01 de Junho, 2026" },
  { id: 2, title: "Suporte 24h: saiba como acionar o plantão em ocorrências noturnas", date: "29 de Maio, 2026" },
  { id: 3, title: "Parceria com faculdades concede bolsas de até 50% para dependentes", date: "26 de Maio, 2026" },
];

export default function News() {
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [searchQuery, setSearchQuery] = useState("");

  const featuredNews = MOCK_NEWS.find(n => n.isFeatured);
  const remainingNews = MOCK_NEWS.filter(n => !n.isFeatured);

  const filteredNews = remainingNews.filter(n => {
    const matchesCategory = selectedCategory === "Todas" || n.category === selectedCategory;
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          n.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ paddingBlock: "5rem 8rem" }}>
      <div className="content">
        
        {/* Header */}
        <header style={{ marginBottom: "4rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--gold)", fontWeight: 700, fontSize: "0.875rem", marginBottom: "1rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            <Newspaper size={18} /> Portal de Notícias
          </div>
          <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 850, color: "var(--ink)", marginBottom: "1rem", letterSpacing: "-0.03em" }}>
            Editorial & <span style={{ color: "var(--gold)", fontStyle: "italic", fontFamily: "Alumni Sans, sans-serif" }}>Informativos</span>
          </h1>
          <p style={{ fontSize: "1.125rem", color: "var(--ink-muted)", maxWidth: "800px", lineHeight: 1.6 }}>
            Acompanhe as últimas atualizações, conquistas da categoria, informativos jurídicos e eventos promovidos pela associação.
          </p>
        </header>

        {/* Featured / Editorial Section */}
        {featuredNews && (
          <section style={{ marginBottom: "5rem" }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border-gold)",
                borderRadius: "2.5rem",
                overflow: "hidden",
                boxShadow: "0 20px 40px rgba(180, 138, 29, 0.03)",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              }}
            >
              {/* Featured Image */}
              <div style={{ minHeight: "350px", position: "relative" }}>
                <img 
                  src={featuredNews.image} 
                  alt={featuredNews.title} 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <span style={{ position: "absolute", top: "1.5rem", left: "1.5rem", background: "var(--gold)", color: "oklch(0.08 0.008 60)", fontSize: "0.75rem", fontWeight: 800, padding: "0.35rem 0.75rem", borderRadius: "0.5rem", letterSpacing: "0.08em" }}>
                  EDITORIAL DESTAQUE
                </span>
              </div>

              {/* Featured Content */}
              <div style={{ padding: "clamp(2rem, 5vw, 3.5rem)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <span style={{ color: "var(--gold)", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
                  {featuredNews.category}
                </span>
                <h2 style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.25rem)", fontWeight: 900, lineHeight: 1.15, marginBottom: "1.25rem", color: "var(--ink)" }}>
                  {featuredNews.title}
                </h2>
                <p style={{ color: "var(--ink-muted)", fontSize: "1.05rem", lineHeight: 1.6, marginBottom: "2rem" }}>
                  {featuredNews.excerpt}
                </p>

                {/* Metadata */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", fontSize: "0.85rem", color: "var(--ink-muted)", marginBottom: "2rem", borderTop: "1px solid var(--border)", paddingTop: "1.25rem" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}><CalendarDays size={14} style={{ color: "var(--gold)" }} /> {featuredNews.date}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}><User size={14} style={{ color: "var(--gold)" }} /> {featuredNews.author}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}><Clock size={14} style={{ color: "var(--gold)" }} /> {featuredNews.readTime}</span>
                </div>

                <Link to="/contato" className="btn btn-primary" style={{ alignSelf: "flex-start" }}>
                  Ler Matéria Completa <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          </section>
        )}

        {/* Portal Body (Grid & Sidebar) */}
        <div className="portal-grid">
          
          {/* Main Feed Column */}
          <div style={{ flex: "2.3" }}>
            
            {/* Filter and Search Bar */}
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1.5rem", marginBottom: "2.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid var(--border)" }}>
              {/* Tabs */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "999px",
                      border: "1px solid",
                      borderColor: selectedCategory === cat ? "var(--gold)" : "var(--border)",
                      background: selectedCategory === cat ? "var(--gold-glow)" : "transparent",
                      color: selectedCategory === cat ? "var(--gold)" : "var(--ink-muted)",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div style={{ position: "relative", minWidth: "260px" }}>
                <Search size={16} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--ink-muted)", pointerEvents: "none" }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pesquisar notícias..."
                  className="form-input"
                  style={{
                    padding: "0.6rem 1rem 0.6rem 2.5rem",
                    borderRadius: "2rem",
                    fontSize: "0.875rem"
                  }}
                />
              </div>
            </div>

            {/* News Cards Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
              {filteredNews.length > 0 ? (
                filteredNews.map((news) => (
                  <motion.article
                    key={news.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -6 }}
                    transition={{
                      y: { type: "spring", stiffness: 300, damping: 20 },
                      default: { duration: 0.4 }
                    }}
                    className="card"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      padding: "1.25rem",
                      height: "100%",
                      borderRadius: "1.75rem",
                    }}
                  >
                    {/* Card Image */}
                    <div style={{ width: "100%", aspectRatio: "16/10", borderRadius: "1.25rem", overflow: "hidden", marginBottom: "1.25rem" }}>
                      <img 
                        src={news.image} 
                        alt={news.title} 
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>

                    {/* Category */}
                    <span style={{ color: "var(--gold)", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
                      {news.category}
                    </span>

                    {/* Title */}
                    <h3 style={{ fontSize: "1.125rem", fontWeight: 800, lineHeight: 1.25, marginBottom: "0.75rem", color: "var(--ink)" }}>
                      {news.title}
                    </h3>

                    {/* Excerpt */}
                    <p style={{ color: "var(--ink-muted)", fontSize: "0.875rem", lineHeight: 1.5, marginBottom: "1.5rem" }}>
                      {news.excerpt}
                    </p>

                    {/* Card Footer */}
                    <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--border)", paddingTop: "1rem", fontSize: "0.75rem", color: "var(--ink-muted)" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><CalendarDays size={12} /> {news.date}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><Clock size={12} /> {news.readTime}</span>
                    </div>
                  </motion.article>
                ))
              ) : (
                <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "4rem", color: "var(--ink-muted)" }}>
                  <Newspaper size={48} style={{ color: "var(--border-gold)", marginInline: "auto", marginBottom: "1rem" }} />
                  <p style={{ fontWeight: 600 }}>Nenhuma notícia encontrada para a busca.</p>
                </div>
              )}
            </div>

          </div>

          {/* Sidebar Column */}
          <aside style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            
            {/* Most Read Box */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "2rem", padding: "2rem", boxShadow: "0 10px 30px rgba(0,0,0,0.02)" }}>
              <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.25rem", fontWeight: 800, color: "var(--ink)", marginBottom: "1.5rem" }}>
                <Flame size={20} style={{ color: "var(--gold)" }} /> Mais Lidas
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {MOST_READ.map((item, idx) => (
                  <div key={item.id} style={{ display: "flex", gap: "1rem" }}>
                    <span style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--border-gold)", lineHeight: 1 }}>
                      0{idx + 1}
                    </span>
                    <div>
                      <a href="#link" style={{ color: "var(--ink)", fontWeight: 700, fontSize: "0.925rem", textDecoration: "none", lineHeight: 1.35, display: "block", marginBottom: "0.25rem" }}>
                        {item.title}
                      </a>
                      <span style={{ fontSize: "0.75rem", color: "var(--ink-muted)" }}>{item.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Twitter / X Live Feed */}
            <XFeed />

            {/* Newsletter Callbox */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "2rem", padding: "2rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
              <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 120%, oklch(0.75 0.12 72 / 0.05) 0%, transparent 60%)" }} />
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--ink)", marginBottom: "0.5rem", position: "relative" }}>
                Fique Informado
              </h3>
              <p style={{ color: "var(--ink-muted)", fontSize: "0.875rem", lineHeight: 1.5, marginBottom: "1.5rem", position: "relative" }}>
                Inscreva-se em nosso boletim semanal para receber notícias oficiais diretamente em seu e-mail.
              </p>
              <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: "0.875rem", position: "relative" }}>
                <input
                  type="email"
                  required
                  placeholder="Seu e-mail oficial"
                  className="form-input"
                  style={{
                    background: "var(--surface-2)"
                  }}
                />
                <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
                  Inscrever-se
                </button>
              </form>
            </div>

          </aside>

        </div>

      </div>
    </div>
  );
}
