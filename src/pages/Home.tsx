import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Trophy, Users, Target, ShieldCheck, Zap, Database, Lock } from "lucide-react";
import PredictionCard from "../components/PredictionCard";
import PredictionCardSkeleton from "../components/PredictionCardSkeleton";
import { Prediction } from "../data/predictions";

interface HomeProps {
  stats: any[];
  recentWins: any[];
  predictions: Prediction[];
  isLoading: boolean;
  onUnlock: (prediction: Prediction) => void;
}

export default function Home({ stats, recentWins, predictions, isLoading, onUnlock }: HomeProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header className="max-w-6xl mb-32 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-[#00a3e0]/5 blur-[120px] rounded-full pointer-events-none"
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/10 px-4 py-2 rounded-full mb-8 backdrop-blur-md">
            <div className="w-2 h-2 bg-[#00a3e0] rounded-full animate-pulse shadow-[0_0_10px_rgba(0,163,224,0.5)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Augustine Odds &bull; Elite Analysis Active</span>
          </div>
          
          <h1 className="text-[14vw] md:text-[8vw] lg:text-[7vw] font-display font-black leading-[0.82] tracking-tighter mb-10 text-white uppercase italic">
            AUGUSTINE<br />
            <span className="text-[#00a3e0] not-italic">ODDS</span>
          </h1>
          
          <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-16">
            <p className="text-lg md:text-xl text-slate-400 max-w-sm leading-relaxed border-l-2 border-[#00a3e0]/30 pl-6">
              Redefining football analytics with high-precision booking codes and data-driven insights. 
              Experience the definitive winning edge.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => {
                  const element = document.getElementById('vault');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#00a3e0] hover:bg-[#00b7f0] text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl shadow-[#00a3e0]/10 flex items-center gap-3 transition-all active:scale-95 group"
              >
                Enter Access Vault
                <Database size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <Link 
                to="/marketplace"
                className="bg-white/5 hover:bg-white/10 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center gap-3 transition-all active:scale-95 border border-white/5"
              >
                Full Archive
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </motion.div>
      </header>

      <section id="vault" className="mb-32 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00a3e0]/10 border border-[#00a3e0]/20 rounded-lg mb-4">
              <span className="w-1.5 h-1.5 bg-[#00a3e0] rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-[#00a3e0] uppercase tracking-widest">Live Terminal</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-display font-black text-white uppercase tracking-tighter leading-none">
              ACCESS<br />VAULT
            </h2>
          </div>
          <div className="max-w-xs md:text-right">
             <p className="text-slate-500 text-sm font-medium leading-relaxed">
              Real-time synchronization with elite data nodes. Secure your access to the latest high-odds predictions.
             </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <PredictionCardSkeleton key={n} />
            ))}
          </div>
        ) : predictions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {predictions.slice(0, 6).map((prediction, i) => (
              <motion.div
                key={`pred-${prediction.id}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <PredictionCard 
                  prediction={prediction} 
                  onUnlock={() => onUnlock(prediction)}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-20 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-[32px] flex items-center justify-center mx-auto mb-6 border border-white/10 opacity-30">
              <Lock size={32} className="text-slate-500" />
            </div>
            <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-xs">Waiting for Node Deployment</p>
          </div>
        )}

        {predictions.length > 6 && (
           <div className="mt-12 text-center">
              <Link 
                to="/marketplace" 
                className="inline-flex items-center gap-3 text-[10px] font-black text-[#00a3e0] uppercase tracking-[0.4em] hover:text-white transition-colors"
              >
                View All Nodes <ArrowRight size={14} />
              </Link>
           </div>
        )}
      </section>

      <section className="mb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={`stat-${stat.label}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className={`glass-card p-8 rounded-[40px] relative overflow-hidden group ${i === 0 ? "md:col-span-2" : ""}`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-[#00a3e0]/20 transition-colors">
                  <stat.icon className="text-[#00a3e0]" size={24} />
                </div>
                <div className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
                  {stat.trend}
                </div>
              </div>
              <div className="text-5xl md:text-6xl font-display font-black text-white mb-2 tracking-tighter">{stat.value}</div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{stat.label}</div>
              
              {i === 0 && (
                <div className="absolute bottom-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform hidden md:block">
                  <stat.icon size={120} className="text-[#00a3e0]" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mb-32 overflow-hidden py-10 border-y border-white/5 relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#010409] via-[#010409]/80 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#010409] via-[#010409]/80 to-transparent z-10" />
        
        <div className="flex items-center gap-8 mb-6 px-4">
           <div className="text-xs font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2 whitespace-nowrap">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Live Winning Feed
           </div>
           <div className="h-px flex-1 bg-white/5" />
        </div>

        <div className="flex whitespace-nowrap gap-6 animate-marquee">
          {[...recentWins, ...recentWins, ...recentWins].map((win, i) => (
            <div 
              key={`win-${i}`}
              className="inline-flex items-center gap-4 bg-white/[0.02] border border-white/5 px-6 py-4 rounded-2xl group hover:border-[#00a3e0]/50 transition-all"
            >
              <div className="bg-emerald-500/10 p-2 rounded-lg">
                <CheckCircle2 size={18} className="text-emerald-500" />
              </div>
              <div>
                <div className="text-sm font-bold text-white uppercase tracking-tight">{win.title}</div>
                <div className="text-xs text-slate-500 flex items-center gap-2">
                   <span className="font-mono text-[#00a3e0]">{win.odds} Odds</span>
                   <span className="opacity-20">•</span>
                   <span>{win.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="mb-32 scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-xl">
            <h2 className="text-5xl md:text-7xl font-display font-black mb-4 text-white leading-none uppercase tracking-tighter">THE ELITE<br />PROCESS</h2>
            <p className="text-slate-500 font-medium text-lg">Predicting the future is an art. Accessing it shouldn't be a struggle.</p>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center text-slate-700 font-mono text-xs">01</div>
            <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center text-slate-700 font-mono text-xs">02</div>
            <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center text-slate-700 font-mono text-xs">03</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              step: "01", 
              title: "Asset Selection", 
              desc: "Navigate through high-conviction betting markets analyzed by our lead experts.",
              icon: Zap 
            },
            { 
              step: "02", 
              title: "Instant Verification", 
              desc: "Encrypted transaction layer ensures your unlock is processed with military-grade safety.",
              icon: ShieldCheck 
            },
            { 
              step: "03", 
              title: "Win Deployment", 
              desc: "Immediate access to booking codes. Just copy, deploy, and watch the results.",
              icon: CheckCircle2 
            },
          ].map((item, i) => (
            <motion.div
              key={`step-${item.step}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="glass-card p-10 rounded-[48px] group hover:bg-white/[0.03]"
            >
              <div className="mb-8 flex justify-between items-start">
                 <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-[#00a3e0]/10 group-hover:border-[#00a3e0]/20 transition-all">
                    <item.icon className="text-[#00a3e0]" size={28} />
                 </div>
                 <div className="font-display font-black text-4xl text-white/5 group-hover:text-[#00a3e0]/10 transition-colors">{item.step}</div>
              </div>
              <h3 className="text-2xl font-display font-black mb-4 text-white uppercase tracking-tight">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
