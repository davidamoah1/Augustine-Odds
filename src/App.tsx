import { useState, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, Users, Trophy, Target, ShieldCheck } from "lucide-react";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import PurchaseModal from "./components/PurchaseModal";

// Hooks
import { usePredictions } from "./hooks/usePredictions";

// Lazy Pages
const Home = lazy(() => import("./pages/Home"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const AdminPanel = lazy(() => import("./components/AdminPanel"));

function LoadingFallback() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-[#00a3e0] mb-4" size={40} />
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Syncing Elite Data</p>
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const { predictions, isLoading, unlockPrediction, refresh } = usePredictions();
  const [selectedPrediction, setSelectedPrediction] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);

  const stats = [
    { label: "Active Members", value: "8.2k+", icon: Users, trend: "+12%" },
    { label: "Win Rate", value: "92%", icon: Trophy, trend: "Elite" },
    { label: "Daily Volume", value: "240+", icon: Target, trend: "GHS" },
    { label: "Trust Index", value: "9.8", icon: ShieldCheck, trend: "/10" },
  ];

  const recentWins = [
    { title: "Special Elite", odds: "15.40", date: "Yesterday" },
    { title: "Weekend Mega", odds: "42.00", date: "2 days ago" },
    { title: "Sika Lite", odds: "3.20", date: "3 days ago" },
    { title: "Sure 2 Odds", odds: "2.10", date: "3 days ago" },
    { title: "Golden Ticket", odds: "115.0", date: "4 days ago" },
  ];

  if (isAdminView) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <AdminPanel 
          predictions={predictions} 
          onClose={() => setIsAdminView(false)}
          onRefresh={refresh}
        />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-[#010409] text-slate-300 font-sans selection:bg-[#00a3e0] selection:text-white relative">
      <ScrollToTop />
      <div className="noise-bg absolute inset-0 z-0 pointer-events-none" />
      
      <Navbar onAdminClick={() => setIsAdminView(true)} />
      
      <main className="container mx-auto px-4 relative z-10 pt-20">
        <Suspense fallback={<LoadingFallback />}>
          <AnimatePresence mode="wait">
            <motion.div 
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="pb-20"
            >
              <Routes location={location}>
                <Route path="/" element={
                  <Home 
                    stats={stats} 
                    recentWins={recentWins} 
                    predictions={predictions}
                    isLoading={isLoading}
                    onUnlock={(p) => {
                      setSelectedPrediction(p);
                      setIsModalOpen(true);
                    }}
                  />
                } />
                <Route path="/marketplace" element={
                  <Marketplace 
                    isLoading={isLoading} 
                    predictions={predictions} 
                    onUnlock={(p) => {
                      setSelectedPrediction(p);
                      setIsModalOpen(true);
                    }} 
                  />
                } />
                <Route path="/contact" element={<ContactPage />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </main>

      <Footer />

      {selectedPrediction && (
        <PurchaseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          prediction={selectedPrediction}
          onConfirm={unlockPrediction}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}



