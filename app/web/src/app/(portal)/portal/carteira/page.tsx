"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, Download, CreditCard, ShieldCheck, HelpCircle } from "lucide-react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { User } from "@/lib/types";

export default function CarteiraPage() {
  const [user, setUser] = React.useState<User | null>(null);
  const [validationUrl, setValidationUrl] = React.useState("");

  React.useEffect(() => {
    const loadUser = () => {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const parsedUser = JSON.parse(userStr);
          setUser(parsedUser);
          if (typeof window !== "undefined" && parsedUser?.id) {
            setValidationUrl(`${window.location.origin}/validar-carteira?id=${parsedUser.id}`);
          }
        } catch (e) {
          console.error("Failed to parse user profile in carteira:", e);
        }
      }
    };

    loadUser();

    window.addEventListener("user-profile-updated", loadUser);
    return () => {
      window.removeEventListener("user-profile-updated", loadUser);
    };
  }, []);

  if (!user) {
    return null;
  }

  const handlePrint = () => {
    window.print();
  };

  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  // Check if profile is complete (essential fields for generating card)
  const isProfileComplete = 
    user.cpf && user.cpf.trim() !== "" &&
    user.rg && user.rg.trim() !== "" &&
    user.org && user.org.trim() !== "" &&
    user.matricula && user.matricula.trim() !== "";

  // Generate a mock barcode styling
  const barcodeLines = [
    2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2, 4, 2, 1, 3, 2, 4, 1, 2, 3, 4, 1, 2, 2, 3, 1, 4, 2, 1, 3
  ];

  return (
    <div className="space-y-8 animate-none">
      <style jsx global>{`
        @media print {
          /* Remove margens e cabeçalhos de sistema na folha impressa */
          @page {
            margin: 0;
            size: A4 portrait;
          }
          body {
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          /* Esconder toda a interface do portal */
          body * {
            visibility: hidden;
          }
          /* Mostrar apenas o contêiner de impressão */
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 50% !important;
            top: 10% !important;
            transform: translateX(-50%) !important;
            width: 100% !important;
            max-width: 340px !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 25px !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          /* ISO 7810 ID-1 standard: 85.6mm × 54mm */
          #print-area .card-id {
            width: 85.6mm !important;
            height: 54mm !important;
            border-radius: 3mm !important;
          }
          /* Forçar cores de fundo nos navegadores */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 no-print">
        <div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-primary">
            Carteira Virtual
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Sua identificação oficial de associado ASSEC sempre com você.
          </p>
        </div>
        {isProfileComplete && (
          <div className="flex gap-2">
            <Button
              onClick={handlePrint}
              className="bg-accent text-primary hover:bg-accent-light font-bold text-xs uppercase tracking-widest px-4 py-2.5 shadow border-none"
            >
              <Printer className="h-4 w-4 mr-2" />
              Imprimir / Salvar PDF
            </Button>
          </div>
        )}
      </div>

      {!isProfileComplete ? (
        <Card className="p-6 sm:p-8 max-w-2xl mx-auto border-t-4 border-t-accent text-center space-y-6 shadow-md">
          <div className="mx-auto p-3 bg-accent/10 text-accent-dark rounded-full w-fit">
            <CreditCard className="h-12 w-12" />
          </div>
          <div className="space-y-2 text-center">
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-primary">
              Carteirinha Bloqueada - Cadastro Incompleto
            </h2>
            <p className="text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
              Para gerar a sua carteirinha virtual por completo, é obrigatório possuir todos os seguintes dados cadastrados no sistema: <strong>CPF, RG, Matrícula e Cargo/Organização</strong>.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 max-w-md mx-auto text-left space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
              Campos obrigatórios ausentes:
            </h3>
            <ul className="space-y-1.5 text-xs font-semibold">
              {(!user.cpf || user.cpf.trim() === "") && (
                <li className="text-red-600 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-600 shrink-0" />
                  <span>CPF Ausente</span>
                </li>
              )}
              {(!user.rg || user.rg.trim() === "") && (
                <li className="text-red-600 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-600 shrink-0" />
                  <span>RG Ausente</span>
                </li>
              )}
              {(!user.matricula || user.matricula.trim() === "") && (
                <li className="text-red-600 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-600 shrink-0" />
                  <span>Matrícula Ausente</span>
                </li>
              )}
              {(!user.org || user.org.trim() === "") && (
                <li className="text-red-600 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-600 shrink-0" />
                  <span>Cargo / Patente Ausente</span>
                </li>
              )}
            </ul>
          </div>

          <div className="text-xs text-text-muted leading-relaxed max-w-md mx-auto text-center border-t border-gray-100 pt-5">
            Como estes dados são bloqueados para autoedição por motivos de segurança institucional, por favor entre em contato com a secretaria da ASSEC para regularizar seu cadastro:
            <div className="mt-3 flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-6 font-bold text-primary">
              <a href="tel:85999411411" className="hover:text-accent-dark transition-colors">(85) 99941-1411</a>
              <span className="hidden sm:inline text-gray-300">|</span>
              <a href="mailto:contato@assecce.com.br" className="hover:text-accent-dark transition-colors">contato@assecce.com.br</a>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          {/* Printable Area containing Front and Back Cards */}
          <div id="print-area" className="col-span-1 xl:col-span-2 flex flex-col md:flex-row gap-6 justify-center">
            {/* FRONT OF THE CARD */}
            <div className="card-id w-[340px] h-[215px] rounded-xl bg-gradient-to-br from-primary via-secondary to-primary-light text-white p-4 flex flex-col justify-between shadow-2xl relative overflow-hidden border border-accent/40 shrink-0 animate-none">
              {/* Background design elements */}
              <div className="absolute right-[-20px] top-[-20px] w-36 h-36 bg-accent/5 rounded-full blur-xl pointer-events-none" />
              <div className="absolute left-[-20px] bottom-[-20px] w-36 h-36 bg-white/5 rounded-full blur-xl pointer-events-none" />

              {/* Background Watermark Logo */}
              <div className="absolute right-[-10px] bottom-[-10px] w-36 h-36 opacity-[0.06] pointer-events-none">
                <Image
                  src="/logo-transparent.webp"
                  alt="Watermark Logo"
                  width={144}
                  height={144}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-2 relative z-10">
                <div className="flex items-center gap-2">
                  {/* Official Logo */}
                  <Image
                    src="/logo-transparent.webp"
                    alt="ASSEC Logo"
                    width={32}
                    height={32}
                    className="h-8 w-8 object-contain shrink-0"
                  />
                  <div className="flex flex-col text-left">
                    <span className="font-serif font-bold text-xs leading-none text-white tracking-wide">
                      ASSEC
                    </span>
                    <span className="text-[5.5px] uppercase tracking-wider text-accent-light leading-none mt-1 block max-w-[130px]">
                      Associação dos Servidores da Segurança do Ceará
                    </span>
                  </div>
                </div>
                <span className="text-[7px] font-semibold uppercase tracking-widest text-accent border border-accent/30 rounded px-1.5 py-0.5 bg-accent/5">
                  CARTEIRA DIGITAL
                </span>
              </div>

              {/* Card Body */}
              <div className="flex gap-3 my-2 items-center relative z-10">
                {/* Photo Area */}
                <div className="w-20 h-24 rounded-lg border-2 border-accent bg-slate-900/50 flex items-center justify-center shrink-0 overflow-hidden relative shadow-inner">
                  {user.photoUrl ? (
                    <img
                      src={user.photoUrl}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-accent/60 w-full h-full p-2 relative">
                      <Image
                        src="/logo-transparent.webp"
                        alt="ASSEC Logo"
                        width={40}
                        height={40}
                        className="h-10 w-10 object-contain opacity-25 absolute"
                      />
                      <span className="font-bold text-lg leading-none relative z-10">{getInitials(user.name)}</span>
                      <span className="text-[6px] uppercase mt-1 relative z-10">Sem Foto</span>
                    </div>
                  )}
                </div>

                {/* Personal Info */}
                <div className="flex-1 min-w-0 text-left space-y-1.5">
                  <div>
                    <span className="text-[6px] text-gray-400 uppercase block leading-none">Nome do Associado</span>
                    <span className="text-xs font-bold text-white block truncate leading-tight uppercase font-sans mt-0.5">
                      {user.name}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[6px] text-gray-400 uppercase block leading-none">Cargo / Patente</span>
                      <span className="text-[9px] text-gray-200 block truncate font-medium mt-0.5">
                        {user.org}
                      </span>
                    </div>
                    <div>
                      <span className="text-[6px] text-gray-400 uppercase block leading-none">Matrícula</span>
                      <span className="text-[10px] font-mono font-bold text-accent block leading-none mt-0.5">
                        {user.matricula}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex justify-between items-end border-t border-white/10 pt-1.5 text-[7px] text-gray-400 relative z-10">
                <span>Emissão: {new Date(user.since || user.createdAt).toLocaleDateString("pt-BR")}</span>
                <span className="flex items-center gap-1 text-emerald-400 font-bold uppercase tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  ASSOCIADO ATIVO
                </span>
              </div>
            </div>

            {/* BACK OF THE CARD */}
            <div className="card-id w-[340px] h-[215px] rounded-xl bg-gradient-to-br from-primary via-secondary to-primary-light text-white p-4 flex flex-col justify-between shadow-2xl relative overflow-hidden border border-accent/40 shrink-0">
              {/* Background design elements */}
              <div className="absolute right-[-20px] bottom-[-20px] w-36 h-36 bg-accent/5 rounded-full blur-xl pointer-events-none" />
              <div className="absolute left-[-20px] top-[-20px] w-36 h-36 bg-white/5 rounded-full blur-xl pointer-events-none" />

              {/* Background Watermark Logo */}
              <div className="absolute left-[-10px] top-[-10px] w-36 h-36 opacity-[0.06] pointer-events-none">
                <Image
                  src="/logo-transparent.webp"
                  alt="Watermark Logo"
                  width={144}
                  height={144}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="text-left relative z-10">
                <div className="flex justify-between items-center border-b border-white/10 pb-1">
                  <span className="text-[8px] font-bold text-accent-light uppercase tracking-wider block">
                    Disposições Gerais
                  </span>
                  <Image
                    src="/logo-transparent.webp"
                    alt="ASSEC Logo"
                    width={20}
                    height={20}
                    className="h-5 w-5 object-contain opacity-80"
                  />
                </div>
                <p className="text-[5.5px] text-gray-300 mt-1.5 leading-normal">
                  Esta carteira é de uso pessoal e intransferível, identificando o titular como associado da ASSEC. Apresente-a para usufruir de convênios, pousadas, assessoria jurídica e demais benefícios. Em caso de perda, solicite a segunda via à secretaria.
                </p>
              </div>

              {/* Back Details Grid */}
              <div className="grid grid-cols-3 gap-2 my-1.5 text-left bg-slate-900/60 p-2 rounded-lg border border-white/10 relative z-10 shadow-inner">
                <div>
                  <span className="text-[5.5px] text-gray-400 uppercase font-bold tracking-wider block">Identidade (RG)</span>
                  <span className="text-[9px] font-bold font-mono text-white tracking-wide">{user.rg}</span>
                </div>
                <div>
                  <span className="text-[5.5px] text-gray-400 uppercase font-bold tracking-wider block">CPF</span>
                  <span className="text-[9px] font-bold font-mono text-white tracking-wide">{user.cpf}</span>
                </div>
                <div>
                  <span className="text-[5.5px] text-gray-400 uppercase font-bold tracking-wider block">Situação</span>
                  <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1">
                    <span className="h-1 w-1 rounded-full bg-emerald-400 inline-block animate-pulse" />
                    ATIVO
                  </span>
                </div>
              </div>

              {/* Barcode and QR Code Row */}
              <div className="grid grid-cols-5 gap-2 relative z-10">
                {/* Barcode Column (3/5) */}
                <div className="col-span-3 flex flex-col items-center justify-between bg-white p-1.5 rounded-lg border border-gray-200 h-[50px] shadow-sm">
                  <div className="flex items-stretch h-5 gap-[1.5px] w-full max-w-[170px] justify-center pt-0.5">
                    {barcodeLines.slice(0, 27).map((width, idx) => (
                      <div
                        key={idx}
                        className="bg-black shrink-0"
                        style={{ width: `${width}px` }}
                      />
                    ))}
                  </div>
                  <span className="text-[6px] font-mono text-black font-bold uppercase tracking-wider leading-none mt-1">
                    {user.id ? user.id.substring(0, 18).toUpperCase() : "ASSEC-MEMBER"}
                  </span>
                </div>
                
                {/* QR Code Column (2/5) */}
                <div className="col-span-2 flex items-center justify-between gap-1 bg-white p-1.5 rounded-lg border border-gray-200 h-[50px] shadow-sm">
                  <div className="flex items-center justify-center flex-1">
                    {validationUrl ? (
                      <QRCodeSVG
                        value={validationUrl}
                        size={36}
                        bgColor="#ffffff"
                        fgColor="#000000"
                        level="M"
                      />
                    ) : (
                      <div className="h-9 w-9 bg-gray-100 animate-pulse rounded" />
                    )}
                  </div>
                  <div className="flex flex-col text-[4.5px] text-black text-left leading-normal font-sans font-bold shrink-0 pr-1 select-none">
                    <span>ESCANEIE</span>
                    <span>PARA</span>
                    <span className="text-primary font-black text-[5px]">VALIDAR</span>
                  </div>
                </div>
              </div>

              {/* Card back footer */}
              <div className="text-center text-[6px] text-gray-400 pt-1 border-t border-white/10 flex justify-between relative z-10 mt-1">
                <span>ASSEC - Todos os direitos reservados.</span>
                <span className="font-semibold text-white">CNPJ: 66.901.120/0001-78</span>
              </div>
            </div>
          </div>

          {/* Card info & download guides */}
          <div className="no-print col-span-1 space-y-6">
            <Card className="p-6">
              <h2 className="font-serif font-bold text-lg text-primary mb-4 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-accent-dark" />
                <span>Instruções de Uso</span>
              </h2>
              <div className="space-y-4 text-sm text-text-secondary text-left leading-relaxed">
                <p>
                  Sua carteira digital contém dados cruciais para validar sua afiliação ativamente perante os parceiros da ASSEC.
                </p>
                <div className="flex items-start gap-2.5">
                  <div className="h-5 w-5 bg-accent/10 rounded-full flex items-center justify-center text-accent-dark shrink-0 font-bold text-xs mt-0.5">1</div>
                  <p className="text-xs">Apresente-a diretamente no smartphone para obter descontos em pousadas credenciadas.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="h-5 w-5 bg-accent/10 rounded-full flex items-center justify-center text-accent-dark shrink-0 font-bold text-xs mt-0.5">2</div>
                  <p className="text-xs">Para salvar como arquivo (PDF) ou imprimir fisicamente, clique no botão superior e selecione &quot;Salvar como PDF&quot; nas opções de destino da impressora.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="h-5 w-5 bg-accent/10 rounded-full flex items-center justify-center text-accent-dark shrink-0 font-bold text-xs mt-0.5">3</div>
                  <p className="text-xs">Certifique-se de que sua foto de perfil está cadastrada para que ela conste no documento oficial impresso.</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-primary-light/5 border border-primary-light/10 text-left">
              <h3 className="font-serif font-bold text-base text-primary mb-2 flex items-center gap-1.5">
                <HelpCircle className="h-4.5 w-4.5 text-accent" />
                <span>Precisando de ajuda?</span>
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Caso seus dados cadastrais (CPF, RG, Matrícula) estejam incorretos ou desatualizados, por favor atualize em seu perfil ou solicite assistência diretamente na secretaria da associação.
              </p>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
