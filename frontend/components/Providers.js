'use client';

import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { AuthProvider } from '@/context/AuthContext';

export default function Providers({ children }) {
  useEffect(() => {
    const handler = (event) => toast.error(event.reason?.message || 'Something went wrong');
    window.addEventListener('unhandledrejection', handler);
    return () => window.removeEventListener('unhandledrejection', handler);
  }, []);

  return (
    <AuthProvider>
      {children}
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}
