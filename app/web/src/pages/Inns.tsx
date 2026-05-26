import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { 
  MapPin, 
  Wifi, 
  Waves, 
  Coffee, 
  Utensils, 
  Tv, 
  ChevronRight,
  Info,
  CalendarDays
} from "lucide-react";
import { Link } from "react-router-dom";
import { innService } from "../services/innService";

const renderIcon = (name: string, key: string | number) => {
  switch (name.toLowerCase()) {
    case 'wifi': return <Wifi key={key} />;
    case 'waves': return <Waves key={key} />;
    case 'coffee': return <Coffee key={key} />;
    case 'utensils': return <Utensils key={key} />;
    case 'tv': return <Tv key={key} />;
    default: return <Info key={key} />;
  }
};

export default function Inns() {
  const [pousadas, setPousadas] = useState<any[]>([]);

  useEffect(() => {
    const fetchInns = async () => {
      try {
        const data = await innService.getAll();
        setPousadas(data);
      } catch (e) {
        console.error("Failed to fetch inns", e);
      }
    };
    fetchInns();
  }, []);
  return (
    <div className="py-20 lg:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-20 text-center lg:text-left">
           <p className="text-blue-600 font-black text-xs uppercase tracking-[0.4em] mb-4">Lazer & Descanso</p>
           <h1 className="text-4xl md:text-6xl font-black text-blue-950 mb-6 tracking-tight">Nossas <span className="text-blue-600">Pousadas</span></h1>
           <p className="text-xl text-slate-600 max-w-2xl leading-relaxed">
             O servidor merece o melhor descanso. A ASSEC mantém unidades próprias e convênios exclusivos em todo o Ceará.
           </p>
        </header>

        <div className="grid gap-12">
          {pousadas.map((pousada, idx) => (
            <motion.div 
              key={pousada.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} bg-white rounded-[3rem] overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all h-full`}
            >
              <div className="lg:w-1/2 aspect-16/10 lg:aspect-auto relative overflow-hidden group">
                 <img src={pousada.image} alt={pousada.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
                 <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-blue-900 font-bold text-sm shadow-lg flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> {pousada.location}
                 </div>
              </div>
              <div className="lg:w-1/2 p-10 md:p-16 flex flex-col justify-center">
                 <h2 className="text-3xl font-black text-blue-950 mb-6">{pousada.name}</h2>
                 <p className="text-slate-600 text-lg leading-relaxed mb-10">{pousada.description}</p>
                 
                 <div className="flex flex-wrap gap-4 mb-10">
                    {pousada.amenities && pousada.amenities.map((amenity: string, i: number) => (
                      <div key={i} className="p-4 bg-slate-50 text-blue-900 rounded-2xl border border-slate-100" title={amenity}>
                        {renderIcon(amenity, i)}
                      </div>
                    ))}
                 </div>

                 <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                    <Link to="/area-associado" className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-center hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                       <CalendarDays className="w-5 h-5" /> Reservar Agora
                    </Link>
                    <button className="bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-black hover:bg-slate-50 transition-all">
                       Regulamento de Uso
                    </button>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Info Box */}
        <section className="mt-20 bg-blue-950 rounded-[3rem] p-10 md:p-16 text-white text-center">
           <Info className="w-12 h-12 text-yellow-400 mx-auto mb-6" />
           <h3 className="text-2xl font-bold mb-4">Informação sobre Reservas</h3>
           <p className="text-blue-200 max-w-2xl mx-auto leading-relaxed">
             As reservas são exclusivas para associados ASSEC em dia com suas obrigações. A abertura de novos períodos ocorre mensalmente através do portal do associado.
           </p>
           <div className="mt-8 flex justify-center gap-6 text-sm font-bold">
              <div className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-blue-500" /> Check-in: 14:00</div>
              <div className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-blue-500" /> Check-out: 12:00</div>
           </div>
        </section>
      </div>
    </div>
  );
}
