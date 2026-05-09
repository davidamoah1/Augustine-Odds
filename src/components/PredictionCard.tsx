import { motion } from "motion/react";
import { Lock, Unlock, TrendingUp, Calendar, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { Prediction } from "../data/predictions";

interface PredictionCardProps {
  prediction: Prediction;
  onUnlock: () => void;
}

export default function PredictionCard({ prediction, onUnlock }: PredictionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[#0f1117] rounded-2xl overflow-hidden flex flex-col h-full group border border-white/5 shadow-2xl"
      id={`prediction-${prediction.id}`}
    >
      {/* Top Visual Area (Grey Area) */}
      <div className="relative aspect-[4/3] bg-[#2d303a] flex flex-col items-center justify-center p-4 sm:p-6 transition-colors group-hover:bg-[#343845]">
        {/* Odds Badge */}
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-[#00a3e0] text-white px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider">
             {prediction.expectedOdds || "Elite"}
          </div>
        </div>

        {/* Center Visual (Lock or Code) */}
        <div className="flex flex-col items-center gap-4 text-center">
          {prediction.unlocked ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center"
            >
              <div className="text-emerald-500 mb-1 sm:mb-2">
                <CheckCircle2 size={32} className="sm:w-[48px] sm:h-[48px]" />
              </div>
              <p className="text-[8px] sm:text-[10px] text-emerald-500 font-bold uppercase tracking-widest mb-1">Access Granted</p>
              <div className="bg-black/40 backdrop-blur-md px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-white/10 mt-1 sm:mt-2">
                <p className="text-lg sm:text-2xl font-mono font-black text-[#00a3e0] tracking-widest uppercase select-all">
                  {prediction.betCode || "ACTIVE"}
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="text-[#00a3e0]">
              <Lock size={48} strokeWidth={1.5} className="sm:w-[64px] sm:h-[64px] group-hover:scale-110 transition-transform duration-500" />
            </div>
          )}
        </div>
      </div>

      {/* Info Section (Dark Area) */}
      <div className="p-3 sm:p-5 flex flex-col flex-1 bg-[#0f1117]">
        <div className="flex justify-between items-start mb-1 gap-2">
          <h3 className="font-bold text-white text-[10px] sm:text-lg tracking-tight line-clamp-2">
            {prediction.title}
          </h3>
          <span className="text-[#00a3e0] text-[10px] sm:text-lg font-black whitespace-nowrap">
            GHS {prediction.price}
          </span>
        </div>
        
        <p className="text-slate-500 text-[8px] sm:text-[11px] font-bold uppercase tracking-widest mb-3 sm:mb-6">
          Today – Today
        </p>

        <button
          onClick={onUnlock}
          disabled={prediction.unlocked}
          className={`w-full py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl font-black text-[9px] sm:text-xs uppercase tracking-widest transition-all ${
            prediction.unlocked
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default"
              : "bg-[#00a3e0] text-white hover:bg-[#00b7f0] shadow-lg shadow-[#00a3e0]/10 active:scale-[0.98]"
          }`}
        >
          {prediction.unlocked ? "SYSTEM UNLOCKED" : "Purchase"}
        </button>
      </div>
    </motion.div>

  );
}
