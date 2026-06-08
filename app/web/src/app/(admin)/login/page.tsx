"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield } from "lucide-react";
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
        // If not OK, user is not authenticated — stay on login page
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
        // Session cookie (__Host-assec_session) is now set automatically by the backend (HttpOnly).
        // We only store non-sensitive display data in localStorage (name, role, photo).
        // The JWT itself is NOT in localStorage — this is the XSS protection.
        const userDisplay = {
          id: body.user?.id,
          name: body.user?.name,
          email: body.user?.email ?? data.email,
          role: body.user?.role ?? "USER",
          status: body.user?.status,
          photoUrl: body.user?.photoUrl ?? null,
          specialty: body.user?.specialty ?? null,
          org: body.user?.org ?? null,
          matricula: body.user?.matricula ?? null,
        };
        localStorage.setItem("user", JSON.stringify(userDisplay));
        // Also persist access_token for Root Terminal backward compatibility
        // TODO(security): Remove once terminal migrates to cookie-based auth
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
    <div className="min-h-screen bg-primary flex flex-col justify-center items-center px-4">
      <div className="flex items-center gap-3 text-white mb-8">
        <Shield className="h-10 w-10 text-accent" />
        <div className="flex flex-col">
          <span className="font-serif font-bold text-2xl tracking-wide leading-none">
            ASSEC
          </span>
          <span className="text-[10px] uppercase tracking-widest text-accent-light mt-1">
            Painel Administrativo
          </span>
        </div>
      </div>

      <Card className="w-full max-w-md p-8 bg-white shadow-xl rounded-lg">
        <h1 className="font-serif font-bold text-xl text-primary text-center mb-6">
          Acesse sua Conta
        </h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-sm text-red-700 flex items-center gap-2" role="alert">
            <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="E-mail"
            placeholder="admin@assec.com.br"
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label="Senha"
            type="password"
            placeholder="••••••"
            error={errors.password?.message}
            {...register("password")}
          />

          <div className="pt-2">
            <Button
              type="submit"
              loading={loading}
              className="w-full bg-accent text-primary hover:bg-accent-light font-bold py-3 text-base animate-none"
            >
              Entrar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
