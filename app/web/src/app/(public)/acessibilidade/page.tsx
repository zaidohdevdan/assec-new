import * as React from "react";
import { Card } from "@/components/ui/card";
import { Accessibility, Eye, Keyboard } from "lucide-react";

export const metadata = {
  title: "Declaração de Acessibilidade",
  description: "Conheça nossos compromissos, recursos de acessibilidade e conformidade WCAG 2.2 AA.",
};

export default function AcessibilidadePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-none">
      <div className="text-center mb-12">
        <span className="text-accent-dark uppercase tracking-widest text-xs font-bold font-sans">Acessibilidade</span>
        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-primary mt-2">
          Declaração de Acessibilidade
        </h1>
        <p className="text-text-secondary max-w-2xl mx-auto mt-4 text-sm leading-relaxed">
          A Associação dos Servidores da Segurança do Ceará (ASSEC) está comprometida em garantir a acessibilidade digital para pessoas com deficiência. Estamos continuamente melhorando a experiência do usuário para todos e aplicando os padrões de acessibilidade relevantes.
        </p>
      </div>

      <div className="space-y-8 text-left">
        {/* Key Features Icons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-5 flex flex-col items-start">
            <div className="p-2.5 bg-primary text-accent rounded-lg mb-3">
              <Keyboard className="h-6 w-6" />
            </div>
            <h3 className="font-serif font-bold text-sm text-primary mb-1">Navegação por Teclado</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Atalhos de salto rápido (&quot;Ir para o conteúdo&quot;) e indicadores visuais de foco bem definidos para navegação sem mouse.
            </p>
          </Card>

          <Card className="p-5 flex flex-col items-start">
            <div className="p-2.5 bg-primary text-accent rounded-lg mb-3">
              <Eye className="h-6 w-6" />
            </div>
            <h3 className="font-serif font-bold text-sm text-primary mb-1">Alto Contraste</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Cores, fontes e fundos ajustados para atender aos níveis de contraste mínimos exigidos para leitura confortável.
            </p>
          </Card>

          <Card className="p-5 flex flex-col items-start">
            <div className="p-2.5 bg-primary text-accent rounded-lg mb-3">
              <Accessibility className="h-6 w-6" />
            </div>
            <h3 className="font-serif font-bold text-sm text-primary mb-1">Leitores de Tela</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Marcação HTML5 semântica e atributos ARIA corretos para garantir compatibilidade com tecnologias assistivas.
            </p>
          </Card>
        </div>

        {/* Informational Card */}
        <Card className="p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="font-serif font-bold text-lg text-primary mb-2 border-b border-border pb-2">
              Estado de Conformidade
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              As Diretrizes de Acessibilidade para Conteúdo Web (WCAG) definem requisitos para designers e desenvolvedores melhorarem a acessibilidade para pessoas com deficiência. O site da ASSEC foi projetado para estar em conformidade com o nível **AA** das Diretrizes WCAG 2.2.
            </p>
          </div>

          <div>
            <h2 className="font-serif font-bold text-lg text-primary mb-2 border-b border-border pb-2">
              Recursos Técnicos Implementados
            </h2>
            <ul className="list-disc list-inside text-sm text-text-secondary space-y-1.5">
              <li>
                <strong>Link de Salto (Skip Link):</strong> Um link invisível &quot;Ir para o conteúdo&quot; está posicionado no início da página e torna-se visível ao usar a tecla Tab, permitindo pular o menu de navegação diretamente para o conteúdo principal.
              </li>
              <li>
                <strong>Foco Visível:</strong> Todos os elementos interativos (links, botões, campos de formulário) possuem estilos de foco visíveis (`focus-visible:ring-2 focus-visible:ring-accent`) com alta taxa de contraste para auxiliar usuários de teclado.
              </li>
              <li>
                <strong>Estrutura Hierárquica:</strong> Uso estrito de apenas uma tag `h1` principal por página e sequência coerente de títulos (`h2`, `h3`) para facilitar a escaneabilidade por leitores de tela.
              </li>
              <li>
                <strong>Legendas de Imagens:</strong> Alt text descritivo em todas as imagens estáticas e dinâmicas (como fotos das pousadas e notícias).
              </li>
              <li>
                <strong>Acessibilidade de Formulários:</strong> Inputs com etiquetas descritivas associadas por ID e indicação clara de erros de validação via aria-live ou atributos nativos de formulários.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif font-bold text-lg text-primary mb-2 border-b border-border pb-2">
              Feedback e Contato
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              Agradecemos seu feedback sobre a acessibilidade do portal da ASSEC. Se você encontrar barreiras de acessibilidade ou tiver sugestões de melhoria, entre em contato conosco:
            </p>
            <ul className="list-disc list-inside text-sm text-text-secondary mt-2 space-y-1">
              <li>
                <strong>E-mail:</strong> <a href="mailto:contato@assecce.com.br" className="text-accent-dark hover:underline font-semibold">contato@assecce.com.br</a>
              </li>
              <li>
                <strong>Telefone:</strong> <a href="tel:85999411411" className="text-accent-dark hover:underline font-semibold">(85) 99941-1411</a>
              </li>
            </ul>
            <p className="text-sm text-text-secondary leading-relaxed mt-3">
              Tentamos responder ao feedback dentro de até 3 dias úteis.
            </p>
          </div>
        </Card>

        <div className="text-center text-xs text-text-muted">
          Última atualização: Junho de 2026.
        </div>
      </div>
    </div>
  );
}
