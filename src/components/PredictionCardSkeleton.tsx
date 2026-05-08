import { motion } from "motion/react";

export default function PredictionCardSkeleton() {
  return (
    <div className="bg-[#0f1117] rounded-2xl overflow-hidden flex flex-col h-full border border-white/5">
      {/* Top Visual Area Skeleton */}
      <div className="aspect-[4/3] bg-[#2d303a] animate-pulse relative">
        <div className="absolute top-4 right-4 w-12 h-5 bg-white/5 rounded-md" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-white/5 rounded-full" />
        </div>
      </div>

      {/* Info Section Skeleton */}
      <div className="p-5 flex flex-col flex-1 bg-[#0f1117]">
        <div className="flex justify-between items-center mb-4">
          <div className="bg-white/5 w-32 h-6 rounded animate-pulse" />
          <div className="bg-white/5 w-16 h-6 rounded animate-pulse" />
        </div>
        
        <div className="bg-white/5 w-24 h-3 rounded animate-pulse mb-6" />

        <div className="w-full h-11 bg-white/5 rounded-xl animate-pulse mt-auto" />
      </div>
    </div>
  );
}
