import { createClient } from '@supabase/supabase-js';
import { Prediction } from '../data/predictions';

// Check if variables are provided and looks like a valid URL
const sanitizeUrl = (url: string) => {
  if (!url) return "";
  // Strip /rest/v1/ or trailing slashes if the user pasted the direct API endpoint
  return url.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
};

const rawUrl = (import.meta as any).env.VITE_SUPABASE_URL || "";
const supabaseUrl = sanitizeUrl(rawUrl);
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

const isValidUrl = (url: string) => {
  try {
    return url && (url.startsWith('http://') || url.startsWith('https://'));
  } catch {
    return false;
  }
};

export const supabase = (isValidUrl(supabaseUrl) && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!supabase) {
  console.warn('⚠️ Supabase credentials missing or invalid. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Settings.');
}

/**
 * Service layer for Predictions
 */
export const predictionsService = {
  async getPredictions() {
    try {
      // MANDATORY server-side fetching for security (masked codes)
      const response = await fetch('/api/predictions');
      if (response.ok) {
        return await response.json();
      }
      throw new Error('Failed to fetch predictions from server');
    } catch (e) {
      console.error('Data Fetch Error:', e);
      return []; // Return empty instead of leaking sensitive direct fallback
    }
  },

  async verifyPayment(predictionId: number, reference: string) {
    const response = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ predictionId, reference })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Verification failed');
    }
    
    return await response.json(); // returns { success, betCode }
  },

  async login(username: string, pass: string) {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password: pass })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }
    
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('augustine_admin_token', data.token);
    }
    return data;
  },

  async deletePrediction(id: number | string) {
    const token = localStorage.getItem('augustine_admin_token');
    const response = await fetch(`/api/admin/predictions/${id}`, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Deletion failed');
    }
  },

  async deleteMultiplePredictions(ids: (number | string)[]) {
    const token = localStorage.getItem('augustine_admin_token');
    const response = await fetch('/api/admin/predictions/bulk-delete', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ ids })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Bulk deletion failed');
    }
  },

  async deleteAllPredictions() {
    // For safety, let's just use the bulk-delete idea or a specific endpoint if needed
    // But let's just implement a simple one
    const { data } = await supabase!.from('predictions').select('id');
    const ids = data?.map(d => d.id) || [];
    if (ids.length > 0) {
      await this.deleteMultiplePredictions(ids);
    }
  },

  async addPrediction(prediction: Omit<Prediction, 'id'>) {
    const token = localStorage.getItem('augustine_admin_token');
    const response = await fetch('/api/admin/predictions', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ prediction })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Add failed');
    }
    
    const result = await response.json();
    return {
      id: result.id,
      title: result.title,
      price: result.price,
      expectedOdds: result.expected_odds,
      betCode: result.bet_code,
      unlocked: false
    };
  },

  async updatePrediction(id: number, updates: Partial<Prediction>) {
    const token = localStorage.getItem('augustine_admin_token');
    const response = await fetch(`/api/admin/predictions/${id}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ updates })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Update failed');
    }
  },

  async testConnection() {
    if (!supabase) return { success: false, message: 'Missing credentials' };
    
    try {
      // Small query to test connection
      const { error } = await supabase.from('predictions').select('id').limit(1);
      if (error) {
        if (error.code === 'PGRST116') return { success: true, message: 'Connected (Empty)' }; // Table exists but empty
        if (error.code === '42P01') return { success: false, message: 'Table "predictions" missing' };
        return { success: false, message: error.message };
      }
      return { success: true, message: 'Connected' };
    } catch (err) {
      return { success: false, message: err instanceof Error ? err.message : 'Unknown error' };
    }
  }
};
