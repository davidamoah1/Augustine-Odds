import { useEffect, useState, useCallback } from 'react';

interface PaystackConfig {
  key: string;
  email: string;
  amount: number;
  reference: string;
  currency?: string;
  onSuccess: (response: any) => void;
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
    document.body.appendChild(script);

    return () => {
      // Keep script loaded for other sessions but we can clean up if needed
    };
  }, []);

  const initializePayment = useCallback((config: PaystackConfig) => {
    if (!isScriptLoaded || !(window as any).PaystackPop) {
      console.error('Paystack SDK not loaded');
      return;
    }

    const handler = (window as any).PaystackPop.setup({
      ...config,
      callback: (response: any) => config.onSuccess(response),
      onClose: () => config.onClose(),
    });

    handler.openIframe();
  }, [isScriptLoaded]);

  return { initializePayment, isScriptLoaded };
};
