
import { motion } from "motion/react";
import {
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Instagram,
} from "lucide-react";

export default function Contact() {
  return (
    <div className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-blue-950 mb-8 tracking-tight">Estamos aqui para <span className="text-blue-600">ouvir você.</span></h1>
            <p className="text-xl text-slate-600 mb-12 max-w-lg leading-relaxed">
              Dúvidas, sugestões ou solicitações? Escolha o canal de sua preferência ou preencha o formulário e nossa equipe entrará em contato em até 24 horas.
            </p>

            <div className="space-y-8 mb-12">
              <div className="flex gap-6 items-center">
                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shrink-0">
                  <Phone className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">WhatsApp / Plantão</h4>
                  <a href="https://wa.me/5585999411411" target="_blank" rel="noreferrer" className="text-2xl font-bold text-blue-950 tracking-tight hover:text-green-600 transition-colors">(85) 99941-1411</a>
                </div>
              </div>

              <div className="flex gap-6 items-center">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                  <Mail className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">E-mail institucional</h4>
                  <p className="text-2xl font-bold text-blue-950 tracking-tight">contato@assecce.com.br</p>
                </div>
              </div>
              <div className="flex gap-6 items-center">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                  <MapPin className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Onde Estamos</h4>
                  <p className="text-lg font-bold text-blue-950 tracking-tight leading-tight">
                    Av. Santos Dumont, 1510, sala 805, Aldeota, Fortaleza/CE</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 items-center flex-wrap">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Siga nossas Redes Sociais:</h4>
              <a href="https://www.instagram.com/assec.ceara/"
                target="_blank" rel="noreferrer"
                className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                <Instagram /></a>

              </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-50 p-10 md:p-14 rounded-[3rem] border border-slate-100"
          >
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nome Completo</label>
                  <input type="text" className="w-full bg-white border border-slate-200 p-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Matrícula (Opcional)</label>
                  <input type="text" className="w-full bg-white border border-slate-200 p-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">E-mail</label>
                <input type="email" className="w-full bg-white border border-slate-200 p-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Assunto</label>
                <select className="w-full bg-white border border-slate-200 p-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all">
                  <option>Dúvidas Gerais</option>
                  <option>Suporte Jurídico</option>
                  <option>Convênios Médicos</option>
                  <option>Reclamações</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Mensagem</label>
                <textarea className="w-full bg-white border border-slate-200 p-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all h-40 resize-none"></textarea>
              </div>
              <button className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3">
                <MessageSquare className="w-6 h-6" /> Enviar Mensagem
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
