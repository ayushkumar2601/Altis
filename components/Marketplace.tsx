import React, { useState } from 'react';
import { Bond } from '../App';

interface MarketplaceProps {
  bonds: Bond[];
  balance: number;
  solBalance: number;
  onBuy: (id: string, amount: number) => void;
  isMinting: boolean;
}

const Marketplace: React.FC<MarketplaceProps> = ({ bonds, balance, solBalance, onBuy, isMinting }) => {
  const [selectedBond, setSelectedBond] = useState<Bond | null>(null);
  const [buyAmountInr, setBuyAmountInr] = useState('');
  const SOL_TO_INR_RATE = 12500;

  const handleConfirm = () => {
    if (selectedBond && Number(buyAmountInr) > 0) {
      onBuy(selectedBond.id, Number(buyAmountInr));
      setSelectedBond(null);
      setBuyAmountInr('');
    }
  };

  const solRequired = Number(buyAmountInr) / SOL_TO_INR_RATE;
  const insufficientFunds = solRequired > solBalance;

  return (
    <div className="pt-32 pb-20 px-6 lg:px-12 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <header className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="text-5xl md:text-6xl font-black uppercase mb-3 tracking-tighter" style={{ color: 'var(--text-primary)' }}>
              Primary <span className="italic" style={{ color: 'var(--bg-accent-strong)' }}>Mint</span>
            </h1>
            <p className="font-bold uppercase tracking-widest text-sm flex items-center gap-3" style={{ color: 'var(--text-muted)' }}>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--state-success)' }}></span>
                <span style={{ color: 'var(--text-primary)' }}>Devnet Live</span>
              </span>
              <span style={{ color: 'var(--text-muted)' }}>•</span>
              <span>1 SOL ≈ ₹12,500</span>
            </p>
          </div>
          <div className="border rounded-2xl px-6 py-4" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-default)' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Your Balance</p>
            <p className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{solBalance.toFixed(4)} <span style={{ color: 'var(--bg-accent-strong)' }}>SOL</span></p>
          </div>
        </div>
      </header>

      {/* Bond Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bonds.map((bond) => (
          <div 
            key={bond.id} 
            className="border rounded-3xl p-8 transition-all group hover:shadow-lg"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-default)' }}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>{bond.name}</h3>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full" style={{ color: 'var(--text-muted)', backgroundColor: 'var(--bg-accent-soft)' }}>{bond.duration}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full" style={{ color: 'var(--text-muted)', backgroundColor: 'var(--bg-accent-soft)' }}>{bond.risk}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black" style={{ color: 'var(--bg-accent-strong)' }}>{bond.apy}%</p>
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Fixed APY</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-y" style={{ borderColor: 'var(--border-default)' }}>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Maturity</p>
                <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{new Date(bond.maturityDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Min. Investment</p>
                <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>₹{bond.pricePerUnit}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Available</p>
                <p className="text-sm font-bold" style={{ color: 'var(--state-success)' }}>{((bond.remainingSupply / bond.totalSupply) * 100).toFixed(0)}%</p>
              </div>
            </div>

            {/* Supply Bar */}
            <div className="mb-6">
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-accent-soft)' }}>
                <div 
                  className="h-full rounded-full transition-all"
                  style={{ 
                    width: `${((bond.totalSupply - bond.remainingSupply) / bond.totalSupply) * 100}%`,
                    background: 'linear-gradient(to right, var(--bg-accent-strong), var(--bg-accent-strong))'
                  }}
                ></div>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest mt-2" style={{ color: 'var(--text-muted)' }}>
                {((bond.totalSupply - bond.remainingSupply) / 1000000).toFixed(1)}M / {(bond.totalSupply / 1000000).toFixed(0)}M Minted
              </p>
            </div>

            <button 
              onClick={() => setSelectedBond(bond)}
              className="w-full py-4 rounded-full font-black uppercase tracking-widest text-sm transition-all active:scale-[0.98]"
              style={{ 
                backgroundColor: 'var(--bg-accent-strong)', 
                color: 'var(--text-primary)',
                boxShadow: '0 8px 16px rgba(var(--color-1-rgb), 0.2)'
              }}
            >
              Mint Bond NFT
            </button>
          </div>
        ))}
      </div>

      {/* Minting Overlay */}
      {isMinting && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center backdrop-blur-xl" style={{ backgroundColor: 'rgba(var(--color-3-rgb), 0.95)' }}>
          <div className="relative">
            <div className="w-24 h-24 border-4 rounded-full" style={{ borderColor: 'rgba(var(--color-1-rgb), 0.2)' }}></div>
            <div className="absolute inset-0 w-24 h-24 border-4 border-transparent rounded-full animate-spin" style={{ borderTopColor: 'var(--bg-accent-strong)' }}></div>
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter mt-8 mb-2" style={{ color: 'var(--text-primary)' }}>Minting Your Bond...</h2>
          <p className="font-bold uppercase tracking-widest text-sm" style={{ color: 'var(--text-muted)' }}>Confirm transaction in Phantom</p>
          <div className="flex items-center gap-2 mt-6">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--bg-accent-strong)' }}></div>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Awaiting signature</span>
          </div>
        </div>
      )}

      {/* Buy Modal */}
      {selectedBond && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl" style={{ backgroundColor: 'rgba(var(--color-3-rgb), 0.95)' }}>
          <div className="border rounded-3xl max-w-lg w-full relative overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-default)' }}>
            {/* Modal Header */}
            <div className="p-6 border-b" style={{ borderColor: 'var(--border-default)' }}>
              <button 
                onClick={() => setSelectedBond(null)} 
                className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center transition-all"
                style={{ backgroundColor: 'var(--bg-accent-soft)' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--text-primary)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--bg-accent-strong)' }}></div>
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Mint Bond NFT</span>
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight pr-12" style={{ color: 'var(--text-primary)' }}>{selectedBond.name}</h2>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* APY Highlight */}
              <div className="border rounded-2xl p-4 flex items-center justify-between" style={{ backgroundColor: 'var(--bg-accent-soft)', borderColor: 'rgba(var(--color-1-rgb), 0.3)' }}>
                <span className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--text-primary)' }}>Fixed APY</span>
                <span className="text-3xl font-black" style={{ color: 'var(--bg-accent-strong)' }}>{selectedBond.apy}%</span>
              </div>

              {/* Amount Input */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Investment Amount (₹)</label>
                  <span className="text-[10px] font-black uppercase" style={{ color: 'var(--text-muted)' }}>Min: ₹100</span>
                </div>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-black" style={{ color: 'var(--text-muted)' }}>₹</span>
                  <input 
                    type="number" 
                    value={buyAmountInr}
                    onChange={(e) => setBuyAmountInr(e.target.value)}
                    placeholder="100"
                    className="w-full border rounded-2xl pl-12 pr-6 py-5 text-3xl font-black focus:outline-none"
                    style={{ 
                      backgroundColor: 'var(--bg-page)', 
                      borderColor: 'var(--border-default)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="flex gap-2">
                {[100, 500, 1000, 5000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setBuyAmountInr(String(amt))}
                    className="flex-1 py-3 rounded-xl text-sm font-bold transition-all"
                    style={{ backgroundColor: 'var(--bg-accent-soft)', color: 'var(--text-primary)' }}
                  >
                    ₹{amt.toLocaleString()}
                  </button>
                ))}
              </div>

              {/* Summary */}
              <div className="rounded-2xl p-5 space-y-4 border" style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border-default)' }}>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>You Pay</span>
                  <span className={`text-xl font-black`} style={{ color: insufficientFunds ? 'var(--state-error)' : 'var(--text-primary)' }}>
                    {solRequired.toFixed(4)} SOL
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>You Receive</span>
                  <span className="text-xl font-black" style={{ color: 'var(--bg-accent-strong)' }}>
                    {(Number(buyAmountInr) / selectedBond.pricePerUnit).toFixed(2)} Units
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t" style={{ borderColor: 'var(--border-default)' }}>
                  <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Wallet Balance</span>
                  <span className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>{solBalance.toFixed(4)} SOL</span>
                </div>
              </div>

              {/* Confirm Button */}
              <button 
                onClick={handleConfirm}
                disabled={!buyAmountInr || insufficientFunds || Number(buyAmountInr) < 100}
                className="w-full py-5 rounded-full font-black uppercase tracking-widest text-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98]"
                style={{ 
                  backgroundColor: 'var(--bg-accent-strong)', 
                  color: 'var(--text-primary)',
                  boxShadow: '0 20px 40px rgba(var(--color-1-rgb), 0.2)'
                }}
              >
                {insufficientFunds ? 'Insufficient SOL Balance' : 'Confirm & Mint'}
              </button>

              <p className="text-center text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                Transaction will be processed on Solana Devnet
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
