"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, Download, CreditCard, ShieldCheck, HelpCircle } from "lucide-react";
import Image from "next/image";

export default function CarteiraPage() {
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
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

  // Generate a mock barcode styling
  const barcodeLines = [
    2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2, 4, 2, 1, 3, 2, 4, 1, 2, 3, 4, 1, 2, 2, 3, 1, 4, 2, 1, 3
  ];

  return (
    <div className="space-y-8 animate-none">
      {/* CSS style injected specifically for page print formatting */}
      <style jsx global>{`
        @media print {
          /* Hide sidebar, headers, footers, and other buttons */
          body * {
            visibility: hidden;
            background: none !important;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 20px;
            padding: 20px;
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
        <div className="flex gap-2">
          <Button
            onClick={handlePrint}
            className="bg-accent text-primary hover:bg-accent-light font-bold text-xs uppercase tracking-widest px-4 py-2.5 shadow border-none"
          >
            <Printer className="h-4 w-4 mr-2" />
            Imprimir / Salvar PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* Printable Area containing Front and Back Cards */}
        <div id="print-area" className="col-span-1 xl:col-span-2 flex flex-col md:flex-row gap-6 justify-center">
          {/* FRONT OF THE CARD */}
          <div className="w-[340px] h-[215px] rounded-xl bg-gradient-to-br from-primary via-secondary to-primary-light text-white p-4 flex flex-col justify-between shadow-2xl relative overflow-hidden border border-accent/40 shrink-0">
            {/* Background design elements */}
            <div className="absolute right-[-20px] top-[-20px] w-36 h-36 bg-accent/5 rounded-full blur-xl pointer-events-none" />
            <div className="absolute left-[-20px] bottom-[-20px] w-36 h-36 bg-white/5 rounded-full blur-xl pointer-events-none" />

            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                {/* Logo representation */}
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center font-bold text-primary text-[10px]">
                  AS
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-serif font-bold text-xs leading-none text-white tracking-wide">
                    ASSEC
                  </span>
                  <span className="text-[6px] uppercase tracking-widest text-accent-light leading-none mt-0.5">
                    Segurança do Ceará
                  </span>
                </div>
              </div>
              <span className="text-[7px] font-semibold uppercase tracking-widest text-accent border border-accent/30 rounded px-1.5 py-0.5 bg-accent/5">
                CARTEIRA DIGITAL
              </span>
            </div>

            {/* Card Body */}
            <div className="flex gap-3 my-2 items-center">
              {/* Photo Area */}
              <div className="w-20 h-24 rounded-lg border-2 border-accent bg-slate-900/50 flex items-center justify-center shrink-0 overflow-hidden relative shadow-inner">
                {user.photoUrl ? (
                  <img
                    src={user.photoUrl}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-accent/60">
                    <span className="font-bold text-lg leading-none">{getInitials(user.name)}</span>
                    <span className="text-[6px] uppercase mt-1">Sem Foto</span>
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
                    <span className="text-[6px] text-gray-400 uppercase block leading-none">Matrícula</span>
                    <span className="text-[10px] font-mono font-bold text-accent block leading-none mt-0.5">
                      {user.matricula || "---"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[6px] text-gray-400 uppercase block leading-none">CPF</span>
                    <span className="text-[10px] font-mono font-bold text-white block leading-none mt-0.5">
                      {user.cpf || "---"}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-[6px] text-gray-400 uppercase block leading-none">Cargo / Patente</span>
                  <span className="text-[9px] text-gray-200 block truncate font-medium mt-0.5">
                    {user.org || "Não cadastrado"}
                  </span>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="flex justify-between items-end border-t border-white/10 pt-1.5 text-[7px] text-gray-400">
              <span>Emissão: {new Date(user.since || user.createdAt).toLocaleDateString("pt-BR")}</span>
              <span className="flex items-center gap-1 text-emerald-400 font-bold uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                ASSOCIADO ATIVO
              </span>
            </div>
          </div>

          {/* BACK OF THE CARD */}
          <div className="w-[340px] h-[215px] rounded-xl bg-gradient-to-br from-primary via-secondary to-primary-light text-white p-4 flex flex-col justify-between shadow-2xl relative overflow-hidden border border-accent/40 shrink-0">
            {/* Background design elements */}
            <div className="absolute right-[-20px] bottom-[-20px] w-36 h-36 bg-accent/5 rounded-full blur-xl pointer-events-none" />
            <div className="absolute left-[-20px] top-[-20px] w-36 h-36 bg-white/5 rounded-full blur-xl pointer-events-none" />

            <div className="text-left">
              <span className="text-[8px] font-bold text-accent-light uppercase tracking-wider block border-b border-white/10 pb-1">
                Disposições Gerais
              </span>
              <p className="text-[6px] text-gray-300 mt-2 leading-relaxed">
                Esta carteira é de uso pessoal e intransferível, identificando o titular como associado da ASSEC. Apresente-a para usufruir de convênios, pousadas, assessoria jurídica e demais benefícios. Em caso de perda, solicite a segunda via à secretaria.
              </p>
            </div>

            {/* Back Details Grid */}
            <div className="grid grid-cols-2 gap-2 my-2 text-left bg-primary-light/40 p-2 rounded border border-white/5">
              <div>
                <span className="text-[5px] text-gray-400 uppercase block">RG</span>
                <span className="text-[9px] font-bold font-mono text-white">{user.rg || "---"}</span>
              </div>
              <div>
                <span className="text-[5px] text-gray-400 uppercase block">Situação Cadastral</span>
                <span className="text-[9px] font-bold text-emerald-400 uppercase">ATIVO</span>
              </div>
            </div>

            {/* Barcode representation */}
            <div className="flex flex-col items-center gap-1 bg-white p-2.5 rounded-lg border border-gray-200">
              <div className="flex items-stretch h-6 gap-[1.5px] w-full max-w-[260px]">
                {barcodeLines.map((width, idx) => (
                  <div
                    key={idx}
                    className="bg-black shrink-0"
                    style={{ width: `${width}px` }}
                  />
                ))}
              </div>
              <span className="text-[8px] font-mono text-black font-semibold uppercase leading-none">
                {user.id ? user.id.substring(0, 18).toUpperCase() : "ASSEC-MEMBER-CARD"}
              </span>
            </div>

            {/* Card back footer */}
            <div className="text-center text-[6.5px] text-gray-400 pt-1 border-t border-white/10 flex justify-between">
              <span>ASSEC - Todos os direitos reservados.</span>
              <span className="font-semibold text-white">CNPJ: 07.653.212/0001-08</span>
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
    </div>
  );
}
