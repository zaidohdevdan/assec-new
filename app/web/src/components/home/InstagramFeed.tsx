import { motion } from "motion/react";
import { Instagram, Heart, MessageCircle, ExternalLink } from "lucide-react";

const INSTAGRAM_POSTS = [
  {
    id: 1,
    image: "/carousel_1.jpg",
    likes: "342",
    comments: "28",
    caption: "Valorização e respeito. Policiais Penais na linha de frente garantindo a ordem e a segurança do Ceará. 👮‍♂️🔒 #ASSEC CE",
  },
  {
    id: 2,
    image: "/carousel_2.jpg",
    likes: "512",
    comments: "42",
    caption: "Registros da solenidade oficial de integração das forças de segurança do estado do Ceará. Juntos somos mais fortes! 🔥🚒 #ASSEC",
  },
  {
    id: 3,
    image: "/carousel_3.jpg",
    likes: "289",
    comments: "19",
    caption: "Visita e alinhamento com a equipe de perícia forense criminal em nosso laboratório. Ciência e precisão a serviço do cidadão. 🔬🔍",
  },
  {
    id: 4,
    image: "/carousel_4.jpg",
    likes: "420",
    comments: "35",
    caption: "Tropa de Choque pronta para atuar na preservação da ordem pública. Dedicação e coragem diária. 🛡️💪 #SegurançaCe",
  },
];

export default function InstagramFeed() {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "1.5rem",
        padding: "1.5rem",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.25rem",
          paddingBottom: "1rem",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "50%",
              background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
            }}
          >
            <Instagram size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: "1rem", fontWeight: 800, margin: 0, color: "var(--ink)" }}>
              Instagram Oficial
            </h3>
            <a
              href="https://www.instagram.com/assec_ce"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "0.8rem",
                color: "var(--gold)",
                textDecoration: "none",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              @assec_ce <ExternalLink size={10} />
            </a>
          </div>
        </div>

        <a
          href="https://www.instagram.com/assec_ce"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost"
          style={{
            padding: "0.5rem 1rem",
            fontSize: "0.8rem",
            borderRadius: "0.5rem",
          }}
        >
          Seguir
        </a>
      </div>

      {/* Grid of Posts */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "0.75rem",
        }}
      >
        {INSTAGRAM_POSTS.map((post) => (
          <a
            key={post.id}
            href="https://www.instagram.com/assec_ce"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              position: "relative",
              aspectRatio: "1/1",
              borderRadius: "0.75rem",
              overflow: "hidden",
              border: "1px solid var(--border)",
              display: "block",
            }}
          >
            {/* Image */}
            <img
              src={post.image}
              alt={post.caption}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transition: "transform 0.4s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.08)";
                const overlay = e.currentTarget.nextElementSibling as HTMLElement;
                if (overlay) overlay.style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                const overlay = e.currentTarget.nextElementSibling as HTMLElement;
                if (overlay) overlay.style.opacity = "0";
              }}
            />

            {/* Hover overlay with likes and comments */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0, 0, 0, 0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "1.25rem",
                opacity: 0,
                transition: "opacity 0.3s ease",
                pointerEvents: "none",
                color: "#fff",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontWeight: 700, fontSize: "0.9rem" }}>
                <Heart size={16} fill="#fff" /> {post.likes}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontWeight: 700, fontSize: "0.9rem" }}>
                <MessageCircle size={16} fill="#fff" /> {post.comments}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
