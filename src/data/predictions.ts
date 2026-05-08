export interface Prediction {
  id: number;
  title: string;
  price: number;
  betCode?: string;
  expectedOdds?: string;
  unlocked?: boolean; // Keep as optional for UI logic, but not for DB
}

export const predictions: Prediction[] = [];
