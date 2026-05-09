import { motion, AnimatePresence } from "motion/react";
import { X, ShieldCheck, Phone, User, Loader2, MessageCircle } from "lucide-react";
import React, { useState } from "react";
import { Prediction } from "../data/predictions";
import { predictionsService } from "../lib/supabase";
import { usePaystack } from "../hooks/usePaystack";
import { cn } from "../lib/utils";

interface PurchaseModalProps {
  prediction: Prediction | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: number, betCode: string) => void;
}

export default function PurchaseModal({ prediction, isOpen, onClose, onConfirm }: PurchaseModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const { initializePayment, isScriptLoaded } = usePaystack();

  if (!prediction) return null;

  const handlePaymentSuccess = async (response: any) => {
    setIsVerifying(true);
    try {
      const result = await predictionsService.verifyPayment(prediction.id, response.reference);
      
      onConfirm(prediction.id, result.betCode);
      onClose();
      // Reset form
      setFormData({ name: "", phone: "" });
    } catch (err: any) {
      console.error("Verification error:", err);
      alert(err.message || "Unable to verify payment. Please contact support.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
    if (!publicKey || publicKey === "your_paystack_public_key") {
      alert("System Error: Payment gateway not configured. Please contact administrator.");
      return;
    }

    if (!isScriptLoaded) {
      alert("Payment system is still loading. Please wait a moment.");
      return;
    }

    // Paystack requires an email. We generate a dummy one from the phone number
    // to keep the UI simple as requested.
    const cleanPhone = formData.phone.replace(/\D/g, '');
    const dummyEmail = `${cleanPhone || 'customer'}@augustineodds.com`;

    initializePayment({
      key: publicKey,
      email: dummyEmail,
      amount: Math.floor(prediction.price * 100),
      currency: "GHS",
      reference: `ME_${prediction.id}_${Date.now()}`,
      metadata: {
        custom_fields: [
          {
            display_name: "Customer Name",
            variable_name: "customer_name",
            value: formData.name
          },
          {
            display_name: "Phone Number",
            variable_name: "phone_number",
            value: formData.phone
          }
        ]
      },
      onSuccess: handlePaymentSuccess,
      onClose: () => console.log("Payment window closed"),
    } as any);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-[#0d1017] border border-white/5 rounded-[32px] sm:rounded-[40px] overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 sm:p-8 pb-0 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-[#00a3e0]/10 rounded-xl">
                    <ShieldCheck size={20} className="text-[#00a3e0]" />
                  </div>
                  <span className="text-[10px] font-black text-[#00a3e0] uppercase tracking-[0.3em]">Direct Unlock</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Checkout</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2.5 sm:p-3 bg-white/5 hover:bg-white/10 rounded-xl sm:rounded-2xl transition-all"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              {/* Prediction Summary */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl sm:rounded-3xl p-5 sm:p-6 mb-6 sm:mb-8 flex justify-between items-center group">
                <div className="space-y-1">
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Selected Odds</p>
                  <h3 className="font-bold text-white text-lg sm:text-xl truncate max-w-[150px] sm:max-w-[200px] group-hover:text-[#00a3e0] transition-colors">
                    {prediction.title}
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Pay Only</p>
                  <div className="text-xl sm:text-2xl font-black text-white">
                    <span className="text-[#00a3e0] text-sm mr-1">₵</span>
                    {prediction.price}
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <InputGroup 
                  label="Full Name" 
                  icon={User} 
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(v) => setFormData({...formData, name: v})}
                />

                <InputGroup 
                  label="WhatsApp / Phone Number" 
                  icon={Phone} 
                  type="tel"
                  placeholder="e.g. 054 000 0000"
                  value={formData.phone}
                  onChange={(v) => setFormData({...formData, phone: v})}
                />

                <div className="pt-2 sm:pt-4 space-y-4">
                  <button
                    disabled={isVerifying || !isScriptLoaded}
                    className={cn(
                      "w-full py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3",
                      isVerifying 
                        ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                        : "bg-[#00a3e0] text-white hover:bg-[#00b7f0] shadow-xl shadow-[#00a3e0]/10 active:scale-[0.98]"
                    )}
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        <span>Verifying Access...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={20} />
                        <span>Unlock Now</span>
                      </>
                    )}
                  </button>
                  
                  <div className="flex items-center gap-4 py-1 sm:py-2">
                    <div className="h-px flex-1 bg-white/5" />
                    <span className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">Support Access</span>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>

                  <a 
                    href="https://wa.me/233546715941"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-[#25D366]/5 text-[#25D366] font-bold text-[9px] sm:text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#25D366]/10 transition-all border border-[#25D366]/10"
                  >
                    <MessageCircle size={16} />
                    WhatsApp Support
                  </a>
                </div>
              </form>
            </div>
            
            <div className="bg-white/[0.01] border-t border-white/5 p-5 sm:p-6 text-center">
              <p className="text-[8px] sm:text-[9px] text-slate-700 font-bold uppercase tracking-widest leading-relaxed">
                Secured by Paystack &bull; Instant Code Delivery
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>

  );
}

function InputGroup({ label, icon: Icon, value, onChange, placeholder, type = "text" }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-[#00a3e0] transition-colors">
          <Icon size={16} strokeWidth={2.5} />
        </div>
        <input
          required
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4.5 pl-14 pr-6 text-white placeholder:text-slate-800 focus:border-[#00a3e0]/30 focus:bg-white/[0.05] outline-none transition-all text-sm font-medium"
        />
      </div>
    </div>
  );
}

