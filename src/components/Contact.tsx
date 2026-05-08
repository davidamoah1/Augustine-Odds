import { motion } from "motion/react";
import { Mail, Phone, MessageSquare, Send, MapPin, ExternalLink, CheckCircle2 } from "lucide-react";
import React, { useState } from "react";

export default function Contact() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const validateField = (name: string, value: string) => {
    let error = "";
    switch (name) {
      case "name":
        if (value.length > 0 && value.length < 3) error = "Name must be at least 3 characters";
        break;
      case "email":
        if (value.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Invalid email address";
        break;
      case "subject":
        if (value.length > 0 && value.length < 5) error = "Subject must be at least 5 characters";
        break;
      case "message":
        if (value.length > 0 && value.length < 10) error = "Message must be at least 10 characters";
        break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const isFormValid = () => {
    return (
      formState.name.length >= 3 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email) &&
      formState.subject.length >= 5 &&
      formState.message.length >= 10
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setIsSending(true);
    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      setSent(true);
      setFormState({ name: "", email: "", subject: "", message: "" });
      setErrors({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSent(false), 5000);
    }, 1500);
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden group">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00a3e0]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* Left Side: Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 text-[#00a3e0] font-black uppercase tracking-[0.3em] mb-6 text-xs">
                <MessageSquare size={16} />
                <span>Get In Touch</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8 tracking-tight leading-[1.1]">
                HAVE QUESTIONS? <br />
                <span className="text-[#00a3e0] italic">TALK TO US</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-12 max-w-md">
                Our support team is available 24/7 to help you with your purchases, 
                provide more information about our services, or resolve any issues.
              </p>

              <div className="space-y-8">
                <a 
                  href="mailto:augustineappiagyei1234@gmail.com"
                  className="flex items-center gap-6 group hover:bg-white/[0.03] p-4 -ml-4 rounded-3xl transition-all"
                >
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-[#00a3e0]/30 transition-colors">
                    <Mail className="text-[#00a3e0]" size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Email Us</p>
                    <p className="text-white font-bold group-hover:text-[#00a3e0] transition-colors">augustineappiagyei1234@gmail.com</p>
                  </div>
                </a>

                <a 
                  href="tel:0546715941"
                  className="flex items-center gap-6 group hover:bg-white/[0.03] p-4 -ml-4 rounded-3xl transition-all"
                >
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-[#00a3e0]/30 transition-colors">
                    <Phone className="text-[#00a3e0]" size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Call / WhatsApp</p>
                    <p className="text-white font-bold group-hover:text-[#00a3e0] transition-colors">0546715941</p>
                  </div>
                </a>

                <div className="flex items-center gap-6 p-4 -ml-4">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                    <MapPin className="text-[#00a3e0]" size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Our Base</p>
                    <p className="text-white font-bold">Accra, Ghana</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 flex gap-4">
                <a href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 hover:border-[#00a3e0]/30 transition-all">
                  <ExternalLink size={18} className="text-slate-400" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 hover:border-[#00a3e0]/30 transition-all">
                  <MessageSquare size={18} className="text-slate-400" />
                </a>
              </div>
            </motion.div>

            {/* Right Side: Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="glass-card p-8 md:p-10 rounded-[40px] border-white/5 shadow-2xl relative"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Your Name</label>
                      {errors.name && <span className="text-[8px] font-bold text-red-500 uppercase">{errors.name}</span>}
                    </div>
                    <input 
                      required
                      name="name"
                      type="text" 
                      placeholder="John Doe"
                      value={formState.name}
                      onChange={handleChange}
                      className={`w-full bg-white/[0.03] border rounded-2xl py-4 px-6 text-white placeholder:text-slate-700 focus:border-[#00a3e0]/50 outline-none transition-all ${
                        errors.name ? "border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.1)]" : "border-white/10"
                      }`}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Your Email</label>
                      {errors.email && <span className="text-[8px] font-bold text-red-500 uppercase">{errors.email}</span>}
                    </div>
                    <input 
                      required
                      name="email"
                      type="email" 
                      placeholder="john@example.com"
                      value={formState.email}
                      onChange={handleChange}
                      className={`w-full bg-white/[0.03] border rounded-2xl py-4 px-6 text-white placeholder:text-slate-700 focus:border-[#00a3e0]/50 outline-none transition-all ${
                        errors.email ? "border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.1)]" : "border-white/10"
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Subject</label>
                    {errors.subject && <span className="text-[8px] font-bold text-red-500 uppercase">{errors.subject}</span>}
                  </div>
                  <input 
                    required
                    name="subject"
                    type="text" 
                    placeholder="General Inquiry"
                    value={formState.subject}
                    onChange={handleChange}
                    className={`w-full bg-white/[0.03] border rounded-2xl py-4 px-6 text-white placeholder:text-slate-700 focus:border-[#00a3e0]/50 outline-none transition-all ${
                      errors.subject ? "border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.1)]" : "border-white/10"
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Your Message</label>
                    {errors.message && <span className="text-[8px] font-bold text-red-500 uppercase">{errors.message}</span>}
                  </div>
                  <textarea 
                    required
                    name="message"
                    rows={4}
                    placeholder="How can we help you?"
                    value={formState.message}
                    onChange={handleChange}
                    className={`w-full bg-white/[0.03] border rounded-2xl py-4 px-6 text-white placeholder:text-slate-700 focus:border-[#00a3e0]/50 outline-none transition-all resize-none ${
                      errors.message ? "border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.1)]" : "border-white/10"
                    }`}
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSending || sent || !isFormValid()}
                  className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
                    sent 
                      ? "bg-emerald-500 text-white" 
                      : !isFormValid()
                        ? "bg-white/5 text-slate-500 cursor-not-allowed border border-white/5"
                        : "bg-[#00a3e0] hover:bg-[#00b7f0] text-white shadow-xl shadow-[#00a3e0]/10 active:scale-[0.98]"
                  }`}
                >
                  {isSending ? (
                    "Sending Message..."
                  ) : sent ? (
                    <>
                      <CheckCircle2 size={20} />
                      Message Sent!
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
