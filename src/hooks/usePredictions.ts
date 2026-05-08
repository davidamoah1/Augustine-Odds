import { useState, useEffect, useCallback } from 'react';
import { Prediction } from '../data/predictions';
import { predictionsService } from '../lib/supabase';

export const usePredictions = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [unlockedData, setUnlockedData] = useState<Record<number, string>>(() => {
    const saved = localStorage.getItem('aug_odds_v2'); // New key to reset stale data
    return saved ? JSON.parse(saved) : {};
  });

  const loadPredictions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await predictionsService.getPredictions();
      if (data) {
        // Cleanup unlockedData if IDs no longer exist in the fresh data (optional but good)
        // For now, just map correctly
        const enriched = data.map((p: any) => ({
          ...p,
          unlocked: !!unlockedData[p.id],
          betCode: unlockedData[p.id] || ""
        }));
        setPredictions(enriched);
      }
    } catch (err: any) {
      console.error("Error loading predictions:", err);
      setError(err.message || "Failed to load predictions");
    } finally {
      setIsLoading(false);
    }
  }, [unlockedData]);

  const unlockPrediction = useCallback((id: number, betCode: string) => {
    setUnlockedData(prev => {
      const next = { ...prev, [id]: betCode };
      localStorage.setItem('aug_odds_v2', JSON.stringify(next));
      return next;
    });
    
    setPredictions(prev =>
      prev.map(p => p.id === id ? { ...p, unlocked: true, betCode } : p)
    );
  }, []);

  useEffect(() => {
    loadPredictions();
  }, [loadPredictions]);

  return { 
    predictions, 
    isLoading, 
    error, 
    refresh: loadPredictions, 
    unlockPrediction 
  };
};
