
import React, { useMemo } from 'react';
import { Holding } from '../App';

interface DashboardProps {
  address: string;
  portfolio: Holding[];
  solBalance: number;
}

const Dashboard: React.FC<DashboardProps> = ({ address, portfolio, solBalance }) => {
  const SOL_TO_INR = 12500;
  
  const stats = useMemo(() => {
    const totalInvested = portfolio.reduce((sum, h) => sum + h.investedAmount, 0);
    const avgApy = portfolio.length > 0 ? portfolio.reduce((sum, h) => sum + h.apy, 0) / portfolio.length : 0;
    return { totalInvested, avgApy };
  }, [portfolio]);

  return (
    <div className="pt-32 pb-20 px-6 lg:px-12 max-w-[1400px] mx-auto animate-in fade-in duration-700">
      <header className="mb-16">
        <h1 className="text-huge font-black uppercase mb-4 tracking-tighter" style={{ color: 'var(--text-primary)' }}>
          COLLECTIVE <span className="italic" style={{ color: 'var(--bg-accent-strong)' }}>YIELD.</span>
        </h1>
        <p className="font-bold uppercase tracking-widest text-sm flex items-center gap-3" style={{ color: 'var(--text-muted)' }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--state-success)' }}></span>
          SOLANA DEVNET: <span className="truncate max-w-[200px]" style={{ color: 'var(--text-primary)' }}>{address}</span>
        </p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border-y mb-20 py-12" style={{ borderColor: 'var(--border-default)' }}>
        <div className="flex flex-col gap-2 border-r pr-8" style={{ borderColor: 'var(--border-default)' }}>
          <span className="font-black uppercase tracking-widest text-[10px]" style={{ color: 'var(--bg-accent-strong)' }}>Total Invested</span>
          <span className="text-4xl lg:text-6xl font-black tracking-tighter" style={{ color: 'var(--text-primary)' }}>₹{stats.totalInvested.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex flex-col gap-2 border-r px-8" style={{ borderColor: 'var(--border-default)' }}>
          <span className="font-black uppercase tracking-widest text-[10px]" style={{ color: 'var(--text-muted)' }}>SOL Balance</span>
          <span className="text-4xl lg:text-6xl font-black tracking-tighter" style={{ color: 'var(--text-primary)' }}>{solBalance.toFixed(3)}</span>
        </div>
        <div className="flex flex-col gap-2 border-r px-8" style={{ borderColor: 'var(--border-default)' }}>
          <span className="font-black uppercase tracking-widest text-[10px]" style={{ color: 'var(--text-muted)' }}>Avg APY</span>
          <span className="text-4xl lg:text-6xl font-black tracking-tighter" style={{ color: 'var(--text-primary)' }}>{stats.avgApy.toFixed(2)}%</span>
        </div>
        <div className="flex flex-col gap-2 pl-8">
          <span className="font-black uppercase tracking-widest text-[10px]" style={{ color: 'var(--text-muted)' }}>Bond NFTs</span>
          <span className="text-4xl lg:text-6xl font-black tracking-tighter" style={{ color: 'var(--text-primary)' }}>{portfolio.length}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-12">
          <section className="p-12 rounded-[3rem] border relative overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-default)' }}>
            <h2 className="text-2xl font-black uppercase tracking-tight mb-8" style={{ color: 'var(--text-primary)' }}>Asset Liquidity</h2>
            <div className="flex items-end gap-1 h-40">
              {Array.from({ length: 20 }).map((_, i) => (
                <div 
                  key={i} 
                  className="flex-1 transition-all duration-300" 
                  style={{ 
                    height: `${20 + Math.random() * 80}%`,
                    backgroundColor: 'var(--bg-accent-soft)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-accent-strong)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-accent-soft)'}
                ></div>
              ))}
            </div>
            <div className="mt-8 text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: 'var(--text-muted)' }}>Real-time Devnet Pressure</div>
          </section>
        </div>

        <aside className="space-y-8">
          <div className="p-10 rounded-[2.5rem] flex flex-col justify-between h-full min-h-[300px]" style={{ backgroundColor: 'var(--bg-accent-soft)', color: 'var(--text-primary)' }}>
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest mb-6 opacity-40">Wallet Liquidity (INR)</h3>
              <div className="text-5xl font-black tracking-tighter">₹{(solBalance * SOL_TO_INR).toLocaleString('en-IN')}</div>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed mt-4">
              Funds reside in your Phantom wallet. Every purchase mints a tradeable RWA NFT.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
