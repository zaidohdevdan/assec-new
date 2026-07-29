"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiFetch } from "@/lib/api";

// ─── Zod Schema ──────────────────────────────────────────────────────────────

const schema = z.object({
  nome: z.string().min(3, "Nome deve ter ao menos 3 caracteres"),
  cpf: z
    .string()
    .min(11, "CPF inválido")
    .max(14, "CPF inválido")
    .regex(/^[\d.\-]+$/, "CPF inválido — use apenas números"),
  email: z
    .string()
    .email("E-mail inválido")
    .optional()
    .or(z.literal("")),
  telefone: z
    .string()
    .min(10, "Telefone inválido — inclua o DDD")
    .max(15, "Telefone inválido"),
  orgao: z.string().optional(),
  matricula: z.string().optional(),
  consent: z.literal(true, {
    errorMap: () => ({
      message:
        "Você precisa aceitar a Política de Privacidade (LGPD) para continuar",
    }),
  }),
});

type FormData = z.infer<typeof schema>;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatCPF(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function FieldInput({
  label,
  id,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  id: string;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-blue-200/80 uppercase tracking-wider">
        {label}
      </label>
      <input
        id={id}
        {...props}
        className={`w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 text-sm
          focus:outline-none focus:ring-2 focus:ring-yellow-500/60 focus:border-yellow-500/60 transition-all
          ${error ? "border-red-500/70" : "border-gray-300"}`}
      />
      {error && (
        <span className="text-xs text-red-400 font-medium">{error}</span>
      )}
    </div>
  );
}

// ─── States ──────────────────────────────────────────────────────────────────

function SuccessState({ nome }: { nome: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-5 py-6 px-2">
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center text-base">
          🎉
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold text-white mb-2">
          Pré-cadastro enviado, {nome.split(" ")[0]}!
        </h2>
        <p className="text-blue-200/80 text-sm leading-relaxed max-w-xs mx-auto">
          Nosso departamento comercial vai entrar em contato em breve pelo{" "}
          <strong className="text-white">WhatsApp, telefone ou presencialmente</strong> para
          concluir a sua filiação.
        </p>
      </div>
      <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-left space-y-2 mt-2">
        <p className="text-xs text-blue-200/70 font-semibold uppercase tracking-wider">O que acontece agora?</p>
        {["Análise do seu cadastro", "Contato da equipe ASSEC", "Filiação concluída ✓"].map((step, i) => (
          <div key={step} className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center text-yellow-400 text-xs font-bold shrink-0">
              {i + 1}
            </div>
            <span className="text-sm text-white/80">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExpiredState() {
  return (
    <div className="flex flex-col items-center text-center gap-4 py-6">
      <div className="w-16 h-16 rounded-full bg-orange-500/20 border border-orange-400/30 flex items-center justify-center text-3xl">
        ⏰
      </div>
      <div>
        <h2 className="text-lg font-bold text-white mb-2">Campanha encerrada</h2>
        <p className="text-blue-200/70 text-sm leading-relaxed max-w-xs mx-auto">
          O prazo desta campanha foi encerrado. Para se filiar à ASSEC, acesse nossa página oficial.
        </p>
      </div>
      <a
        href="/associe-se"
        className="mt-2 px-6 py-3 bg-yellow-400 text-[#0a1628] font-bold rounded-xl text-sm hover:bg-yellow-300 transition-colors"
      >
        Ficha de Filiação Oficial →
      </a>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

interface CampaignInfo {
  id: string;
  name: string;
  description?: string;
  expiresAt: string;
  available: boolean;
  expired: boolean;
  active: boolean;
}

export default function CampaignPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);

  const [campaign, setCampaign] = React.useState<CampaignInfo | null>(null);
  const [loadError, setLoadError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const [submitState, setSubmitState] = React.useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [submittedName, setSubmittedName] = React.useState("");


  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  React.useEffect(() => {
    apiFetch(`/campaign/info/${slug}`)
      .then(async (res) => {
        if (!res.ok) throw new Error();
        const data: CampaignInfo = await res.json();
        setCampaign(data);
      })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  // ── Submit ──
  const onSubmit = async (data: FormData) => {
    setSubmitState("loading");
    setSubmitError(null);
    try {
      const res = await apiFetch(`/campaign/${slug}/register`, {
        method: "POST",
        body: JSON.stringify({
          nome: data.nome,
          cpf: data.cpf,
          email: data.email || undefined,
          telefone: data.telefone,
          orgao: data.orgao || undefined,
          matricula: data.matricula || undefined,
        }),
      });
      if (res.ok) {
        setSubmittedName(data.nome);
        setSubmitState("success");

      } else {
        const err = await res.json();
        const details = err.errors && Array.isArray(err.errors) ? `: ${err.errors.join(", ")}` : "";
        setSubmitError(`${err?.message || "Erro ao enviar"}${details}`);
        setSubmitState("error");
      }
    } catch {
      setSubmitError("Erro de conexão. Verifique sua internet e tente novamente.");
      setSubmitState("error");
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  const benefits = [
    { icon: "💰", text: "5% de desconto direto em folha de pagamento" },
    { icon: "⚖️", text: "Assistência jurídica especializada" },
    { icon: "🏥", text: "Convênios de saúde exclusivos" },
    { icon: "🏖️", text: "Acesso a pousadas e lazer" },
    { icon: "📚", text: "Educação e capacitação profissional" },
    { icon: "🤝", text: "Rede de suporte entre servidores" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8 sm:py-12">
      {/* ── Header ── */}
      <div className="w-full max-w-md text-center mb-8">
        <div className="inline-flex items-center justify-center gap-2 bg-white/8 border border-white/15 rounded-full px-4 py-1.5 text-xs text-blue-200/80 font-medium mb-6 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Associação dos Servidores da Segurança do Ceará
        </div>

        {/* Logo placeholder */}
        <div className="flex items-center justify-center mb-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-yellow-400/20 text-2xl font-black text-[#0a1628]">
            A
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight tracking-tight mb-3">
          Faça parte da{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-300">
            ASSEC
          </span>
        </h1>

        {/* ── Destaque 5% ── */}
        <div className="relative mt-4 mb-2">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-amber-400/20 rounded-2xl blur-sm" />
          <div className="relative bg-gradient-to-r from-yellow-400/15 to-amber-400/10 border border-yellow-400/30 rounded-2xl px-5 py-4">
            <div className="flex items-center justify-center gap-3">
              <div className="text-4xl font-black text-yellow-400">5%</div>
              <div className="text-left">
                <div className="text-white font-bold text-sm leading-tight">desconto em folha</div>
                <div className="text-yellow-200/70 text-xs">garantido por convenção</div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-blue-200/70 text-sm mt-4 leading-relaxed">
          Preencha o formulário abaixo. Nossa equipe entrará em contato para concluir sua filiação.
        </p>
      </div>

      {/* ── Benefits strip ── */}
      <div className="w-full max-w-md mb-8">
        <div className="grid grid-cols-2 gap-2">
          {benefits.map((b) => (
            <div
              key={b.text}
              className="flex items-start gap-2 bg-white/5 border border-white/8 rounded-xl px-3 py-2.5"
            >
              <span className="text-lg shrink-0">{b.icon}</span>
              <span className="text-xs text-blue-100/80 leading-snug">{b.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Form card ── */}
      <div className="w-full max-w-md">
        <div className="bg-white/8 backdrop-blur-md border border-white/12 rounded-3xl p-6 sm:p-8 shadow-2xl">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-10 h-10 border-2 border-white/20 border-t-yellow-400 rounded-full animate-spin" />
            </div>
          ) : loadError ? (
            <div className="text-center py-8">
              <p className="text-red-400 text-sm">Não foi possível carregar a campanha.</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 text-xs text-blue-300 underline"
              >
                Tentar novamente
              </button>
            </div>
          ) : campaign && (!campaign.available || campaign.expired || !campaign.active) ? (
            <ExpiredState />
          ) : submitState === "success" ? (
            <SuccessState nome={submittedName} />
          ) : (
            <>
              <h2 className="text-lg font-bold text-white mb-5">
                Pré-cadastro gratuito
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>

                {/* Submit error global */}
                {submitState === "error" && submitError && (
                  <div className="bg-red-500/15 border border-red-400/30 rounded-xl p-3 text-sm text-red-300">
                    {submitError}
                  </div>
                )}

                {/* Nome */}
                <FieldInput
                  id="nome"
                  label="Nome completo *"
                  placeholder="Seu nome completo"
                  autoComplete="name"
                  error={errors.nome?.message}
                  {...register("nome")}
                />

                {/* CPF */}
                <FieldInput
                  id="cpf"
                  label="CPF *"
                  placeholder="000.000.000-00"
                  inputMode="numeric"
                  autoComplete="off"
                  error={errors.cpf?.message}
                  {...register("cpf", {
                    onChange: (e) => {
                      e.target.value = formatCPF(e.target.value);
                    }
                  })}
                />

                {/* Telefone */}
                <FieldInput
                  id="telefone"
                  label="Telefone com DDD *"
                  placeholder="(85) 99999-9999"
                  inputMode="tel"
                  autoComplete="tel"
                  error={errors.telefone?.message}
                  {...register("telefone", {
                    onChange: (e) => {
                      e.target.value = formatPhone(e.target.value);
                    }
                  })}
                />

                {/* E-mail */}
                <FieldInput
                  id="email"
                  label="E-mail"
                  type="email"
                  placeholder="seu@email.com (opcional)"
                  autoComplete="email"
                  error={errors.email?.message}
                  {...register("email")}
                />

                {/* Órgão e Matrícula */}
                <div className="grid grid-cols-2 gap-3">
                  <FieldInput
                    id="orgao"
                    label="Órgão de lotação"
                    placeholder="Ex: SSPDS"
                    error={errors.orgao?.message}
                    {...register("orgao")}
                  />
                  <FieldInput
                    id="matricula"
                    label="Matrícula"
                    placeholder="Opcional"
                    error={errors.matricula?.message}
                    {...register("matricula")}
                  />
                </div>

                {/* LGPD Consent */}
                <div className="flex flex-col gap-1.5">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      id="consent"
                      className="mt-0.5 h-4 w-4 rounded border-white/30 bg-white/10 text-yellow-400 focus:ring-yellow-400/50 shrink-0 cursor-pointer"
                      {...register("consent")}
                    />
                    <span className="text-xs text-blue-200/70 leading-relaxed group-hover:text-blue-200/90 transition-colors">
                      Consinto com o tratamento dos meus dados pessoais para fins de filiação à ASSEC, nos termos da{" "}
                      <a
                        href="/politica-de-privacidade"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-yellow-400/90 underline font-semibold hover:text-yellow-300"
                      >
                        Política de Privacidade (LGPD)
                      </a>
                      .
                    </span>
                  </label>
                  {errors.consent?.message && (
                    <span className="text-xs text-red-400 font-medium ml-7">
                      {errors.consent.message}
                    </span>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitState === "loading"}
                  className="w-full py-4 bg-gradient-to-r from-yellow-400 to-amber-400 text-[#0a1628] font-black text-base rounded-2xl
                    hover:from-yellow-300 hover:to-amber-300 active:scale-[0.98] transition-all duration-150
                    disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-yellow-400/20 mt-2"
                >
                  {submitState === "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Enviando...
                    </span>
                  ) : (
                    "Quero me associar →"
                  )}
                </button>
              </form>

              {/* Security badge */}
              <div className="flex items-center justify-center gap-1.5 mt-5 text-xs text-blue-300/50">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Dados protegidos · LGPD · SSL
              </div>
            </>
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-blue-200/30 mt-6 leading-relaxed px-4">
          ASSEC — Associação dos Servidores da Segurança do Ceará<br />
          <a href="https://assecce.com.br" className="hover:text-blue-200/50 transition-colors">
            assecce.com.br
          </a>
        </p>
      </div>
    </div>
  );
}
