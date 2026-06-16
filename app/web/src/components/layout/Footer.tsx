import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { FileText, Phone, Mail, MapPin, Instagram } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-gray-300 border-t border-primary-light font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Institution */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3.5 text-white focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none p-0.5 rounded group w-fit">
              <Image
                src="/logo-transparent.png"
                alt="ASSEC Logo"
                width={56}
                height={56}
                className="h-14 w-auto transition-transform duration-300 group-hover:scale-105"
              />
              
              {/* Vertical Divider Art */}
              <div className="h-10 w-[1.5px] bg-gradient-to-b from-accent via-accent/40 to-transparent self-center rounded-full opacity-85" />
              
              <div className="flex flex-col justify-center">
                <span className="font-serif font-extrabold text-lg leading-none tracking-wider text-white group-hover:text-accent transition-colors duration-300">
                  ASSEC
                </span>
                <span className="text-[7.5px] font-sans font-bold uppercase tracking-wider text-accent mt-1 block max-w-[280px] leading-tight">
                  Associação dos Servidores da Segurança do Ceará
                </span>
              </div>
            </Link>
            <p className="text-xs leading-relaxed text-gray-400 font-normal pr-4">
              Associação dos Servidores da Segurança do Ceará. Transparência, representatividade e força para a nossa categoria.
            </p>
            <div className="flex flex-col gap-2 text-xs text-gray-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-accent mt-0.5" />
                <span className="leading-relaxed">Av. Santos Dumont, 1510, Sala 805, Aldeota, Fortaleza - CE, CEP 60.150-161</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-3.5 w-3.5 shrink-0 text-accent" />
                <a href="tel:85999411411" className="hover:text-accent-light transition-colors duration-200 font-medium">(85) 99941-1411</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-3.5 w-3.5 shrink-0 text-accent" />
                <a href="mailto:contato@assecce.com.br" className="hover:text-accent-light transition-colors duration-200 font-medium">contato@assecce.com.br</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Instagram className="h-3.5 w-3.5 shrink-0 text-accent" />
                <a 
                  href="https://instagram.com/assec.ceara" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-accent-light transition-colors duration-200 font-medium"
                >
                  @assec.ceara
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-5 border-l-2 border-l-accent pl-2.5 py-0.5">
              Institucional
            </h3>
            <ul className="space-y-3 text-xs">
              <li>
                <Link href="/sobre" className="hover:text-accent transition-all hover:translate-x-1 duration-200 inline-block focus-visible:outline-none focus-visible:underline">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/beneficios" className="hover:text-accent transition-all hover:translate-x-1 duration-200 inline-block focus-visible:outline-none focus-visible:underline">
                  Benefícios e Convênios
                </Link>
              </li>
              <li>
                <Link href="/noticias" className="hover:text-accent transition-all hover:translate-x-1 duration-200 inline-block focus-visible:outline-none focus-visible:underline">
                  Notícias e Avisos
                </Link>
              </li>
              <li>
                <Link href="/associe-se" className="text-accent hover:text-accent-light font-bold transition-all hover:translate-x-1 duration-200 inline-block focus-visible:outline-none focus-visible:underline">
                  Quero me Associar
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Accessibility and LGPD */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-5 border-l-2 border-l-accent pl-2.5 py-0.5">
              Legal e Acessibilidade
            </h3>
            <ul className="space-y-3.5 text-xs">
              <li>
                <span className="text-[11px] text-gray-400 block mb-1.5 leading-normal">Este site cumpre a Lei Geral de Proteção de Dados (LGPD).</span>
                <Link href="/politica-de-privacidade" className="text-accent hover:text-accent-light font-semibold transition-colors focus-visible:outline-none focus-visible:underline text-[11px]">
                  Política de Privacidade
                </Link>
              </li>
              <li className="pt-1.5">
                <Link href="/acessibilidade" className="hover:text-accent transition-all hover:translate-x-1 duration-200 flex items-center gap-1.5 focus-visible:outline-none focus-visible:underline">
                  <span className="inline-block px-1 border border-accent rounded text-[9px] text-accent font-mono uppercase font-bold">WCAG 2.2 AA</span>
                  <span className="text-[11px]">Declaração de Acessibilidade</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-light mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-gray-500">
          <p>© {currentYear} ASSEC. Todos os direitos reservados.</p>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
            <span className="hover:text-white transition-colors cursor-default">CNPJ: 66.901.120/0001-78</span>
            <span className="hidden sm:inline text-gray-700">|</span>
            <span>
              Desenvolvido por{" "}
              <a 
                href="mailto:danfealmeidafilho@gmail.com" 
                className="text-accent hover:text-accent-light font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded px-1"
              >
                Daniel de Almeida
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

