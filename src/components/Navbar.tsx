import { Trophy, Menu, X, ArrowUpRight, Lock, LayoutGrid, Phone, Home } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

interface NavbarProps {
  onAdminClick: () => void;
}

export default function Navbar({ onAdminClick }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: "Home", href: "/", icon: <Home size={20} /> },
    { label: "Vault", href: "/marketplace", icon: <LayoutGrid size={20} /> },
    { label: "Contact", href: "/contact", icon: <Phone size={20} /> },
  ];

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <nav className="glass-nav sticky top-0 z-50 px-4 py-4 sm:px-8 border-b border-white/5 bg-[#010409]/80 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-[#00a3e0] w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl shadow-xl shadow-[#00a3e0]/10 flex items-center justify-center">
              <Trophy size={22} className="text-white" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-display font-black text-white tracking-tighter leading-none block">AUGUSTINE</span>
              <span className="text-[9px] font-black text-[#00a3e0] uppercase tracking-[0.3em] leading-none">Odds Active</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link 
                key={link.label}
                to={link.href} 
                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${
                  location.pathname === link.href ? "text-[#00a3e0]" : "text-slate-400 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link 
              to="/marketplace"
              className="bg-[#00a3e0] text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.22em] hover:bg-[#00b7f0] transition-all shadow-lg shadow-[#00a3e0]/20 active:scale-95"
            >
              Enter Vault
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-slate-300 hover:text-white transition-colors"
              aria-label="Open Menu"
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </nav>

      {/* Full-Screen Mobile Drawer */}
      <AnimatePresence mode="wait">
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] md:hidden"
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-[#010409]/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            
            {/* Drawer Content */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute top-0 right-0 bottom-0 w-[85%] max-w-sm bg-[#04070D] border-l border-white/5 shadow-2xl flex flex-col"
            >
              <div className="p-6 flex justify-between items-center border-b border-white/5">
                <div className="flex items-center gap-3">
                  <Trophy size={20} className="text-[#00a3e0]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Navigation</span>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 bg-white/5 rounded-xl text-slate-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-2">
                {navLinks.map((link) => (
                  <Link 
                    key={link.label}
                    to={link.href} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                      location.pathname === link.href ? "bg-[#00a3e0]/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-[12px] ${location.pathname === link.href ? "bg-[#00a3e0] text-white" : "bg-white/5"}`}>
                        {link.icon}
                      </div>
                      <span className="text-lg font-display font-black uppercase tracking-tight">{link.label}</span>
                    </div>
                    <ArrowUpRight size={16} className="opacity-30" />
                  </Link>
                ))}

                <div className="h-px bg-white/5 my-4" />

                <button 
                  onClick={() => {
                    onAdminClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl text-slate-400 hover:bg-white/5 hover:text-white transition-all group"
                >
                  <div className="p-2 bg-white/5 rounded-[12px] group-hover:bg-[#00a3e0]/20 group-hover:text-[#00a3e0] transition-colors">
                    <Lock size={18} />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">Staff Portal</span>
                </button>
              </div>

              <div className="p-6 border-t border-white/5 space-y-3">
                <Link 
                  to="/marketplace"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full bg-[#00a3e0] hover:bg-[#00b7f0] text-white py-3.5 rounded-xl text-center font-black uppercase tracking-widest text-[9px] shadow-lg shadow-[#00a3e0]/20 flex items-center justify-center gap-3"
                >
                  Enter Marketplace <Trophy size={14} />
                </Link>
                
                <div className="text-center pt-2">
                  <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-700">AUGUSTINE ODDS</p>
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#00a3e0]/40 mt-1 uppercase italic">Developed by D&D Brothers</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

