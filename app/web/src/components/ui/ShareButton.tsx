"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Share2,
  Check,
  X,
  Download,
  Copy,
  Smartphone,
  MessageSquare,
  ImageIcon,
  Type,
  Palette,
  LayoutTemplate
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ShareButtonProps {
  article: {
    id: string;
    title: string;
    summary: string | null;
    coverImage: string | null;
    type: string;
    createdAt: string;
  };
}

export function ShareButton({ article }: ShareButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"whatsapp" | "instagram">("whatsapp");
  const [resumo, setResumo] = React.useState("");
  const [format, setFormat] = React.useState<"feed" | "story">("feed");
  const [theme, setTheme] = React.useState<"azul" | "dourado" | "moderno">("azul");
  const [includeCoverImage, setIncludeCoverImage] = React.useState(true);
  const [copiedText, setCopiedText] = React.useState(false);
  const [isCopiedLink, setIsCopiedLink] = React.useState(false);
  const [isRendering, setIsRendering] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const logoImageRef = React.useRef<HTMLImageElement | null>(null);
  const coverImageCache = React.useRef<{ [src: string]: HTMLImageElement }>({});

  // Initialize summary
  React.useEffect(() => {
    if (article) {
      setResumo(
        article.summary ||
        `Confira a matéria completa sobre "${article.title}" no portal oficial da ASSEC Ceará.`
      );
    }
  }, [article]);

  // Load logo utility with caching
  const getLogo = (): Promise<HTMLImageElement> => {
    if (logoImageRef.current) return Promise.resolve(logoImageRef.current);
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = "/escudo-logo.webp";
      img.onload = () => {
        logoImageRef.current = img;
        resolve(img);
      };
      img.onerror = (e) => reject(e);
    });
  };

  // Load cover image utility with caching and CORS settings
  const getCoverImage = (src: string): Promise<HTMLImageElement | null> => {
    if (!src) return Promise.resolve(null);
    if (coverImageCache.current[src]) return Promise.resolve(coverImageCache.current[src]);
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      img.onload = () => {
        coverImageCache.current[src] = img;
        resolve(img);
      };
      img.onerror = () => {
        console.warn("CORS/Load error for cover image:", src);
        setImageError(true);
        resolve(null);
      };
    });
  };

  // Wrap text on Canvas 2D
  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine ? currentLine + " " + word : word;
      const testWidth = ctx.measureText(testLine).width;
      if (testWidth > maxWidth) {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
    return lines;
  };

  // Main canvas drawing logic
  const drawCanvas = React.useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsRendering(true);
    setImageError(false);

    // Dimensions
    const isFeed = format === "feed";
    canvas.width = 1080;
    canvas.height = isFeed ? 1080 : 1920;

    // 1. Draw Background Gradient
    let gradient;
    if (theme === "azul") {
      gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#0B1A30");
      gradient.addColorStop(1, "#050C16");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle decorative lines (Gold/White)
      ctx.strokeStyle = "rgba(255, 213, 79, 0.08)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height * 0.1, 400, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = "rgba(255, 224, 130, 0.05)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.7);
      ctx.lineTo(canvas.width, canvas.height * 0.78);
      ctx.moveTo(0, canvas.height * 0.73);
      ctx.lineTo(canvas.width, canvas.height * 0.81);
      ctx.stroke();
    } else if (theme === "dourado") {
      gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#E2A93E");
      gradient.addColorStop(0.5, "#FFD54F");
      gradient.addColorStop(1, "#B57C1E");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Gold pattern
      ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 450, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      // moderno (escuro)
      gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#1F2937");
      gradient.addColorStop(1, "#111827");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Cyber Grid
      ctx.strokeStyle = "rgba(59, 130, 246, 0.08)";
      ctx.lineWidth = 2;
      for (let i = 0; i < canvas.width; i += 120) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
    }

    const textColor = theme === "dourado" ? "#0B1A30" : "#FFFFFF";
    const subtitleColor = theme === "dourado" ? "#060F1E" : "#FFC107";
    const bodyTextColor = theme === "dourado" ? "#1e293b" : "rgba(255, 255, 255, 0.9)";

    // 2. Draw ASSEC Logo
    const logoY = isFeed ? 70 : 120;
    const logoHeight = isFeed ? 130 : 160;
    const logoWidth = logoHeight;
    const logoX = (canvas.width - logoWidth) / 2;

    try {
      const logoImg = await getLogo();
      ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);
    } catch {
      ctx.fillStyle = subtitleColor;
      ctx.font = "bold 44px Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText("ASSEC", canvas.width / 2, logoY + 80);
    }

    // Branding text
    ctx.fillStyle = textColor;
    ctx.textAlign = "center";
    ctx.font = "bold 20px sans-serif";
    ctx.letterSpacing = "4px";
    const brandingY = logoY + logoHeight + 35;
    ctx.fillText("ASSOCIAÇÃO DOS SERVIDORES DA SEGURANÇA DO CEARÁ", canvas.width / 2, brandingY);

    // 3. Draw Cover Image
    let currentY = brandingY + 60;
    let hasImage = false;

    if (includeCoverImage && article.coverImage) {
      try {
        const coverImg = await getCoverImage(article.coverImage);
        if (coverImg) {
          const imgWidth = 900;
          const imgHeight = isFeed ? 360 : 480;
          const imgX = (canvas.width - imgWidth) / 2;
          const imgY = currentY;

          ctx.save();
          // Clip path for rounded corners
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(imgX, imgY, imgWidth, imgHeight, 24);
          } else {
            ctx.rect(imgX, imgY, imgWidth, imgHeight);
          }
          ctx.clip();

          // Object-cover crop math
          const imgRatio = coverImg.width / coverImg.height;
          const targetRatio = imgWidth / imgHeight;
          let sx = 0, sy = 0, sWidth = coverImg.width, sHeight = coverImg.height;

          if (imgRatio > targetRatio) {
            sWidth = coverImg.height * targetRatio;
            sx = (coverImg.width - sWidth) / 2;
          } else {
            sHeight = coverImg.width / targetRatio;
            sy = (coverImg.height - sHeight) / 2;
          }

          ctx.drawImage(coverImg, sx, sy, sWidth, sHeight, imgX, imgY, imgWidth, imgHeight);
          ctx.restore();

          // Border around image
          ctx.strokeStyle = theme === "dourado" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.15)";
          ctx.lineWidth = 4;
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(imgX, imgY, imgWidth, imgHeight, 24);
          } else {
            ctx.rect(imgX, imgY, imgWidth, imgHeight);
          }
          ctx.stroke();

          currentY += imgHeight + 50;
          hasImage = true;
        }
      } catch {
        console.warn("Falling back without cover image");
      }
    }

    // 4. Draw Title
    ctx.fillStyle = textColor;
    ctx.textAlign = "left";
    ctx.font = isFeed ? "bold 42px Georgia, serif" : "bold 48px Georgia, serif";

    const titleX = 90;
    const maxWidth = 900;
    const titleLineHeight = isFeed ? 54 : 60;
    const titleLines = wrapText(ctx, article.title, maxWidth);

    // Story visual balance adjustment
    if (!isFeed && !hasImage) {
      currentY += 140;
    }

    titleLines.forEach((line) => {
      ctx.fillText(line, titleX, currentY);
      currentY += titleLineHeight;
    });

    currentY += 24;

    // 5. Draw Summary
    if (resumo) {
      ctx.fillStyle = bodyTextColor;
      ctx.font = isFeed ? "italic 26px sans-serif" : "italic 30px sans-serif";
      const summaryLineHeight = isFeed ? 40 : 46;
      const summaryLines = wrapText(ctx, resumo, maxWidth);

      summaryLines.forEach((line) => {
        // Enforce boundary check to avoid clipping in Feed mode
        if (isFeed && hasImage && currentY > canvas.height - 180) {
          return;
        }
        ctx.fillText(line, titleX, currentY);
        currentY += summaryLineHeight;
      });
    }

    // 6. Draw Footer Info
    ctx.fillStyle = subtitleColor;
    ctx.textAlign = "center";
    ctx.font = "bold 22px sans-serif";
    ctx.letterSpacing = "2px";
    const footerY = canvas.height - 90;

    // Footer divider
    ctx.strokeStyle = theme === "dourado" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.12)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(90, footerY - 45);
    ctx.lineTo(990, footerY - 45);
    ctx.stroke();

    ctx.fillText("Leia a notícia completa em: assecce.com.br", canvas.width / 2, footerY);

    setIsRendering(false);
  }, [article, resumo, format, theme, includeCoverImage]);

  // Redraw when settings change
  React.useEffect(() => {
    if (isOpen && activeTab === "instagram") {
      const timer = setTimeout(() => {
        drawCanvas();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, activeTab, drawCanvas]);

  const handleCopyLink = async () => {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}/noticias/${article.id}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setIsCopiedLink(true);
    setTimeout(() => setIsCopiedLink(false), 2000);
  };

  const handleWhatsAppShare = () => {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}/noticias/${article.id}`;
    const formattedText = `🚨 *${article.title}*\n\n${resumo}\n\n👉 Acesse a matéria completa no portal da ASSEC:\n${url}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(formattedText)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const handleCopyText = async () => {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}/noticias/${article.id}`;
    const formattedText = `🚨 *${article.title}*\n\n${resumo}\n\n👉 Acesse a matéria completa no portal da ASSEC:\n${url}`;
    try {
      await navigator.clipboard.writeText(formattedText);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    const cleanTitle = article.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove accents
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    link.download = `assec-${cleanTitle}-${format}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-lg border shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 bg-white text-primary border-slate-200 hover:bg-slate-50 hover:text-accent-dark focus-visible:ring-accent-dark"
        >
          <Share2 className="h-4 w-4" />
          <span>Compartilhar</span>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-all duration-300" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-6 md:p-8 z-50 w-[92vw] max-w-4xl max-h-[92vh] overflow-y-auto border border-slate-200 font-sans focus:outline-none">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <div>
              <Dialog.Title className="text-xl font-bold font-serif text-primary flex items-center gap-2">
                <Share2 className="h-5 w-5 text-accent-dark" />
                Compartilhar Notícia
              </Dialog.Title>
              <Dialog.Description className="text-xs text-text-muted mt-1">
                Aumente a visibilidade divulgando informações oficiais no WhatsApp e Instagram.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          {/* Sharing Channel Tabs */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-xl mb-6">
            <button
              onClick={() => setActiveTab("whatsapp")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold tracking-wide transition-all ${
                activeTab === "whatsapp"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <MessageSquare className="h-4 w-4 text-[#25D366]" />
              WhatsApp (Texto)
            </button>
            <button
              onClick={() => setActiveTab("instagram")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold tracking-wide transition-all ${
                activeTab === "instagram"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Smartphone className="h-4 w-4 text-[#C13584]" />
              Instagram (Imagem Card)
            </button>
          </div>

          {/* Main Layout Area */}
          <div className="flex flex-col lg:flex-row gap-8 items-stretch">
            
            {/* Controls Side */}
            <div className="flex-1 flex flex-col gap-6">
              {/* Textarea to customize summary */}
              <div>
                <Textarea
                  label="1. Elabore o Resumo da Notícia"
                  value={resumo}
                  onChange={(e) => setResumo(e.target.value)}
                  maxLength={300}
                  className="min-h-[100px] text-xs leading-relaxed"
                  hint="Este resumo será usado na mensagem do WhatsApp e na arte do Instagram."
                />
                <span className="text-[10px] text-right block text-text-muted mt-1">
                  {resumo.length}/300 caracteres
                </span>
              </div>

              {activeTab === "whatsapp" ? (
                /* WHATSAPP ACTIONS CONTAINER */
                <div className="flex flex-col gap-4 bg-slate-50 p-5 rounded-xl border border-slate-150">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                    <Type className="h-4 w-4 text-primary" />
                    Visualização da mensagem
                  </h4>
                  <div className="bg-white border border-slate-200 rounded-lg p-4 font-mono text-[11px] text-slate-600 whitespace-pre-wrap select-all leading-relaxed shadow-sm">
                    {`🚨 *${article.title}*\n\n${resumo}\n\n👉 Acesse a matéria completa no portal da ASSEC:\nhttps://assecce.com.br/noticias/${article.id}`}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-2">
                    <Button
                      onClick={handleWhatsAppShare}
                      className="flex-1 bg-[#25D366] hover:bg-[#20BA56] border-none text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      {/* WhatsApp Icon */}
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.455L0 24zm6.59-4.846c1.66.986 3.298 1.448 5.355 1.449 5.483 0 9.944-4.461 9.947-9.948.002-2.657-1.026-5.155-2.896-7.028-1.87-1.872-4.363-2.902-7.027-2.903-5.485 0-9.947 4.461-9.95 9.948-.002 2.085.546 4.12 1.587 5.922l-.992 3.626 3.725-.976zm11.39-4.908c-.302-.15-1.787-.882-2.063-.982-.277-.1-.478-.15-.68.15-.201.3-.778.982-.953 1.183-.176.2-.352.226-.654.076-.301-.15-1.274-.47-2.426-1.498-.896-.8-1.501-1.787-1.678-2.088-.176-.302-.019-.465.132-.615.136-.135.302-.35.453-.526.15-.175.201-.3.301-.5.101-.2.05-.376-.025-.526-.075-.15-.68-1.637-.932-2.24-.246-.59-.497-.51-.68-.52-.176-.008-.377-.01-.578-.01-.201 0-.528.075-.804.376-.277.302-1.056 1.03-1.056 2.512 0 1.48 1.077 2.913 1.228 3.114.15.2 2.119 3.235 5.133 4.537.717.31 1.277.495 1.713.633.72.23 1.375.197 1.892.12.576-.087 1.787-.73 2.039-1.432.251-.703.251-1.304.176-1.432-.076-.127-.277-.201-.578-.352z" />
                      </svg>
                      Enviar pelo WhatsApp
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCopyText}
                      className="border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 rounded-lg py-2.5"
                    >
                      {copiedText ? (
                        <>
                          <Check className="h-4 w-4 text-emerald-500" />
                          Texto Copiado
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copiar Texto
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                /* INSTAGRAM CONFIG CONTAINER */
                <div className="flex flex-col gap-5">
                  {/* Format Selector */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <LayoutTemplate className="h-4 w-4 text-primary" />
                      2. Escolha o Formato da Imagem
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setFormat("feed")}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                          format === "feed"
                            ? "border-primary bg-primary/5 text-primary ring-2 ring-primary/20"
                            : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                        }`}
                      >
                        <span className="w-8 h-8 rounded border-2 border-current aspect-square block shrink-0" />
                        <div className="text-center">
                          <span className="block text-xs font-bold">Quadrado (1:1)</span>
                          <span className="block text-[10px] opacity-75">Feed e Zap</span>
                        </div>
                      </button>
                      <button
                        onClick={() => setFormat("story")}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                          format === "story"
                            ? "border-primary bg-primary/5 text-primary ring-2 ring-primary/20"
                            : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                        }`}
                      >
                        <span className="w-6 h-9 rounded border-2 border-current block shrink-0" />
                        <div className="text-center">
                          <span className="block text-xs font-bold">Vertical (9:16)</span>
                          <span className="block text-[10px] opacity-75">Stories</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Themes Selector */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Palette className="h-4 w-4 text-primary" />
                      3. Selecione o Tema de Cores
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setTheme("azul")}
                        className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                          theme === "azul"
                            ? "border-[#0B1A30] bg-[#0B1A30] text-white ring-2 ring-[#0B1A30]/30 shadow-md"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        Azul ASSEC
                      </button>
                      <button
                        onClick={() => setTheme("dourado")}
                        className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                          theme === "dourado"
                            ? "border-[#E2A93E] bg-[#FFD54F] text-slate-900 ring-2 ring-[#E2A93E]/30 shadow-md"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        Dourado Nobre
                      </button>
                      <button
                        onClick={() => setTheme("moderno")}
                        className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                          theme === "moderno"
                            ? "border-[#1F2937] bg-[#1F2937] text-white ring-2 ring-[#1F2937]/30 shadow-md"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        Moderno Escuro
                      </button>
                    </div>
                  </div>

                  {/* Capa Image Toggle */}
                  {article.coverImage && (
                    <label className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-3 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors select-none">
                      <input
                        type="checkbox"
                        checked={includeCoverImage}
                        onChange={(e) => setIncludeCoverImage(e.target.checked)}
                        className="rounded border-slate-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                      />
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                        <ImageIcon className="h-4 w-4 text-slate-500" />
                        Incluir imagem de capa da notícia
                      </div>
                    </label>
                  )}

                  {/* CORS Error Alert if image loading fails */}
                  {imageError && (
                    <div className="bg-amber-50 border-l-4 border-amber-500 p-3.5 rounded-r-lg text-[11px] text-amber-800 leading-relaxed shadow-sm">
                      ⚠️ A imagem de capa não pôde ser renderizada no card devido às políticas de segurança do servidor de mídia (CORS). O card foi gerado apenas com texto e logotipo.
                    </div>
                  )}

                  <Button
                    onClick={handleDownload}
                    disabled={isRendering}
                    className="w-full bg-primary hover:bg-primary-light text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all mt-2"
                  >
                    <Download className="h-4 w-4" />
                    Baixar Imagem de Compartilhamento
                  </Button>
                </div>
              )}
            </div>

            {/* Preview Side */}
            <div className="flex-initial w-full lg:w-[350px] flex flex-col items-center">
              <div className="w-full relative p-6 rounded-2xl bg-gradient-to-tr from-slate-200 to-slate-50 border border-white flex flex-col items-center justify-center min-h-[350px] shadow-inner">
                {/* Decorative title badge */}
                <div className="absolute top-2 px-3.5 py-1 bg-white/70 backdrop-blur-md border border-white/40 rounded-full text-[9px] font-bold text-slate-500 uppercase tracking-widest shadow-sm z-10">
                  Visualização do Card
                </div>

                {activeTab === "instagram" ? (
                  <div className="relative border border-slate-350 rounded-xl overflow-hidden shadow-2xl bg-slate-900 transition-all flex items-center justify-center p-1 w-full max-w-[280px]">
                    <canvas
                      ref={canvasRef}
                      className="w-full shadow-lg rounded-lg object-contain"
                      style={{
                        aspectRatio: format === "feed" ? "1/1" : "9/16",
                      }}
                    />
                    {isRendering && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center text-xs font-semibold text-slate-600 gap-2">
                        <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Renderizando...
                      </div>
                    )}
                  </div>
                ) : (
                  /* Mock phone message bubbles for WhatsApp */
                  <div className="w-full max-w-[280px] bg-[#E5DDD5] border border-slate-300 rounded-xl shadow-2xl p-4 flex flex-col gap-3 min-h-[320px] relative justify-end">
                    <div className="absolute inset-0 bg-[radial-gradient(#dfdcd6_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
                    
                    {/* Mock bubble */}
                    <div className="bg-white rounded-lg p-3 shadow-sm max-w-[85%] text-[10px] text-slate-800 relative self-start border border-slate-100 flex flex-col gap-1.5 animate-none">
                      <p className="font-semibold text-[#075E54] text-[9px]">ASSEC Ceará</p>
                      <p className="leading-relaxed">Participe divulgando as novidades da segurança pública!</p>
                      <span className="text-[7px] text-right block text-slate-400">10:50</span>
                    </div>

                    {/* Shared news bubble */}
                    <div className="bg-[#DCF8C6] rounded-lg p-3 shadow-md max-w-[90%] text-[10px] text-slate-800 relative self-end flex flex-col gap-2 border border-[#c1e6a6]">
                      {article.coverImage && (
                        <div className="w-full aspect-[2/1] bg-slate-200 rounded overflow-hidden relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={article.coverImage}
                            alt="Mock preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-slate-900 leading-tight text-[9px]">
                          {article.title}
                        </p>
                        <p className="text-slate-600 mt-1 line-clamp-3 leading-relaxed text-[8px]">
                          {resumo}
                        </p>
                        <p className="text-blue-600 underline mt-1 text-[8px] truncate">
                          {`https://assecce.com.br/noticias/${article.id}`}
                        </p>
                      </div>
                      <span className="text-[7px] text-right block text-slate-400">10:51</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Dialog Footer Actions */}
          <div className="border-t border-slate-100 pt-5 mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-[10px] text-slate-400 block text-center sm:text-left leading-normal">
              Para compartilhar no Instagram Feed/Stories, baixe a imagem e publique pelo app.
            </span>
            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={handleCopyLink}
                className="flex-1 sm:flex-none border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 rounded-lg py-2"
              >
                {isCopiedLink ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-500" />
                    Link Copiado
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4" />
                    Copiar Link
                  </>
                )}
              </Button>
            </div>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
