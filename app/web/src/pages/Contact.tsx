import { motion } from "motion/react";
import { Phone, Mail, MapPin, MessageSquare, Instagram, Facebook, Youtube } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema } from "../schemas";
import { ContactInput } from "../types";
import { contactService } from "../services/contact.service";
import { useState } from "react";

export default function Contact() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactInput) => {
    setIsLoading(true);
    try {
      await contactService.sendMessage(data);
      setSuccess(true);
      reset();
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      alert("Erro ao enviar mensagem. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20">
          {/* Lado esquerdo - mantenha como está */}

          {/* Lado direito - Formulário */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-50 p-10 md:p-14 rounded-[3rem] border border-slate-100"
          >
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-600">
                Mensagem enviada com sucesso! Entraremos em contato em breve.
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nome Completo</label>
                  <input
                    {...register("name")}
                    type="text"
                    className="w-full bg-white border border-slate-200 p-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Matrícula (Opcional)</label>
                  <input type="text" className="w-full bg-white border border-slate-200 p-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">E-mail</label>
                <input
                  {...register("email")}
                  type="email"
                  className="w-full bg-white border border-slate-200 p-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Assunto</label>
                <input
                  {...register("subject")}
                  type="text"
                  className="w-full bg-white border border-slate-200 p-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                />
                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Mensagem</label>
                <textarea
                  {...register("message")}
                  className="w-full bg-white border border-slate-200 p-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all h-40 resize-none"
                ></textarea>
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <MessageSquare className="w-6 h-6" /> {isLoading ? 'Enviando...' : 'Enviar Mensagem'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}