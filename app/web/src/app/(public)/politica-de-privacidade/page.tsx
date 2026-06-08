import { Card } from "@/components/ui/card";
import { ShieldCheck, Eye } from "lucide-react";

export const metadata = {
  title: "Política de Privacidade (LGPD)",
  description: "Entenda como a ASSEC protege, trata e resguarda seus dados pessoais de acordo com a Lei Geral de Proteção de Dados (LGPD).",
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              Tratamos seus dados cadastrais sob a base legal da **Execução de Contrato ou Procedimentos Preliminares (Art. 7º, V da LGPD)** e **Consentimento Explícito (Art. 7º, I da LGPD)**. Os dados destinam-se a:
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
              A ASSEC **não compartilha, vende ou aluga** seus dados cadastrais para terceiros. O compartilhamento ocorre estritamente com operadoras de saúde, clínicas conveniadas ou instituições parceiras autorizadas e sob solicitação expressa do associado para adesão a convênios de seu interesse.
            </p>
          </div>

          <div>
            <h2 className="font-serif font-bold text-lg text-primary mb-2 border-b border-border pb-2">
              4. Seus Direitos (Art. 18 da LGPD)
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              Como titular dos dados, você pode entrar em contato com nosso Encarregado de Proteção de Dados (DPO) pelo e-mail **contato@assecce.com.br** para exercer os seguintes direitos:
            </p>
            <ul className="list-disc list-inside text-sm text-text-secondary mt-2 space-y-1">
              <li>Confirmação da existência de tratamento dos dados.</li>
              <li>Acesso e correção de dados incompletos, inexatos ou desatualizados.</li>
              <li>Anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade.</li>
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
        </Card>

        <div className="text-center text-xs text-text-muted">
          Última atualização: Junho de 2026.
        </div>
      </div>
    </div>
  );
}
