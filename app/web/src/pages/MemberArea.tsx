
import { motion } from "motion/react";
import { 
  Lock, 
  User, 
  ArrowRight,
  ShieldCheck,
  CreditCard,
  CalendarDays,
  Phone,
  Building2
 } from "lucide-react";
import { useState, type FormEvent, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function MemberArea() {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  
  useEffect(() => {
    if (searchParams.get("mode") === "register") {
      setIsLogin(false);
    }
  }, [searchParams]);

  const [regData, setRegData] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    orgao: ""
  });
  const navigate = useNavigate();

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    // Simulate login and redirect to dashboard
    navigate("/dashboard");
  };

  const handleRegister = (e: FormEvent) => {
    e.preventDefault();
    
    const message = `Olá ASSEC! Gostaria de me associar. Seguem meus dados para pré-cadastro:
    
*Nome:* ${regData.nome}
*CPF:* ${regData.cpf}
*Telefone:* ${regData.telefone}
*Órgão:* ${regData.orgao}

Aguardo retorno com as instruções para finalização.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/558532267677?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20 px-4 bg-slate-50">
      <div className="max-w-5xl w-full grid lg:grid-cols-2 bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
        {/* Left Side - Info */}
        <div className="hidden lg:flex flex-col justify-between p-16 bg-blue-950 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
           <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-8 leading-tight">Bem-vindo à sua <br /><span className="text-yellow-400">Plataforma de Benefícios</span></h2>
              <p className="text-blue-200 text-lg mb-12">No portal do associado você gerencia sua carteira digital, consulta convênios e solicita apoio jurídico com um clique.</p>
              
              <div className="space-y-6">
                {[
                  { icon: <CreditCard className="w-5 h-5" />, text: "Carteirinha Digital" },
                  { icon: <CalendarDays className="w-5 h-5" />, text: "Agendamento de Clubes" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 text-blue-100 font-medium">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                      {item.icon}
                    </div>
                    {item.text}
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
              <p className="text-slate-500">{isLogin ? 'Entre com seus dados de associado.' : 'Preencha o formulário para enviar seus dados via WhatsApp.'}</p>
            </header>

            <form className="space-y-5" onSubmit={isLogin ? handleLogin : handleRegister}>
              {!isLogin ? (
                <>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Nome Completo</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="text" 
                        required
                        value={regData.nome}
                        onChange={(e) => setRegData({...regData, nome: e.target.value})}
                        placeholder="Nome Completo" 
                        className="w-full bg-slate-50 border border-slate-200 pl-12 p-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">CPF</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="text" 
                        required
                        value={regData.cpf}
                        onChange={(e) => setRegData({...regData, cpf: e.target.value})}
                        placeholder="000.000.000-00" 
                        className="w-full bg-slate-50 border border-slate-200 pl-12 p-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Telefone (WhatsApp)</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="tel" 
                        required
                        value={regData.telefone}
                        onChange={(e) => setRegData({...regData, telefone: e.target.value})}
                        placeholder="(85) 9 9999-9999" 
                        className="w-full bg-slate-50 border border-slate-200 pl-12 p-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Órgão / Lotação</label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="text" 
                        required
                        value={regData.orgao}
                        onChange={(e) => setRegData({...regData, orgao: e.target.value})}
                        placeholder="Ex: Polícia Militar" 
                        className="w-full bg-slate-50 border border-slate-200 pl-12 p-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium" 
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">CPF ou Matrícula</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input type="text" placeholder="000.000.000-00" className="w-full bg-slate-50 border border-slate-200 pl-12 p-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Senha</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 pl-12 p-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium" />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button type="button" className="text-sm font-bold text-blue-600 hover:underline">Esqueceu a senha?</button>
                  </div>
                </>
              )}

              <button className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-95">
                {isLogin ? 'Entrar Agora' : 'Enviar via WhatsApp'} <ArrowRight className="w-6 h-6" />
              </button>
            </form>

            <div className="mt-10 pt-10 border-t border-slate-100 text-center">
              <p className="text-slate-500">
                {isLogin ? 'Ainda não é associado?' : 'Já possui cadastro?'}
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 font-bold text-blue-900 hover:underline"
                >
                  {isLogin ? 'Quero me Associar' : 'Fazer Login'}
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
