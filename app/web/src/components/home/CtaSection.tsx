import { Link } from "react-router-dom";

export default function CtaSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <div className="bg-linear-to-br from-blue-600 to-blue-800 rounded-[3rem] p-12 md:p-20 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat"></div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 relative z-10">
            Pronto para fazer parte da maior associação de segurança do estado?
          </h2>
          <p className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto relative z-10">
            Junte-se a milhares de companheiros e fortaleça nossa categoria. Sua família e sua carreira protegidas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link to="/area-associado?mode=register" className="bg-white text-blue-950 px-10 py-5 rounded-2xl font-black text-xl hover:shadow-2xl transition-all active:scale-95 text-center">
              Associar-se Agora
            </Link>
            <Link to="/contato" className="bg-blue-900/50 backdrop-blur-sm text-white border border-white/20 px-10 py-5 rounded-2xl font-black text-xl hover:bg-blue-900/70 transition-all text-center">
              Falar com Vendas
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
