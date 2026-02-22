"use client";
import { useState } from "react";

export default function Home() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [copiadoIdx, setCopiadoIdx] = useState(null);
  const [activeMode, setActiveMode] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const analyzeChat = async (mode) => {
    if (!image) return alert("Sube una captura primero");
    setLoading(true);
    setActiveMode(mode);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, mode }),
      });
      const data = await res.json();
      if (data.opciones) {
        setResults(data.opciones);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      alert("Error analizando la imagen");
    }
    setLoading(false);
  };

  const copiarTexto = (texto, index) => {
    navigator.clipboard.writeText(texto);
    setCopiadoIdx(index);
    setTimeout(() => setCopiadoIdx(null), 2000);
  };

  // Mapeo dinámico de etiquetas según el botón presionado
  const getBadgeInfo = (index) => {
    const badges = {
      ligar: [
        { label: "Smooth 🔥", color: "text-pink-500", bg: "bg-pink-500/10" },
        { label: "Directo ⚡", color: "text-orange-500", bg: "bg-orange-500/10" },
        { label: "Playful ✨", color: "text-violet-500", bg: "bg-violet-500/10" }
      ],
      salvar: [
        { label: "Icebreaker 🧊", color: "text-blue-400", bg: "bg-blue-400/10" },
        { label: "Humor 🎭", color: "text-yellow-400", bg: "bg-yellow-400/10" },
        { label: "Clutch 🆘", color: "text-red-500", bg: "bg-red-500/10" }
      ],
      inteligente: [
        { label: "Deep 🧠", color: "text-emerald-400", bg: "bg-emerald-400/10" },
        { label: "Analytical 💎", color: "text-cyan-400", bg: "bg-cyan-400/10" },
        { label: "Sharp 🎯", color: "text-indigo-400", bg: "bg-indigo-400/10" }
      ]
    };
    return badges[activeMode]?.[index] || { label: "Opción", color: "text-zinc-500", bg: "bg-zinc-500/10" };
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center p-6 font-sans selection:bg-pink-500/20">
      
      <header className="flex flex-col items-center mb-10 mt-6 text-center">
        <div className="bg-gradient-to-tr from-pink-500 to-violet-600 p-3 rounded-2xl shadow-[0_0_40px_rgba(236,72,153,0.3)] mb-4 rotate-2">
          <span className="text-2xl font-bold italic">✍️</span>
        </div>
        <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent italic">
          GHOSTWRITER
        </h1>
        <p className="text-zinc-500 font-bold tracking-[0.4em] text-[9px] mt-2 uppercase">
          Domina el arte del chat
        </p>
      </header>

      <div className="w-full max-w-md">
        {!results ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <label className="group border-2 border-dashed border-zinc-800 bg-zinc-900/40 rounded-[3.5rem] h-72 flex flex-col items-center justify-center cursor-pointer hover:border-pink-500/40 transition-all overflow-hidden relative shadow-inner">
              {image ? (
                <img src={image} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="flex flex-col items-center gap-3">
                   <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-pink-600 group-hover:shadow-[0_0_20px_rgba(219,39,119,0.5)] transition-all">
                    <span className="text-2xl text-zinc-400 group-hover:text-white">+</span>
                   </div>
                   <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Sube tu captura</span>
                </div>
              )}
              <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
            </label>

            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={() => analyzeChat("ligar")} 
                disabled={loading} 
                className="w-full py-5 bg-white text-black rounded-[2.5rem] font-black text-xs tracking-widest uppercase hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50"
              >
                {loading && activeMode === 'ligar' ? "Cocinando flow..." : "🔥 Modo Ligar"}
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => analyzeChat("salvar")} 
                  disabled={loading}
                  className="py-5 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] font-black text-[10px] tracking-widest uppercase hover:bg-zinc-800 transition-all disabled:opacity-50"
                >
                   {loading && activeMode === 'salvar' ? "Rescatando..." : "🆘 Salvar"}
                </button>
                <button 
                  onClick={() => analyzeChat("inteligente")} 
                  disabled={loading}
                  className="py-5 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] font-black text-[10px] tracking-widest uppercase hover:bg-zinc-800 transition-all disabled:opacity-50"
                >
                   {loading && activeMode === 'inteligente' ? "Pensando..." : "🧠 Genio"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-10 duration-700 pb-20">
            <button 
              onClick={() => { setResults(null); setImage(null); }}
              className="text-zinc-500 hover:text-white transition-colors mb-2 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2"
            >
              <span>←</span> Nueva captura
            </button>

            {results.map((opt, i) => {
              const badge = getBadgeInfo(i);
              return (
                <div 
                  key={i} 
                  className="bg-zinc-900/80 backdrop-blur-xl p-8 rounded-[3rem] border border-zinc-800 shadow-2xl relative group overflow-hidden"
                >
                  <div className="flex justify-between items-center mb-6">
                    <span className={`text-[10px] font-black tracking-[0.3em] uppercase ${badge.color} ${badge.bg} px-4 py-2 rounded-full`}>
                      {badge.label}
                    </span>
                    <div className="flex gap-1.5 opacity-30">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                    </div>
                  </div>
                  
                  <p className="text-zinc-100 text-xl font-medium leading-[1.45] mb-8 italic">
                    "{opt.texto}"
                  </p>
                  
                  <button 
                    onClick={() => copiarTexto(opt.texto, i)}
                    className={`w-full py-4 rounded-[1.8rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                      copiadoIdx === i 
                      ? "bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]" 
                      : "bg-zinc-800 text-zinc-400 hover:bg-white hover:text-black active:scale-95"
                    }`}
                  >
                    {copiadoIdx === i ? "Copiado!" : "Copiar respuesta"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <footer className="mt-auto py-10 text-[9px] text-zinc-800 font-bold tracking-[0.6em] uppercase">
        © 2026 ANTO.DEV
      </footer>
    </main>
  );
}