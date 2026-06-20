"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Lock } from "lucide-react";
import { apiFetch } from "@/lib/api";

const loginSchema = z.object({
  email: z.string().email("Endereço de e-mail inválido"),
  password: z.string().min(6, "A senha deve conter no mínimo 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  // Check for an existing session by calling /auth/me (uses the HttpOnly cookie)
  React.useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await apiFetch("/auth/me");
        if (res.ok) {
          const user = await res.json();
          if (user?.role === "ADMIN") {
            router.push("/dashboard");
          } else {
            router.push("/portal");
          }
        }
      } catch {
        // Network error or no session — stay on login page
      }
    };
    void checkSession();
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      if (res.ok) {
        const body = await res.json();
        const userDisplay = {
          id: body.user?.id,
          name: body.user?.name,
          email: body.user?.email ?? data.email,
          role: body.user?.role ?? "USER",
          status: body.user?.status,
          photoUrl: body.user?.photoUrl ?? null,
          avatarUrl: body.user?.avatarUrl ?? null,
          specialty: body.user?.specialty ?? null,
          org: body.user?.org ?? null,
          matricula: body.user?.matricula ?? null,
        };
        localStorage.setItem("user", JSON.stringify(userDisplay));
        const secureFlag = typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";
        document.cookie = `assec_user_profile=${encodeURIComponent(JSON.stringify(userDisplay))}; path=/; max-age=31536000; SameSite=Lax${secureFlag}`;
        if (body.access_token) {
          localStorage.setItem("token", body.access_token);
        }

        const userRole = body.user?.role ?? "USER";
        if (userRole === "ADMIN") {
          router.push("/dashboard");
        } else {
          router.push("/portal");
        }
      } else {
        const errBody = await res.json().catch(() => ({}));
        setError(errBody?.message ?? "E-mail ou senha incorretos.");
      }
    } catch {
      setError("Erro de conexão. Verifique se o servidor do backend está ativo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-center items-center px-4 font-sans overflow-hidden bg-primary">
      {/* Background Image with Dark Blur Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-[5px] scale-105 pointer-events-none opacity-45"
        style={{ backgroundImage: "url('/banner-header.webp')" }}
      />
      <div className="absolute inset-0 bg-primary/70 mix-blend-multiply pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/50 to-primary/80 pointer-events-none" />

      {/* Navigation back to main site */}
      <div className="absolute top-6 left-6 z-20">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-white hover:text-accent font-semibold text-sm transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded p-1.5 backdrop-blur-sm bg-white/5 border border-white/10"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Voltar para o Site</span>
        </Link>
      </div>

      {/* Institutional Identification */}
      <div className="flex flex-col items-center text-center mb-8 z-10">
        <Link href="/" className="flex flex-col items-center group focus-visible:outline-none">
          <Image
            src="/logo-transparent.webp"
            alt="Logotipo Oficial da ASSEC"
            width={80}
            height={80}
            className="h-20 w-auto transition-transform duration-300 group-hover:scale-105 mb-4 drop-shadow-md"
            priority
          />
          <span className="font-serif font-extrabold text-2xl tracking-wider text-white leading-none">
            ASSEC
          </span>
          <span className="text-[9px] uppercase tracking-widest text-accent font-bold mt-1.5 max-w-[250px] leading-tight drop-shadow">
            Associação dos Servidores da Segurança do Ceará
          </span>
        </Link>
      </div>

      {/* Login Form Card */}
      <Card className="w-full max-w-md p-8 bg-white/95 backdrop-blur-md shadow-2xl rounded-xl z-10 border border-white/20 transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] group/card">
        <div className="flex items-center gap-2 justify-center mb-6">
          <Lock className="h-5 w-5 text-accent-dark" />
          <h1 className="font-serif font-bold text-xl text-primary text-center">
            Acesso Restrito
          </h1>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-sm text-red-700 flex items-center gap-2" role="alert">
            <svg className="h-5 w-5 shrink-0 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="E-mail"
            placeholder="associado@assecce.com.br"
            error={errors.email?.message}
            {...register("email")}
            className="w-full"
          />

          <Input
            label="Senha"
            type="password"
            placeholder="••••••"
            error={errors.password?.message}
            {...register("password")}
            className="w-full"
          />

          <div className="pt-2">
            <Button
              type="submit"
              loading={loading}
              className="w-full bg-accent text-primary hover:bg-accent-light font-bold py-3 text-base animate-none transition-all duration-300 hover:shadow-md active:scale-[0.99]"
            >
              Entrar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
