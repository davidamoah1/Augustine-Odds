import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { Lock, User, ShieldAlert, ArrowLeft } from "lucide-react";
import { predictionsService } from "../lib/supabase";

interface AdminLoginProps {
  onLogin: () => void;
  onClose: () => void;
}

export default function AdminLogin({ onLogin, onClose }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await predictionsService.login(username, password);
      onLogin();
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-md rounded-3xl overflow-hidden"
      >
        <div className="p-8">
          <button 
            onClick={onClose}
            className="mb-8 flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-wider"
          >
            <ArrowLeft size={16} />
            Back to site
          </button>

          <header className="mb-8 text-center">
            <div className="inline-flex bg-[#00a3e0]/10 p-4 rounded-2xl border border-[#00a3e0]/20 mb-4">
              <Lock size={32} className="text-[#00a3e0]" />
            </div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">Admin Login</h1>
            <p className="text-slate-400">Sign in to access the dashboard</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl text-sm flex flex-col gap-2"
              >
                <div className="flex items-center gap-2">
                  <ShieldAlert size={16} />
                  {error}
                </div>
              </motion.div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Username</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  required
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:border-[#00a3e0]/50 outline-none transition-all placeholder:text-slate-700"
                  placeholder="Enter username"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:border-[#00a3e0]/50 outline-none transition-all placeholder:text-slate-700"
                  placeholder="Enter password"
                />
              </div>
            </div>

            <button
              disabled={isLoading}
              className="w-full bg-[#00a3e0] hover:bg-[#00b7f0] disabled:bg-[#00a3e0]/50 text-white font-bold py-4 rounded-2xl shadow-xl shadow-[#00a3e0]/10 transition-all flex items-center justify-center gap-2 active:scale-95 mt-4"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
