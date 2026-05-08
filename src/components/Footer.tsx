import { motion } from "motion/react";
import { Trophy, Mail, Phone, MessageSquare, Twitter, Send, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

interface FooterProps {
}

export default function Footer({ }: FooterProps) {
  const navigation = [
    { label: "Home", href: "/" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <footer className="mt-32 border-t border-white/5 bg-black/60 backdrop-blur-xl relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00a3e0]/20 to-transparent" />
      
      <div className="container mx-auto px-4 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#00a3e0] rounded-xl flex items-center justify-center font-black text-white">
                <Trophy size={22} />
              </div>
              <span className="font-display font-black text-2xl tracking-tighter text-white uppercase italic">
                AUGUSTINE <span className="text-[#00a3e0] not-italic">ODDS</span>
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Premium football prediction marketplace delivering high-accuracy odds and expert insights since 2026. Data-driven, verified, and profit-focused.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 hover:border-[#00a3e0]/30 hover:text-[#00a3e0] transition-all text-slate-400">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 hover:border-[#00a3e0]/30 hover:text-[#00a3e0] transition-all text-slate-400">
                <Send size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 hover:border-[#00a3e0]/30 hover:text-[#00a3e0] transition-all text-slate-400">
                <MessageSquare size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-black text-[10px] uppercase tracking-[0.2em] mb-8">Navigation</h4>
            <ul className="space-y-4">
              {navigation.map((item) => (
                <li key={item.label}>
                  <Link 
                    to={item.href} 
                    className="text-slate-500 hover:text-[#00a3e0] transition-colors text-sm font-medium flex items-center gap-2 group"
                  >
                    <div className="w-1 h-1 bg-slate-800 rounded-full group-hover:bg-[#00a3e0] transition-colors" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust/Legal */}
          <div>
            <h4 className="text-white font-black text-[10px] uppercase tracking-[0.2em] mb-8">Resources</h4>
            <ul className="space-y-4">
              {[
                "Privacy Policy", 
                "Terms of Service", 
                "Responsible Gaming", 
                "Verified History",
                "Affiliate Program"
              ].map((item) => (
                <li key={item}>
                  <a href="#" className="text-slate-500 hover:text-[#00a3e0] transition-colors text-sm font-medium">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-black text-[10px] uppercase tracking-[0.2em] mb-8">Connect With Us</h4>
            <div className="space-y-6">
              <a href="mailto:augustineappiagyei1234@gmail.com" className="block group">
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Email Inquiry</p>
                <div className="flex items-center gap-2 text-slate-300 group-hover:text-[#00a3e0] transition-colors text-sm">
                  <Mail size={14} className="text-[#00a3e0]/50" />
                  augustineappiagyei1234@gmail.com
                </div>
              </a>
              <a href="tel:0546715941" className="block group">
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Direct Line</p>
                <div className="flex items-center gap-2 text-slate-300 group-hover:text-[#00a3e0] transition-colors text-sm">
                  <Phone size={14} className="text-[#00a3e0]/50" />
                  0546715941
                </div>
              </a>
              <div className="pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-emerald-500 font-bold text-[10px] uppercase tracking-widest">
                  <ShieldCheck size={14} />
                  Verified Business
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
          <p>© 2026 Augustine Odds. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <p className="opacity-30">Designed for Champions</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
