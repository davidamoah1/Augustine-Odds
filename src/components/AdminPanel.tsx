import React, { useState, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Save, Trash2, ArrowLeft, RefreshCw, LogOut, Globe, ShieldAlert, CheckCircle2, LayoutGrid, Database } from "lucide-react";
import { Prediction } from "../data/predictions";
import { predictionsService } from "../lib/supabase";
import AdminLogin from "./AdminLogin";

interface AdminPanelProps {
  predictions: Prediction[];
  onClose: () => void;
  onRefresh: () => void;
}

export default function AdminPanel({ predictions, onClose, onRefresh }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [newPrediction, setNewPrediction] = useState<Omit<Prediction, 'id'>>({
    title: "",
    price: 0,
    betCode: "",
    expectedOdds: ""
  } as any);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState<number | 'bulk' | 'all' | null>(null);

  useEffect(() => {
    if (successMessage || errorStatus) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setErrorStatus(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorStatus]);

  useEffect(() => {
    if (isAuthenticated) {
      checkConnection();
    }
  }, [isAuthenticated]);

  const checkConnection = async () => {
    setIsTestingConnection(true);
    setErrorStatus(null);
    const result = await predictionsService.testConnection();
    setConnectionStatus(result);
    setIsTestingConnection(false);
  };

  // If not authenticated, show login screen
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[200] bg-[#04070D] overflow-y-auto">
        <AdminLogin onLogin={() => setIsAuthenticated(true)} onClose={onClose} />
      </div>
    );
  }

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorStatus(null);
    try {
      await predictionsService.addPrediction(newPrediction);
      setSuccessMessage("Node successfully deployed.");
      setNewPrediction({
        title: "",
        price: 0,
        betCode: "",
        expectedOdds: ""
      } as any);
      onRefresh();
    } catch (error: any) {
      console.error("Failed to add prediction:", error);
      setErrorStatus(error.message || "Failed to save prediction. Check RLS or table schema.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    setSavingId(id);
    setErrorStatus(null);
    try {
      await predictionsService.deletePrediction(id);
      setSuccessMessage("Record purged successfully.");
      onRefresh();
    } catch (error: any) {
      console.error("Failed to delete prediction:", error);
      setErrorStatus(error.message || "Deletion failed. Ensure permissions are set.");
    } finally {
      setSavingId(null);
      setConfirmingDelete(null);
    }
  };

  const handleClearAll = async () => {
    setIsSubmitting(true);
    setErrorStatus(null);
    try {
      await predictionsService.deleteAllPredictions();
      setSuccessMessage("All records cleared.");
      onRefresh();
    } catch (error: any) {
      console.error("Failed to clear board:", error);
      setErrorStatus(error.message || "Failed to clear board.");
    } finally {
      setIsSubmitting(false);
      setConfirmingDelete(null);
    }
  };

  const handleUpdate = async (id: number, updates: Partial<Prediction>) => {
    setSavingId(id);
    setErrorStatus(null);
    try {
      await predictionsService.updatePrediction(id, updates);
      setSuccessMessage("Node updated.");
      onRefresh();
    } catch (error: any) {
      console.error("Failed to update:", error);
      setErrorStatus(error.message || "Update failed.");
    } finally {
      setSavingId(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    
    setIsSubmitting(true);
    setErrorStatus(null);
    try {
      await predictionsService.deleteMultiplePredictions(selectedIds);
      setSuccessMessage(`${selectedIds.length} records removed.`);
      setSelectedIds([]);
      onRefresh();
    } catch (error: any) {
      console.error("Bulk delete failed:", error);
      setErrorStatus(error.message || "Bulk deletion failed.");
    } finally {
      setIsSubmitting(false);
      setConfirmingDelete(null);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === predictions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(predictions.map(p => p.id));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const totals = {
    active: predictions.length,
    revenue: predictions.reduce((acc, curr) => acc + (typeof curr.price === 'number' ? curr.price : 0), 0)
  };

  return (
    <div className="min-h-screen bg-[#04070D] fixed inset-0 z-[200] overflow-y-auto p-4 sm:p-8 selection:bg-[#00a3e0] selection:text-white">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6 pb-8 border-b border-white/5">
          <div className="flex items-center gap-6 text-left">
            <button 
              onClick={onClose}
              className="w-14 h-14 bg-white/5 hover:bg-white/10 rounded-[22px] flex items-center justify-center transition-all text-slate-400 group border border-white/5 shadow-xl"
            >
              <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h1 className="text-4xl font-display font-black text-white uppercase tracking-tight">Staff Portal</h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] leading-none">Augustine Odds Analytics v4.2</p>
                <div className="h-1 w-1 rounded-full bg-slate-700" />
                <button 
                  onClick={checkConnection}
                  disabled={isTestingConnection}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                    isTestingConnection 
                      ? "bg-slate-800 text-slate-400" 
                      : connectionStatus?.success 
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                        : "bg-red-500/10 text-red-500 border border-red-500/20"
                  }`}
                >
                  <Globe size={10} className={isTestingConnection ? "animate-spin" : ""} />
                  {isTestingConnection ? "Syncing..." : connectionStatus?.message || "Check link"}
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {selectedIds.length > 0 && (
              <motion.button 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setConfirmingDelete('bulk')}
                className="px-6 py-4 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-red-500/20 active:scale-95 flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete ({selectedIds.length})
              </motion.button>
            )}
            <button 
              onClick={onRefresh}
              disabled={isSubmitting || isTestingConnection}
              className="p-4 bg-white/5 hover:bg-white/10 text-slate-400 rounded-2xl transition-all border border-white/5 hover:border-[#00a3e0]/30 flex items-center gap-2 font-black text-[10px] uppercase tracking-widest disabled:opacity-50"
              title="Sync Data"
            >
              <RefreshCw size={16} className={(isSubmitting || isTestingConnection) ? "animate-spin" : ""} />
            </button>
            <button 
              onClick={() => setConfirmingDelete('all')}
              className="px-6 py-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all shadow-xl shadow-red-500/10 active:scale-95"
            >
              Flush
            </button>
            <button 
              onClick={() => {
                setIsAuthenticated(false);
                localStorage.removeItem('augustine_admin_token');
              }}
              className="px-6 py-4 bg-white/5 text-slate-300 border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-white/10 hover:text-white transition-all active:scale-95"
            >
              <LogOut size={16} />
              Exit
            </button>
          </div>
        </header>

        <AnimatePresence>
          {successMessage && (
            <motion.div 
              key="success-toast"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-8 left-1/2 -translate-x-1/2 z-[300] bg-emerald-500 text-black px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3 border-4 border-black"
            >
              <CheckCircle2 size={14} />
              {successMessage}
            </motion.div>
          )}

          {confirmingDelete && (
            <motion.div 
              key="delete-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[350] bg-[#04070D]/90 backdrop-blur-xl flex items-center justify-center p-6"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="glass-card max-w-md w-full p-10 rounded-[48px] border-white/5 bg-gradient-to-b from-white/[0.05] to-transparent shadow-[0_64px_128px_-32px_rgba(0,0,0,1)] text-center"
              >
                <div className="w-20 h-20 bg-red-500/20 rounded-[32px] flex items-center justify-center mx-auto mb-8 border border-red-500/20">
                  <Trash2 size={32} className="text-red-500" />
                </div>
                <h3 className="text-3xl font-display font-black text-white uppercase tracking-tight mb-4">
                  {confirmingDelete === 'bulk' ? 'Bulk Removal' : confirmingDelete === 'all' ? 'System Flush' : 'Purge Entry'}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-10 font-medium">
                  {confirmingDelete === 'bulk' 
                    ? `Are you certain you want to remove all ${selectedIds.length} selected nodes? This protocol is irreversible.` 
                    : confirmingDelete === 'all' 
                      ? "CRITICAL ALERT: This will execute a full database wipe. All prediction nodes will be permanently destroyed."
                      : "Executing this command will permanently remove this prediction node from the global synchronized feed."}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setConfirmingDelete(null)}
                    className="py-5 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border border-white/5"
                  >
                    Abort
                  </button>
                  <button 
                    onClick={() => {
                      if (confirmingDelete === 'bulk') handleBulkDelete();
                      else if (confirmingDelete === 'all') handleClearAll();
                      else typeof confirmingDelete === 'number' && handleDelete(confirmingDelete);
                    }}
                    className="py-5 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-red-600/20 active:scale-95"
                  >
                    Confirm Execute
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Revenue Delta", value: `₵${totals.revenue}`, suffix: "GHS", icon: Globe, color: "text-emerald-500", bg: "bg-emerald-500/5" },
            { label: "Active Nodes", value: totals.active, suffix: "Tickets", icon: Plus, color: "text-[#00a3e0]", bg: "bg-[#00a3e0]/5" },
            { label: "Link Status", value: connectionStatus?.success ? "Active" : "Error", suffix: "Internal", icon: ShieldAlert, color: connectionStatus?.success ? "text-emerald-500" : "text-red-500", bg: connectionStatus?.success ? "bg-emerald-500/5" : "bg-red-500/5" }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card p-8 rounded-[32px] border-white/[0.03] ${stat.bg} shadow-2xl relative overflow-hidden group`}
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                <stat.icon size={64} className={stat.color} />
              </div>
              <div className="flex justify-between items-start mb-6 relative z-10">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{stat.label}</span>
                <stat.icon size={16} className={stat.color} />
              </div>
              <div className="flex items-baseline gap-2 relative z-10">
                <div className="text-4xl font-display font-black text-white">{stat.value}</div>
                <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{stat.suffix}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          <section className="lg:col-span-4">
            <div className="glass-card p-8 rounded-[40px] sticky top-8 border-white/[0.05] bg-gradient-to-br from-white/[0.03] to-transparent shadow-2xl overflow-hidden">
              <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-[#00a3e0]/5 rounded-full blur-3xl" />
              <h2 className="text-2xl font-display font-black mb-8 flex items-center gap-4 text-white uppercase tracking-tight relative z-10">
                <div className="w-12 h-12 bg-[#00a3e0]/10 rounded-2xl flex items-center justify-center border border-[#00a3e0]/10">
                  <Plus size={24} className="text-[#00a3e0]" />
                </div>
                Publish Tip
              </h2>
              
              {errorStatus && (
                <div className="mb-6 p-5 bg-red-500/10 border border-red-500/20 rounded-[24px] animate-shake relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldAlert size={14} className="text-red-500" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">
                      System Exception
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-bold">
                    {errorStatus}
                  </p>
                </div>
              )}

              <form onSubmit={handleAdd} className="space-y-6 relative z-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Event Reference</label>
                  <input
                    required
                    type="text"
                    value={newPrediction.title}
                    onChange={(e) => setNewPrediction({...newPrediction, title: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 px-6 text-white focus:border-[#00a3e0]/50 focus:bg-[#00a3e0]/5 outline-none transition-all placeholder:text-slate-800 font-bold uppercase tracking-tight text-sm shadow-inner"
                    placeholder="e.g. SATURDAY MASTER"
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Access Protocol (GHS)</label>
                  <div className="relative">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#00a3e0] font-black text-sm opacity-50">₵</div>
                    <input
                      required
                      type="number"
                      value={newPrediction.price === 0 ? "" : newPrediction.price}
                      onChange={(e) => {
                        const val = e.target.value;
                        const parsed = parseInt(val);
                        setNewPrediction({...newPrediction, price: isNaN(parsed) ? 0 : parsed});
                      }}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 pl-12 pr-6 text-white focus:border-[#00a3e0]/50 focus:bg-[#00a3e0]/5 outline-none transition-all font-display font-black text-2xl shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Expected Odds</label>
                  <input
                    type="text"
                    value={newPrediction.expectedOdds}
                    onChange={(e) => setNewPrediction({...newPrediction, expectedOdds: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 px-6 text-white focus:border-[#00a3e0]/50 focus:bg-[#00a3e0]/5 outline-none transition-all placeholder:text-slate-800 font-bold tracking-tight text-sm shadow-inner"
                    placeholder="e.g. 3.50 - 5.00"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Terminal Code</label>
                  <div className="relative">
                    <input
                      required
                      type="text"
                      value={newPrediction.betCode}
                      onChange={(e) => setNewPrediction({...newPrediction, betCode: e.target.value})}
                      className="w-full bg-black/40 border border-emerald-500/20 rounded-2xl py-5 px-6 text-[#00a3e0] focus:border-emerald-500/50 focus:bg-emerald-500/5 outline-none transition-all placeholder:text-slate-800 font-mono font-black tracking-[0.35em] text-xl uppercase shadow-inner"
                      placeholder="XXXXXX"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <ShieldAlert size={16} className="text-emerald-500/30" />
                    </div>
                  </div>
                </div>

                <button
                  disabled={isSubmitting}
                  className="w-full bg-[#00a3e0] hover:bg-white text-white hover:text-black font-black text-[10px] uppercase tracking-[0.25em] py-5.5 rounded-2xl transition-all flex items-center justify-center gap-3 mt-4 shadow-2xl shadow-[#00a3e0]/20 active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? <RefreshCw className="animate-spin" size={20} /> : (
                    <>
                      <Plus size={20} />
                      Deploy System node
                    </>
                  )}
                </button>
              </form>
            </div>
          </section>

          <section className="lg:col-span-8">
            {errorStatus && (
              <div className="mb-6 p-5 bg-red-500/10 border border-red-500/20 rounded-[24px] animate-shake">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldAlert size={14} className="text-red-500" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">
                    Database Operation Failed
                  </p>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-bold">
                  {errorStatus}
                </p>
              </div>
            )}
            <div className="glass-card rounded-[40px] overflow-hidden border-white/[0.05] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] bg-white/[0.01]">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead className="bg-white/[0.03] text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
                    <tr>
                      <th className="px-8 py-8 w-12">
                        <div 
                          onClick={toggleSelectAll}
                          className={`w-6 h-6 rounded-lg border-2 transition-all cursor-pointer flex items-center justify-center ${
                            selectedIds.length === predictions.length && predictions.length > 0
                              ? "bg-[#00a3e0] border-[#00a3e0] text-white" 
                              : "border-white/10 hover:border-white/30"
                          }`}
                        >
                          {selectedIds.length === predictions.length && predictions.length > 0 && <CheckCircle2 size={14} />}
                        </div>
                      </th>
                      <th className="px-8 py-8">
                        <div className="flex items-center gap-2">
                          <Database size={14} className="text-slate-600" />
                          <span>Identity / Node</span>
                        </div>
                      </th>
                      <th className="px-8 py-8">Link Identifier</th>
                      <th className="px-8 py-8">Expected Odds</th>
                      <th className="px-8 py-8">Factor (GHS)</th>
                      <th className="px-8 py-8 text-right">Commands</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.05]">
                    {predictions.map((p, i) => (
                        <tr 
                          key={`row-${p.id || 'new'}-${i}`} 
                          onClick={(e) => {
                            // Don't select if clicking input, button, or checkbox itself
                            const target = e.target as HTMLElement;
                            if (target.tagName !== 'INPUT' && target.tagName !== 'BUTTON' && !target.closest('button')) {
                              toggleSelect(p.id);
                            }
                          }}
                          className={`group transition-all duration-300 cursor-pointer border-b border-white/[0.02] last:border-none ${
                            selectedIds.includes(p.id) ? "bg-[#00a3e0]/5" : "hover:bg-white/[0.02]"
                          }`}
                        >
                        <td className="px-8 py-8">
                          <div 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSelect(p.id);
                            }}
                            className={`w-6 h-6 rounded-lg border-2 transition-all cursor-pointer flex items-center justify-center ${
                              selectedIds.includes(p.id) 
                                ? "bg-[#00a3e0] border-[#00a3e0] text-white" 
                                : "border-white/10 group-hover:border-white/30"
                            }`}
                          >
                            {selectedIds.includes(p.id) && <CheckCircle2 size={14} />}
                          </div>
                        </td>
                        <td className="px-8 py-8">
                          <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-black/40 flex items-center justify-center font-black text-slate-500 text-[11px] border border-white/5 group-hover:border-[#00a3e0]/30 group-hover:bg-[#00a3e0]/10 group-hover:text-[#00a3e0] transition-all shadow-inner">
                              {String(i + 1).padStart(2, '0')}
                            </div>
                            <div className="flex-1">
                                <input
                                  type="text"
                                  defaultValue={p.title}
                                  onBlur={(e) => handleUpdate(p.id, { title: e.target.value })}
                                  className="bg-transparent border-none focus:outline-none font-black text-white uppercase tracking-tight text-base w-full hover:text-[#00a3e0] transition-colors focus:text-[#00a3e0]"
                                />
                                <div className="text-[9px] text-slate-600 font-black uppercase tracking-[0.25em] mt-1.5 flex items-center gap-2">
                                  <div className="h-1 w-3 rounded-full bg-emerald-500/30 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-emerald-500 animate-[marquee_2s_linear_infinite]" />
                                  </div>
                                  Synchronized
                                </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-8">
                          <div className="relative max-w-[160px]">
                            <input
                              type="text"
                              defaultValue={p.betCode}
                              onBlur={(e) => handleUpdate(p.id, { betCode: e.target.value })}
                              className="bg-black/40 border border-white/5 rounded-xl py-3 px-5 focus:outline-none focus:border-[#00a3e0]/50 transition-all font-mono text-emerald-500 font-black tracking-[0.25em] text-xs uppercase w-full shadow-inner"
                            />
                            <div className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                              <ShieldAlert size={8} className="text-emerald-500" />
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-8">
                          <input
                            type="text"
                            defaultValue={p.expectedOdds}
                            onBlur={(e) => handleUpdate(p.id, { expectedOdds: e.target.value })}
                            className="bg-black/40 border border-white/5 rounded-xl py-3 px-5 focus:outline-none focus:border-[#00a3e0]/50 transition-all text-slate-300 font-black text-xs w-full max-w-[140px] shadow-inner"
                            placeholder="3.50 - 5.00"
                          />
                        </td>
                        <td className="px-8 py-8">
                           <div className="flex items-center gap-2 group/price bg-black/20 p-2 rounded-xl border border-white/5 w-fit">
                              <span className="text-[10px] text-slate-700 font-black ml-2">₵</span>
                              <input
                                type="number"
                                defaultValue={p.price || 0}
                                onBlur={(e) => {
                                  const val = e.target.value;
                                  const parsed = parseInt(val);
                                  handleUpdate(p.id, { price: isNaN(parsed) ? 0 : parsed });
                                }}
                                className="bg-transparent border-none focus:outline-none w-20 text-white text-xl font-black font-display hover:text-[#00a3e0] focus:text-[#00a3e0] transition-colors pr-2"
                              />
                           </div>
                        </td>
                        <td className="px-8 py-8 text-right">
                          <div className="flex items-center justify-end gap-3 translate-x-2 group-hover:translate-x-0 transition-transform">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setConfirmingDelete(p.id);
                              }}
                              disabled={savingId === p.id}
                              className="w-12 h-12 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl transition-all flex items-center justify-center border border-red-500/10 shadow-xl disabled:opacity-50 active:scale-90"
                            >
                              {savingId === p.id ? <RefreshCw size={20} className="animate-spin" /> : <Trash2 size={20} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {predictions.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-10 py-40 text-center">
                          <div className="flex flex-col items-center gap-6">
                            <div className="w-24 h-24 rounded-[40px] bg-white/[0.02] border border-white/[0.05] flex items-center justify-center opacity-40 relative group-hover:scale-110 transition-transform">
                              <Database size={40} className="text-slate-700" />
                              <div className="absolute inset-0 rounded-[40px] border border-[#00a3e0]/0 group-hover:border-[#00a3e0]/20 transition-all" />
                            </div>
                            <div className="space-y-2">
                              <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-[10px]">
                                Waiting for System Node deployment
                              </p>
                              <p className="text-slate-800 text-[8px] font-black uppercase tracking-widest">Standing by for operator command...</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mt-12 flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Global Sync Enabled</span>
              </div>
              <p className="text-slate-700 text-[9px] font-black uppercase tracking-[0.4em]">
                Augustine Odds Analytics • Node v4.2.0 • Secure
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
