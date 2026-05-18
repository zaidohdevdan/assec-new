import { motion } from "motion/react";
import { Lock, User, ArrowRight, ShieldCheck, CreditCard, CalendarDays, Building2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, registerSchema } from "../schemas";
import { LoginInput, RegisterInput } from "../types";
import { authService } from "../services/auth.service";
import SchedulesModal from '../components/dashboard/modals/SchedulesModal'; // Import the new modal component



export default function MemberArea() {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSchedulesModal, setShowSchedulesModal] = useState(false); // State to manage modal visibility
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get("mode") === "register") {
      setIsLogin(false);
    }
  }, [searchParams]);

  // Login Form
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  // Register Form
  const {
    register: registerForm,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onLogin = async (data: LoginInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login({
        email: data.email.trim(),      // ← Sanitização extra
        password: data.password.trim(),
      });

      localStorage.setItem('@assec/token', response.access_token);
      navigate("/dashboard");

    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Erro ao fazer login';

      console.error('❌ Login error:', err); // ← Debug no console
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const onRegister = (data: RegisterInput) => {
    // Formatar mensagem para WhatsApp
    const message = `Olá ASSEC! Gostaria de me associar. Seguem meus dados para pré-cadastro:

*Nome:* ${data.name}
*E-mail:* ${data.email}
*CPF:* ${data.cpf}
*Órgão:* ${data.org}
${data.matricula ? `*Matrícula:* ${data.matricula}\n` : ''}
${data.rg ? `*RG:* ${data.rg}\n` : ''}
Aguardo retorno com as instruções para finalização.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/558532267677?text=${encodedMessage}`;

    // Abrir WhatsApp em nova aba
    window.open(whatsappUrl, '_blank');

    // Feedback visual
    alert("Redirecionando para o WhatsApp... Após enviar, aguarde contato da ASSEC para validação.");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20 px-4 bg-slate-50">
      <div className="max-w-5xl w-full grid lg:grid-cols-2 bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
        {/* Left Side - Info (mantenha como está) */}
        <div className="hidden lg:flex flex-col justify-between p-16 bg-blue-950 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-8 leading-tight">Bem-vindo à sua <br /><span className="text-yellow-400">Plataforma de Benefícios</span></h2>
            <p className="text-blue-200 text-lg mb-12">No portal do associado você gerencia sua carteira digital, consulta convênios e solicita apoio jurídico com um clique.</p>

            <div className="space-y-6">
              {[
                { icon: <CreditCard className="w-5 h-5" />, text: "Carteirinha Digital" },
                // Modified section for "Agendamento de Clubes"
                { icon: <CalendarDays className="w-5 h-5" />, text: "Agendamento de Clubes", action: () => setShowSchedulesModal(true) }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-blue-100 font-medium">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    {item.icon}
                  </div>
                  {/* If item has an action, make it clickable */}
                  {item.action ? (
                    <button type="button" onClick={item.action} className="text-blue-100 font-medium hover:underline">
                      {item.text}
                    </button>
                  ) : (
                    item.text
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 pt-12 border-t border-white/10">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-green-400" />
              <span className="text-sm text-blue-200 font-medium">Conexão Segura e Criptografada</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-8 md:p-16 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            key={isLogin ? 'login' : 'register'}
          >
            <header className="mb-10 text-center lg:text-left">
              <h1 className="text-3xl font-bold text-blue-950 mb-2">{isLogin ? 'Acessar Conta' : 'Novo Associado'}</h1>
              <p className="text-slate-500">{isLogin ? 'Entre com seus dados de associado.' : 'Preencha o formulário para se associar.'}</p>
            </header>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            {isLogin ? (
              <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">E-mail</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      {...registerLogin("email")}
                      type="email"
                      placeholder="seu@email.com"
                      className="w-full bg-slate-50 border border-slate-200 pl-12 p-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium"
                    />
                  </div>
                  {loginErrors.email && <p className="text-red-500 text-xs mt-1">{loginErrors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      {...registerLogin("password")}
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 pl-12 p-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium"
                    />
                  </div>
                  {loginErrors.password && <p className="text-red-500 text-xs mt-1">{loginErrors.password.message}</p>}
                </div>

                <div className="flex justify-end">
                  <button type="button" className="text-sm font-bold text-blue-600 hover:underline">Esqueceu a senha?</button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Entrando...' : 'Entrar Agora'} <ArrowRight className="w-6 h-6" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit(onRegister)} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nome Completo</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      {...registerForm("name")}
                      type="text"
                      placeholder="Nome Completo"
                      className="w-full bg-slate-50 border border-slate-200 pl-12 p-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium"
                    />
                  </div>
                  {registerErrors.name && <p className="text-red-500 text-xs mt-1">{registerErrors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">E-mail</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      {...registerForm("email")}
                      type="email"
                      placeholder="seu@email.com"
                      className="w-full bg-slate-50 border border-slate-200 pl-12 p-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium"
                    />
                  </div>
                  {registerErrors.email && <p className="text-red-500 text-xs mt-1">{registerErrors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">CPF</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      {...registerForm("cpf")}
                      type="text"
                      placeholder="000.000.000-00"
                      className="w-full bg-slate-50 border border-slate-200 pl-12 p-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium"
                    />
                  </div>
                  {registerErrors.cpf && <p className="text-red-500 text-xs mt-1">{registerErrors.cpf.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Órgão / Lotação</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      {...registerForm("org")}
                      type="text"
                      placeholder="Ex: Polícia Militar"
                      className="w-full bg-slate-50 border border-slate-200 pl-12 p-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium"
                    />
                  </div>
                  {registerErrors.org && <p className="text-red-500 text-xs mt-1">{registerErrors.org.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? 'Cadastrando...' : 'Enviar Cadastro'} <ArrowRight className="w-6 h-6" />
                </button>
              </form>
            )}

            <div className="mt-10 pt-10 border-t border-slate-100 text-center">
              <p className="text-slate-500">
                {isLogin ? 'Ainda não é associado?' : 'Já possui cadastro?'}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError(null);
                  }}
                  className="ml-2 font-bold text-blue-900 hover:underline"
                >
                  {isLogin ? 'Quero me Associar' : 'Fazer Login'}
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Render SchedulesModal */}
      {showSchedulesModal && <SchedulesModal open={showSchedulesModal} onClose={() => setShowSchedulesModal(false)} />}
    </div>
  );
}