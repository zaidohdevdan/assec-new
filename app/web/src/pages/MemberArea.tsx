/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
import { authService } from "../services/authService";
import { useAuthStore } from "../store/useAuthStore";

export default function MemberArea() {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  // Login states
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const setAuth = useAuthStore((state) => state.setAuth);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  // Redirecionar se já está autenticado
  useEffect(() => {
    if (token && user) {
      const destination = user.role === "ADMIN" ? "/admin-dashboard" : "/dashboard";
      navigate(destination, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchParams.get("mode") === "register") {
      setIsLogin(false);
      setIsForgotPassword(false);
    }
  }, [searchParams]);

  const [regData, setRegData] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    orgao: ""
  });

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoading(true);
    const payload = { email: loginIdentifier, password: loginPassword };
    console.log("[DEBUG] Login payload:", JSON.stringify(payload));
    try {
      const data = await authService.login(payload);
      console.log("[DEBUG] Login response:", data);
      setAuth(data.user, data.access_token);
      const destination = "/dashboard";
      navigate(destination, { replace: true });
    } catch (err: any) {
      console.error("[DEBUG] Login error:", err);
      setLoginError(err.response?.data?.message || "Erro ao fazer login. Verifique suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier || !loginPassword) {
      setLoginError("Por favor, preencha o seu Email/CPF e a nova senha.");
      return;
    }

    setIsLoading(true);
    const payload = { identifier: loginIdentifier, newPassword: loginPassword };
    try {
      const result = await authService.resetPassword(payload);
      alert(`Senha alterada com sucesso! Você já pode fazer o login.`);
      setIsForgotPassword(false);
      setLoginPassword("");
    } catch (err: any) {
      if (err.response?.status === 401) {
        setLoginError("Usuário não encontrado. O e-mail ou CPF digitado não está cadastrado.");
      } else if (err.response?.status === 400) {
        setLoginError("A nova senha deve ter pelo menos 6 caracteres.");
      } else {
        setLoginError("Erro ao tentar redefinir a senha. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
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
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", paddingBlock: "5rem", paddingInline: "1rem" }}>
      <div 
        style={{
          maxWidth: "1000px",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          background: "var(--surface)",
          borderRadius: "3rem",
          border: "1px solid var(--border)",
          overflow: "hidden"
        }}
      >
        {/* Left Side - Info */}
        <div 
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "3rem",
            background: "var(--surface-2)",
            borderRight: "1px solid var(--border)",
            position: "relative",
            overflow: "hidden"
          }}
          className="nav-desktop"
        >
          <div 
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "250px",
              height: "250px",
              background: "var(--gold)",
              filter: "blur(100px)",
              opacity: 0.05,
              pointerEvents: "none"
            }}
          ></div>
          <div style={{ position: "relative", zIndex: 10 }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--ink)", marginBottom: "2rem", lineHeight: 1.2 }}>
              Bem-vindo à sua <br />
              <span style={{ color: "var(--gold)", fontStyle: "italic", fontFamily: "Alumni Sans, sans-serif" }}>Plataforma de Benefícios</span>
            </h2>
            <p style={{ color: "var(--ink-muted)", fontSize: "1.125rem", marginBottom: "3rem", lineHeight: 1.5 }}>
              No portal do associado você gerencia sua carteira digital, consulta convênios e solicita apoio jurídico com um clique.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {[
                { icon: <CreditCard size={20} style={{ color: "var(--gold)" }} />, text: "Carteirinha Digital" },
                { icon: <CalendarDays size={20} style={{ color: "var(--gold)" }} />, text: "Agendamento de Clubes" }
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "1rem", color: "var(--ink)", fontWeight: 500 }}>
                  <div style={{ width: "2.5rem", height: "2.5rem", background: "rgba(224, 180, 100, 0.05)", border: "1px solid rgba(224, 180, 100, 0.15)", borderRadius: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {item.icon}
                  </div>
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          <div style={{ position: "relative", zIndex: 10, paddingTop: "3rem", borderTop: "1px solid var(--border)", marginTop: "3rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <ShieldCheck size={20} style={{ color: "var(--gold)" }} />
              <span style={{ fontSize: "0.875rem", color: "var(--ink-muted)", fontWeight: 500 }}>Conexão Segura e Criptografada</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div style={{ padding: "clamp(2rem, 5vw, 4rem)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            key={isLogin ? 'login' : 'register'}
          >
            <header style={{ marginBottom: "2.5rem", textAlign: "center" }}>
              <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--ink)", marginBottom: "0.5rem" }}>
                {!isLogin ? 'Novo Associado' : (isForgotPassword ? 'Recuperar Senha' : 'Acessar Conta')}
              </h1>
              <p style={{ color: "var(--ink-muted)", fontSize: "1rem" }}>
                {!isLogin ? 'Preencha o formulário para enviar seus dados via WhatsApp.' : (isForgotPassword ? 'Informe seu identificador para receber instruções de recuperação.' : 'Entre com seus dados de associado.')}
              </p>
            </header>

            <form style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }} onSubmit={!isLogin ? handleRegister : (isForgotPassword ? handleForgotPassword : handleLogin)}>
              {!isLogin ? (
                <>
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "var(--ink)", marginBottom: "0.5rem" }}>Nome Completo</label>
                    <div style={{ position: "relative" }}>
                      <User style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", width: "1.25rem", height: "1.25rem", color: "var(--ink-muted)", zIndex: 10, pointerEvents: "none" }} className="center-y-lucide" />
                      <input
                        type="text"
                        required
                        value={regData.nome}
                        onChange={(e) => setRegData({ ...regData, nome: e.target.value })}
                        placeholder="Nome Completo"
                        className="form-input has-icon"
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "var(--ink)", marginBottom: "0.5rem" }}>CPF</label>
                    <div style={{ position: "relative" }}>
                      <User style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", width: "1.25rem", height: "1.25rem", color: "var(--ink-muted)", zIndex: 10, pointerEvents: "none" }} className="center-y-lucide" />
                      <input
                        type="text"
                        required
                        value={regData.cpf}
                        onChange={(e) => setRegData({ ...regData, cpf: e.target.value })}
                        placeholder="000.000.000-00"
                        className="form-input has-icon"
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "var(--ink)", marginBottom: "0.5rem" }}>Telefone (WhatsApp)</label>
                    <div style={{ position: "relative" }}>
                      <Phone style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", width: "1.25rem", height: "1.25rem", color: "var(--ink-muted)", zIndex: 10, pointerEvents: "none" }} className="center-y-lucide" />
                      <input
                        type="tel"
                        required
                        value={regData.telefone}
                        onChange={(e) => setRegData({ ...regData, telefone: e.target.value })}
                        placeholder="(85) 9 9999-9999"
                        className="form-input has-icon"
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "var(--ink)", marginBottom: "0.5rem" }}>Órgão / Lotação</label>
                    <div style={{ position: "relative" }}>
                      <Building2 style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", width: "1.25rem", height: "1.25rem", color: "var(--ink-muted)", zIndex: 10, pointerEvents: "none" }} className="center-y-lucide" />
                      <input
                        type="text"
                        required
                        value={regData.orgao}
                        onChange={(e) => setRegData({ ...regData, orgao: e.target.value })}
                        placeholder="Ex: Polícia Militar"
                        className="form-input has-icon"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "var(--ink)", marginBottom: "0.5rem" }}>Email (ou CPF/Matrícula)</label>
                    <div style={{ position: "relative" }}>
                      <User style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", width: "1.25rem", height: "1.25rem", color: "var(--ink-muted)", zIndex: 10, pointerEvents: "none" }} className="center-y-lucide" />
                      <input
                        type="text"
                        required
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="Email ou 000.000.000-00"
                        className="form-input has-icon"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "var(--ink)", marginBottom: "0.5rem" }}>{isForgotPassword ? 'Nova Senha' : 'Senha'}</label>
                    <div style={{ position: "relative" }}>
                      <Lock style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", width: "1.25rem", height: "1.25rem", color: "var(--ink-muted)", zIndex: 10, pointerEvents: "none" }} className="center-y-lucide" />
                      <input
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="form-input has-icon"
                      />
                    </div>
                  </div>

                  {!isForgotPassword && (
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <button
                        type="button"
                        onClick={() => setIsForgotPassword(true)}
                        style={{ background: "none", border: "none", fontSize: "0.875rem", fontWeight: 700, color: "var(--gold)", cursor: "pointer" }}
                      >
                        Esqueceu a senha?
                      </button>
                    </div>
                  )}

                  {isForgotPassword && (
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <button
                        type="button"
                        onClick={() => setIsForgotPassword(false)}
                        style={{ background: "none", border: "none", fontSize: "0.875rem", fontWeight: 700, color: "var(--gold)", cursor: "pointer" }}
                      >
                        Voltar ao Login
                      </button>
                    </div>
                  )}

                  {loginError && (
                    <div style={{ color: "#ef4444", fontSize: "0.875rem", fontWeight: 700, textAlign: "center" }}>
                      {loginError}
                    </div>
                  )}
                </>
              )}

              <button
                disabled={isLoading}
                className="btn btn-primary"
                style={{
                  width: "100%",
                  paddingBlock: "1.125rem",
                  fontSize: "1.125rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem"
                }}
              >
                {isLoading ? 'Carregando...' : (!isLogin ? 'Enviar via WhatsApp' : (isForgotPassword ? 'Recuperar Senha' : 'Entrar Agora'))}
                {!isLoading && <ArrowRight size={20} />}
              </button>
            </form>

            <div style={{ marginTop: "2.5rem", paddingTop: "2.5rem", borderTop: "1px solid var(--border)", textAlign: "center" }}>
              <p style={{ color: "var(--ink-muted)" }}>
                {isLogin ? 'Ainda não é associado?' : 'Já possui cadastro?'}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setIsForgotPassword(false);
                  }}
                  style={{ background: "none", border: "none", marginLeft: "0.5rem", fontWeight: 700, color: "var(--ink)", cursor: "pointer", textDecoration: "underline" }}
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
