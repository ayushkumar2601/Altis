
import React from 'react';

interface NavbarProps {
  onConnect: () => void;
  isConnected: boolean;
  address: string | null;
  onNavigate?: (view: any) => void;
  currentView?: string;
}

const Navbar: React.FC<NavbarProps> = ({ onConnect, isConnected, address, onNavigate, currentView }) => {
  const navItems = isConnected 
    ? [
        { label: 'Dashboard', id: 'dashboard' },
        { label: 'Market', id: 'market' },
        { label: 'Portfolio', id: 'portfolio' },
        { label: 'Yield', id: 'yield' },
        { label: 'AI Advisor', id: 'ai-advisor' },
        { label: 'Education', id: 'education' }
      ]
    : [
        { label: 'Home', id: 'landing' },
        { label: 'Market', id: 'market' },
        { label: 'AI Advisor', id: 'ai-advisor' },
        { label: 'Education', id: 'education' }
      ];

  const displayAddress = address 
    ? `${address.slice(0, 4)}...${address.slice(-4)}`
    : 'Connect Wallet';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b" style={{ borderColor: 'var(--border-default)' }}>
      <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <button 
            onClick={() => onNavigate?.('landing')}
            className="text-2xl font-black tracking-tighter transition-colors"
            style={{ color: 'var(--text-primary)' }}
          >
            Altis<span style={{ color: 'var(--bg-accent-strong)' }}>.</span>
          </button>
          
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button 
                key={item.id} 
                onClick={() => onNavigate?.(item.id)}
                className={`text-sm font-bold uppercase tracking-widest transition-colors ${
                  currentView === item.id ? '' : 'hover:opacity-70'
                }`}
                style={{ 
                  color: currentView === item.id ? 'var(--bg-accent-strong)' : 'var(--text-muted)'
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isConnected && (
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-[8px] font-black uppercase tracking-widest" style={{ color: 'var(--bg-accent-strong)' }}>Devnet Mode</span>
              <span className="text-[10px] font-bold uppercase tracking-tight" style={{ color: 'var(--text-muted)' }}>Solana Network</span>
            </div>
          )}
          <button 
            onClick={onConnect}
            className={`px-8 py-3 rounded-full font-bold uppercase tracking-wider text-sm transition-all transform active:scale-95 ${
              isConnected 
              ? 'border' 
              : ''
            }`}
            style={isConnected 
              ? { 
                  backgroundColor: 'var(--bg-card)', 
                  color: 'var(--text-primary)', 
                  borderColor: 'var(--border-default)' 
                }
              : { 
                  backgroundColor: 'var(--bg-accent-strong)', 
                  color: 'var(--text-primary)' 
                }
            }
          >
            {isConnected ? displayAddress : 'Connect Wallet'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
