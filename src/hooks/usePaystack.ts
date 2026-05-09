import { useEffect, useState, useCallback } from 'react';

declare global {
  interface Window {
    PaystackPop: any;
  }
}

interface PaystackConfig {
  key: string;
  email: string;
  amount: number;
  reference: string;
  currency?: string;
  onSuccess: (response: { reference: string; status: string; trans: string; transaction: string; message: string }) => void;
  onClose: () => void;
}

export const usePaystack = () => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    const scriptId = 'paystack-script';
    if (document.getElementById(scriptId)) {
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => setIsScriptLoaded(true);
    script.onerror = () => {
      console.error('Failed to load Paystack script');
    };
    document.body.appendChild(script);

    return () => {
      // Keep script loaded
    };
  }, []);

  const initializePayment = useCallback((config: PaystackConfig) => {
    if (!isScriptLoaded || !window.PaystackPop) {
      console.error('Paystack SDK not loaded');
      return;
    }

    const handler = window.PaystackPop.setup({
      ...config,
      callback: (response: any) => config.onSuccess(response),
      onClose: () => config.onClose(),
    });

    handler.openIframe();
  }, [isScriptLoaded]);

  return { initializePayment, isScriptLoaded };
};
