import * as React from "react";
import { Card } from "@/components/ui/card";
import { Download, FileText, Calendar, HardDrive } from "lucide-react";

export const metadata = {
  title: "Transparência",
  description: "Acesse atas, estatutos, prestações de contas e relatórios da ASSEC.",
};

const documents = [
  {
    title: "Estatuto Social ASSEC - Atualizado",
    type: "PDF",
    size: "1.2 MB",
    date: "10/01/2026",
    category: "Regulamento",
    url: "/estatuto-assec.pdf",
  },
  {
    title: "Demonstrativo Financeiro - 4º Trimestre 2025",
    type: "PDF",
    size: "840 KB",
    date: "15/01/2026",
    category: "Prestação de Contas",
    url: "/demonstrativo-assec.pdf",
  },
  {
    title: "Relatório de Atividades - Gestão Anual 2025",
    type: "PDF",
    size: "3.1 MB",
    date: "05/01/2026",
    category: "Relatório",
    url: "/relatorio-assec.pdf",
  },
  {
    title: "Balanço Patrimonial Consolidado 2024",
    type: "PDF",
    size: "1.5 MB",
    date: "20/03/2025",
    category: "Prestação de Contas",
    url: "/balanco-assec.pdf",
  },
];

export default function TransparenciaPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-none">
      <div className="text-center mb-12">
        <span className="text-accent-dark uppercase tracking-widest text-xs font-bold font-sans">Prestação de Contas</span>
        <h1 className="font-serif font-bold text-4xl text-primary mt-2">
          Portal da Transparência
        </h1>
        <p className="text-text-secondary max-w-2xl mx-auto mt-4 text-sm sm:text-base">
          Garantindo total clareza na aplicação dos recursos e na gestão administrativa. Baixe os arquivos públicos oficiais abaixo.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {documents.map((doc, idx) => (
          <Card key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 hover:border-l-4 hover:border-l-accent">
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-gray-100 rounded text-text-secondary shrink-0">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-wider text-accent-dark font-sans">
                  {doc.category}
                </span>
                <h3 className="font-serif font-bold text-base sm:text-lg text-primary mt-0.5">
                  {doc.title}
                </h3>
                <div className="flex flex-wrap gap-4 text-xs text-text-muted mt-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{doc.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <HardDrive className="h-3.5 w-3.5" />
                    <span>{doc.size}</span>
                  </div>
                  <span className="border border-border px-1.5 py-0.2 rounded font-mono text-[10px] uppercase font-bold text-text-secondary">
                    {doc.type}
                  </span>
                </div>
              </div>
            </div>
            
            <a
              href={doc.url}
              download
              className="flex items-center gap-2 px-4 py-2 border border-border rounded text-sm text-text-primary hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus font-semibold w-full sm:w-auto justify-center"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
}
