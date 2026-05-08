import { Trophy, Menu, X, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface NavbarProps {
  onAdminClick: () => void;
}

export default function Navbar({ onAdminClick }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <nav className="glass-nav sticky top-0 z-50 px-4 py-4 sm:px-8 border-b border-white/5 bg-[#010409]/80 backdrop-blur-3xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="bg-[#00a3e0] w-11 h-11 rounded-2xl shadow-xl shadow-[#00a3e0]/10 flex items-center justify-center">
            <Trophy size={24} className="text-white" />
          </div>
          <span className="font-display font-black text-2xl tracking-tighter text-white uppercase italic">
            AUGUSTINE <span className="text-[#00a3e0] not-italic">ODDS</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.25em]">
          {navLinks.map((link) => (
            <Link 
              key={link.label}
              to={link.href} 
              className="text-slate-500 hover:text-white transition-all flex items-center gap-1 group"
            >
              {link.label}
              <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 group-hover:text-[#00a3e0] -translate-y-1 group-hover:translate-y-0 transition-all text-slate-600" />
            </Link>
          ))}
          <div className="h-4 w-px bg-white/10 mx-2" />
          <button 
            onClick={onAdminClick}
            className="text-slate-700 hover:text-[#00a3e0] transition-colors"
          >
            Portal
          </button>
          <Link 
            to="/marketplace"
            className="premium-btn text-white px-8 py-3 rounded-2xl font-black transition-all shadow-2xl shadow-[#00a3e0]/10 active:scale-95 text-[10px]"
          >
            Access Vault
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white transition-colors"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#04070D] border-b border-white/5 p-8 md:hidden flex flex-col gap-6 animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <Link 
              key={link.label}
              to={link.href} 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-display font-bold text-white flex items-center justify-between"
            >
              {link.label}
              <ArrowUpRight size={24} className="text-[#00a3e0]" />
            </Link>
          ))}
          <div className="h-px w-full bg-white/5 my-2" />
          <button 
            onClick={() => {
              onAdminClick();
              setIsMobileMenuOpen(false);
            }}
            className="text-left text-slate-500 font-bold uppercase tracking-widest text-sm"
          >
            Staff Access
          </button>
          <Link 
            to="/marketplace"
            onClick={() => setIsMobileMenuOpen(false)}
            className="bg-[#00a3e0] text-white py-4 rounded-2xl text-center font-black uppercase tracking-widest"
          >
            View Active Tips
          </Link>
        </div>
      )}
    </nav>
  );
}
