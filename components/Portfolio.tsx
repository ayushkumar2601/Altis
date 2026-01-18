
import React from 'react';
import { Holding } from '../App';

interface PortfolioProps {
  portfolio: Holding[];
  tick: number;
}

const Portfolio: React.FC<PortfolioProps> = ({ portfolio, tick }) => {
  const calculateLiveYield = (holding: Holding) => {
    const start = new Date(holding.purchaseDate).getTime();
    const now = Date.now();
    const yearsElapsed = (now - start) / (1000 * 60 * 60 * 24 * 365);
    return holding.investedAmount * (holding.apy / 100) * yearsElapsed;
  };

  return (
    <div className="pt-32 pb-20 px-6 lg:px-12 max-w-[1400px] mx-auto animate-in slide-in-from-bottom duration-700">
      <header className="mb-16">
        <h1 className="text-huge font-black uppercase mb-4 tracking-tighter" style={{ color: 'var(--text-primary)' }}>
          RWA <span className="italic" style={{ color: 'var(--bg-accent-strong)' }}>VAULT.</span>
        </h1>
        <p className="font-bold uppercase tracking-widest text-sm" style={{ color: 'var(--text-muted)' }}>
          Verified fractional bond ownership via <span style={{ color: 'var(--text-primary)' }}>Solana NFTs</span>.
        </p>
      </header>

      {portfolio.length === 0 ? (
        <div className="py-40 border border-dashed rounded-[4rem] text-center" style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--bg-card)' }}>
           <p className="font-black uppercase tracking-[0.5em] mb-6 italic" style={{ color: 'var(--text-muted)' }}>No Bond NFTs Found in Wallet</p>
           <button className="font-black uppercase tracking-widest border-b pb-1" style={{ color: 'var(--bg-accent-strong)', borderColor: 'var(--bg-accent-strong)' }}>Primary Market Mint</button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolio.map((h) => (
            <div key={h.id} className="border rounded-[3rem] p-10 flex flex-col justify-between group transition-all hover:shadow-lg" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-default)' }}>
              <div>
                <div className="flex justify-between items-start mb-8">
                  <span className="text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest" style={{ backgroundColor: 'var(--bg-accent-strong)', color: 'var(--text-primary)' }}>NFT VALID</span>
                  <a 
                    href={`https://explorer.solana.com/tx/${h.txHash}?cluster=devnet`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                  </a>
                </div>
                <h3 className="text-3xl font-black uppercase leading-none mb-2 tracking-tighter" style={{ color: 'var(--text-primary)' }}>{h.bondName}</h3>
                <div className="text-[10px] font-bold uppercase tracking-widest mb-8" style={{ color: 'var(--text-muted)' }}>Mint ID: {h.id}</div>
                
                <div className="space-y-4 border-t pt-8" style={{ borderColor: 'var(--border-default)' }}>
                  <div className="flex justify-between">
                    <span className="text-[10px] font-black uppercase" style={{ color: 'var(--text-muted)' }}>Invested</span>
                    <span className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>₹{h.investedAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] font-black uppercase" style={{ color: 'var(--bg-accent-strong)' }}>Live Return</span>
                    <span className="text-xl font-black" style={{ color: 'var(--bg-accent-strong)' }}>₹{calculateLiveYield(h).toFixed(4)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-12 space-y-2">
                 <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Maturity: {new Date(h.maturityDate).toLocaleDateString()}</div>
                 <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-accent-soft)' }}>
                    <div className="h-full w-1/4 animate-pulse" style={{ backgroundColor: 'var(--bg-accent-strong)' }}></div>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Portfolio;
