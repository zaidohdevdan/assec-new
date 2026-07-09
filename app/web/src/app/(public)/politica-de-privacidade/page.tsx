import { Card } from "@/components/ui/card";
import { ShieldCheck, Eye, Cookie, UserCheck, Clock, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Política de Privacidade (LGPD)",
  description: "Entenda como a ASSEC protege, trata e resguarda seus dados pessoais de acordo com a Lei Geral de Proteção de Dados (LGPD).",
  alternates: {
    canonical: "https://assecce.com.br/politica-de-privacidade",
  },
};

export default function PoliticaPrivacidadePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-none">
      <div className="text-center mb-12">
        <span className="text-accent-dark uppercase tracking-widest text-xs font-bold font-sans">Segurança e Lei</span>
        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-primary mt-2">
          Política de Privacidade e Proteção de Dados
        </h1>
        <p className="text-text-secondary max-w-2xl mx-auto mt-4 text-sm leading-relaxed">
          A Associação dos Servidores da Segurança do Ceará (ASSEC) está comprometida em resguardar sua privacidade e proteger seus dados pessoais nos termos da Lei nº 13.709/2018 (Lei Geral de Proteção de Dados Pessoais - LGPD).
        </p>
      </div>

      <div className="space-y-8 text-left">
        {/* Quick Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="flex gap-4 p-5">
            <ShieldCheck className="h-6 w-6 text-accent-dark shrink-0" />
            <div>
              <h3 className="font-serif font-bold text-sm text-primary mb-1">Finalidade Estrita</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Coletamos dados cadastrais exclusivamente para avaliar propostas de filiação e prestar serviços associativos diretos.
              </p>
            </div>
          </Card>

          <Card className="flex gap-4 p-5">
            <Eye className="h-6 w-6 text-accent-dark shrink-0" />
            <div>
              <h3 className="font-serif font-bold text-sm text-primary mb-1">Transparência Total</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Você tem o direito de consultar, corrigir, atualizar ou solicitar a exclusão dos seus dados a qualquer momento.
              </p>
            </div>
          </Card>

          <Card className="flex gap-4 p-5">
            <Cookie className="h-6 w-6 text-accent-dark shrink-0" />
            <div>
              <h3 className="font-serif font-bold text-sm text-primary mb-1">Controle de Cookies</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Você pode personalizar ou revogar o consentimento de cookies a qualquer momento pelo banner de privacidade.
              </p>
            </div>
          </Card>
        </div>

        {/* Section Detail Card */}
        <Card className="p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="font-serif font-bold text-lg text-primary mb-2 border-b border-border pb-2">
              1. Quais dados coletamos?
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              Durante o preenchimento da ficha de filiação online ou física, coletamos:
            </p>
            <ul className="list-disc list-inside text-sm text-text-secondary mt-2 space-y-1">
              <li>Nome completo</li>
              <li>Endereço de e-mail</li>
              <li>Número de CPF</li>
              <li>Telefone de contato</li>
              <li>Cargo, patente ou função na segurança pública</li>
              <li>Endereço residencial (para cadastros manuais)</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif font-bold text-lg text-primary mb-2 border-b border-border pb-2">
              2. Qual a base legal e finalidade do tratamento?
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              Tratamos seus dados cadastrais sob a base legal da <strong>Execução de Contrato ou Procedimentos Preliminares (Art. 7º, V da LGPD)</strong> e <strong>Consentimento Explícito (Art. 7º, I da LGPD)</strong>. Os dados destinam-se a:
            </p>
            <ul className="list-disc list-inside text-sm text-text-secondary mt-2 space-y-1">
              <li>Processar e auditar pedidos de filiação à associação.</li>
              <li>Entrar em contato para formalizar o cadastro de associado.</li>
              <li>Viabilizar descontos em planos de saúde, lazer e outros convênios institucionais.</li>
              <li>Prestar assessoria jurídica em casos disciplinares ou sindicâncias associadas.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif font-bold text-lg text-primary mb-2 border-b border-border pb-2">
              3. Compartilhamento de dados
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              A ASSEC <strong>não compartilha, vende ou aluga</strong> seus dados cadastrais para terceiros. O compartilhamento ocorre estritamente com operadoras de saúde, clínicas conveniadas ou instituições parceiras autorizadas e sob solicitação expressa do associado para adesão a convênios de seu interesse.
            </p>
          </div>

          <div>
            <h2 className="font-serif font-bold text-lg text-primary mb-2 border-b border-border pb-2">
              4. Seus Direitos (Art. 18 da LGPD)
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              Como titular dos dados, você pode entrar em contato com nosso Encarregado de Proteção de Dados (DPO) pelo e-mail <strong>contato@assecce.com.br</strong> para exercer os seguintes direitos:
            </p>
            <ul className="list-disc list-inside text-sm text-text-secondary mt-2 space-y-1">
              <li>Confirmação da existência de tratamento dos dados.</li>
              <li>Acesso e correção de dados incompletos, inexatos ou desatualizados.</li>
              <li>Anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade.</li>
              <li>Portabilidade dos dados a outro fornecedor de serviço.</li>
              <li>Revogação do consentimento concedido.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif font-bold text-lg text-primary mb-2 border-b border-border pb-2">
              5. Segurança da Informação
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              Adotamos medidas técnicas, administrativas e de controle de acesso (criptografia HTTPS, controle rígido de logins no Painel Administrativo) para assegurar que apenas colaboradores autorizados tenham acesso aos dados informados na plataforma.
            </p>
          </div>

          {/* NEW: Cookies Section */}
          <div>
            <h2 className="font-serif font-bold text-lg text-primary mb-2 border-b border-border pb-2 flex items-center gap-2">
              <Cookie className="h-5 w-5 text-accent-dark" />
              6. Política de Cookies
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed mb-3">
              Utilizamos cookies para garantir o funcionamento adequado do site e, opcionalmente, para análise de uso e marketing. Os cookies estão classificados nas seguintes categorias:
            </p>
            <div className="space-y-3">
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                <h4 className="text-xs font-bold text-primary mb-1">🔒 Cookies Essenciais</h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Necessários para o funcionamento básico do site, como sessão de autenticação e preferências de idioma. Não podem ser desativados.
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                <h4 className="text-xs font-bold text-primary mb-1">📊 Cookies de Análise</h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Utilizados para entender como os visitantes interagem com o site, permitindo melhorias contínuas na experiência do usuário. Só são carregados com seu consentimento explícito.
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                <h4 className="text-xs font-bold text-primary mb-1">📢 Cookies de Marketing</h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Permitem a exibição de conteúdo relevante e integração com redes sociais. Só são carregados com seu consentimento explícito.
                </p>
              </div>
            </div>
            <p className="text-xs text-text-secondary mt-3 leading-relaxed">
              Você pode gerenciar suas preferências de cookies a qualquer momento clicando no link &quot;Gerenciar Consentimento de Cookies&quot; no rodapé do site.
            </p>
          </div>

          {/* NEW: DPO Section */}
          <div>
            <h2 className="font-serif font-bold text-lg text-primary mb-2 border-b border-border pb-2 flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-accent-dark" />
              7. Encarregado de Proteção de Dados (DPO)
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed mb-2">
              Em conformidade com o Art. 41 da LGPD, a ASSEC designou o seguinte Encarregado de Proteção de Dados:
            </p>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-1.5 text-sm text-text-secondary">
              <p><strong>E-mail:</strong> contato@assecce.com.br</p>
              <p><strong>Telefone:</strong> (85) 99941-1411</p>
              <p><strong>Endereço:</strong> Av. Santos Dumont, 1510, Sala 805, Aldeota, Fortaleza - CE, CEP 60.150-161</p>
            </div>
            <p className="text-xs text-text-secondary mt-2 leading-relaxed">
              O DPO é responsável por aceitar reclamações e comunicações dos titulares, prestar esclarecimentos e adotar providências.
            </p>
          </div>

          {/* NEW: Data Retention Section */}
          <div>
            <h2 className="font-serif font-bold text-lg text-primary mb-2 border-b border-border pb-2 flex items-center gap-2">
              <Clock className="h-5 w-5 text-accent-dark" />
              8. Retenção e Eliminação de Dados
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed mb-3">
              Os dados pessoais são retidos pelo tempo necessário para cumprir as finalidades descritas nesta política, conforme os prazos abaixo (Art. 16 da LGPD):
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left p-3 border border-border text-primary font-bold text-xs">Tipo de Dado</th>
                    <th className="text-left p-3 border border-border text-primary font-bold text-xs">Prazo de Retenção</th>
                    <th className="text-left p-3 border border-border text-primary font-bold text-xs">Base Legal</th>
                  </tr>
                </thead>
                <tbody className="text-text-secondary text-xs">
                  <tr>
                    <td className="p-3 border border-border">Dados cadastrais de associados</td>
                    <td className="p-3 border border-border">Enquanto perdurar a filiação + 5 anos após desligamento</td>
                    <td className="p-3 border border-border">Execução de contrato (Art. 7º, V)</td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="p-3 border border-border">Mensagens de contato</td>
                    <td className="p-3 border border-border">2 anos após o envio</td>
                    <td className="p-3 border border-border">Legítimo interesse (Art. 7º, IX)</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-border">Registros de consentimento</td>
                    <td className="p-3 border border-border">Enquanto o consentimento estiver vigente + 5 anos</td>
                    <td className="p-3 border border-border">Obrigação legal (Art. 7º, II)</td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="p-3 border border-border">Cookies e preferências</td>
                    <td className="p-3 border border-border">Até revogação pelo titular ou 1 ano</td>
                    <td className="p-3 border border-border">Consentimento (Art. 7º, I)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-text-secondary mt-2 leading-relaxed">
              Após o término do prazo de retenção, os dados são eliminados de forma segura ou anonimizados.
            </p>
          </div>

          {/* NEW: ANPD Complaint Section */}
          <div>
            <h2 className="font-serif font-bold text-lg text-primary mb-2 border-b border-border pb-2 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-accent-dark" />
              9. Reclamação à Autoridade Nacional (ANPD)
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              Se você entender que o tratamento dos seus dados pessoais pela ASSEC viola a LGPD, você tem o direito de peticionar à Autoridade Nacional de Proteção de Dados (ANPD), conforme previsto no Art. 18, §1º da Lei 13.709/2018.
            </p>
            <p className="text-sm text-text-secondary leading-relaxed mt-2">
              A ANPD pode ser contatada através do portal:{" "}
              <a
                href="https://www.gov.br/anpd"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-dark underline font-semibold hover:text-accent"
              >
                www.gov.br/anpd
              </a>
            </p>
          </div>
        </Card>

        <div className="text-center text-xs text-text-muted">
          Última atualização: Julho de 2026 · Versão da política: v2026.06.001
        </div>
      </div>
    </div>
  );
}
