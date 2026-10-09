import React, { StrictMode, Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class GlobalErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled Application Error caught by GlobalErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    try {
      localStorage.removeItem('alviero_expanded_service');
    } catch {}
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#3A3A3A] flex flex-col items-center justify-center p-4 selection:bg-[#A9BCA7] selection:text-white">
          <div className="w-full max-w-md bg-white border border-[#E8DDD6] rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] text-center space-y-5 animate-in fade-in duration-300">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#F2E9E4] border border-[#E8DDD6] text-[#5C725A] flex items-center justify-center text-2xl shadow-2xs">
              ✨
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#6E856C]">
                Alviero Studio
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-black text-[#2A2A2A]">
                Terjadi Kendala Tampilan
              </h2>
              <p className="text-xs font-century text-stone-500 leading-relaxed">
                Halaman mengalami kesalahan teknis saat memproses interaksi. Seluruh data tetap aman.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-[#FAF8F5] border border-[#E8DDD6] rounded-xl p-3 text-left">
                <p className="text-[10px] font-mono text-rose-700 font-bold break-all">
                  {this.state.error.message || String(this.state.error)}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 px-4 py-2.5 rounded-full bg-[#2A2A2A] text-white hover:bg-black font-century font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-95"
              >
                Muat Ulang
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 px-4 py-2.5 rounded-full bg-[#F2E9E4] text-[#3A3A3A] hover:bg-[#E8DDD6] border border-[#E8DDD6] font-century font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-95"
              >
                Kembali ke Awal
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalErrorBoundary>
      <App />
    </GlobalErrorBoundary>
  </StrictMode>,
);
