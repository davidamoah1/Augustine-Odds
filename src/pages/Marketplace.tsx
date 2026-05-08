import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TrendingUp, Filter, Search, ChevronDown, ArrowUpDown } from "lucide-react";
import PredictionCard from "../components/PredictionCard";
import PredictionCardSkeleton from "../components/PredictionCardSkeleton";
import { Prediction } from "../data/predictions";

interface MarketplaceProps {
  isLoading: boolean;
  predictions: Prediction[];
  onUnlock: (prediction: Prediction) => void;
}

type SortOption = "newest" | "price-asc" | "price-desc";

export default function Marketplace({ isLoading, predictions, onUnlock }: MarketplaceProps) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOption>("newest");
  const [isSortOpen, setIsSortOpen] = useState(false);

  const filteredPredictions = useMemo(() => {
    let result = predictions.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (activeFilter === "All") return matchesSearch;
      
      const oddsValue = parseFloat(p.expectedOdds || "0");
      const threshold = parseInt(activeFilter);
      
      return matchesSearch && oddsValue >= threshold;
    });

    // Sorting Logic
    return result.sort((a, b) => {
      if (sortOrder === "price-asc") {
        return a.price - b.price;
      } else if (sortOrder === "price-desc") {
        return b.price - a.price;
      } else {
        // Default: Newest first (assuming higher ID is newer)
        return b.id - a.id;
      }
    });
  }, [predictions, activeFilter, searchQuery, sortOrder]);

  const filters = useMemo(() => {
    const thresholdLevels = [2, 5, 10, 20, 50, 100];
    const available = [{ id: "All", label: "All", icon: TrendingUp }];
    
    thresholdLevels.forEach(t => {
      const hasMatch = predictions.some(p => parseFloat(p.expectedOdds || "0") >= t);
      if (hasMatch) {
         available.push({ id: `${t}+ ODDS`, label: `${t}+`, icon: Filter });
      }
    });
    
    return available;
  }, [predictions]);

  const sortOptions = [
    { id: "newest", label: "Newest First" },
    { id: "price-asc", label: "Price: Low to High" },
    { id: "price-desc", label: "Price: High to Low" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="scroll-mt-20 py-10"
    >
      <header className="mb-12">
        <div className="text-center mb-10">
          <h2 className="text-5xl font-display font-black text-white mb-2 uppercase tracking-tighter italic">ACCESS <span className="text-[#00a3e0] not-italic">VAULT</span></h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Precision-matched elite betting nodes</p>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white/[0.02] border border-white/5 p-4 rounded-[32px]">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-[#1a1c23] p-1.5 rounded-2xl">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`relative px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all z-10 flex items-center gap-2 ${
                    activeFilter === filter.id
                      ? "text-white"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {activeFilter === filter.id && (
                    <motion.div
                      layoutId="activeFilterBg"
                      className="absolute inset-0 bg-[#00a3e0] rounded-xl -z-10 shadow-lg shadow-[#00a3e0]/20"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <filter.icon size={14} className={activeFilter === filter.id ? "text-white" : "text-slate-600"} />
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Sorting Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-3 bg-[#1a1c23] px-5 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white border border-white/5 transition-all group"
              >
                <ArrowUpDown size={14} className="text-slate-600 group-hover:text-[#00a3e0]" />
                <span>Sort: {sortOptions.find(o => o.id === sortOrder)?.label}</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isSortOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isSortOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsSortOpen(false)} 
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute left-0 mt-2 w-56 bg-[#1a1c23] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                      {sortOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => {
                            setSortOrder(option.id as SortOption);
                            setIsSortOpen(false);
                          }}
                          className={`w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${
                            sortOrder === option.id 
                              ? "bg-[#00a3e0] text-white" 
                              : "text-slate-500 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <div className="relative group flex-1 max-w-sm">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-[#00a3e0] transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search specific match..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-black/40 border border-white/5 rounded-2xl py-3.5 pl-12 pr-6 text-sm text-white placeholder:text-slate-700 focus:border-[#00a3e0]/50 outline-none w-full transition-all group-hover:border-white/10"
            />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={`skeleton-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <PredictionCardSkeleton />
              </motion.div>
            ))
          ) : filteredPredictions.length > 0 ? (
            filteredPredictions.map((prediction, i) => (
              <motion.div 
                key={`pred-${prediction.id}-${i}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <PredictionCard
                  prediction={prediction}
                  onUnlock={() => onUnlock(prediction)}
                />
              </motion.div>
            ))
          ) : null}
        </AnimatePresence>
      </div>

      {!isLoading && filteredPredictions.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24 bg-white/[0.01] rounded-3xl border border-dashed border-white/5"
        >
          <div className="inline-flex bg-white/5 p-6 rounded-full mb-6">
            <TrendingUp size={48} className="text-slate-700" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-white capitalize">No matches found</h3>
          <p className="text-slate-500 max-w-xs mx-auto text-sm">
            Try adjusting your filters or search query to find elite predictions.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
