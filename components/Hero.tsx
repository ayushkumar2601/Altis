
import React from 'react';
import BondCard from './BondCard';

interface HeroProps {
  onConnect: () => void;
  isConnected: boolean;
}

const Hero: React.FC<HeroProps> = ({ onConnect, isConnected }) => {
  return (
    <section className="relative pt-32 pb-20 px-6 lg:px-12 max-w-[1400px] mx-auto min-h-[90vh] flex flex-col justify-center">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        
        {/* Left Side: Copy */}
        <div className="flex-1 text-left z-10 animate-slide-up">
          <h1 className="text-huge font-black uppercase mb-8">
            <span className="accent-glow" style={{ color: 'var(--bg-accent-strong)' }}>ELEVATE YOUR</span> <br />
            <span className="italic" style={{ color: 'var(--text-primary)' }}>PORTFOLIO.</span> <br />
            <span style={{ color: 'var(--state-success)' }}>FROM JUST </span> 
            <span style={{ color: 'var(--state-warning)', textShadow: '0 0 8px rgba(var(--color-10-rgb), 0.6), 0 0 16px rgba(var(--color-10-rgb), 0.4)' }}>₹100</span> 
            <span style={{ color: 'var(--bg-accent-strong)' }}>.</span>
          </h1>
          
          <p className="max-w-xl text-xl md:text-2xl font-medium leading-relaxed mb-10" style={{ color: 'var(--text-secondary)' }}>
            Invest in fractional government bonds using Solana. <br />
            Sovereign-backed security meets <span style={{ color: 'var(--text-primary)' }}>institutional-grade</span> blockchain infrastructure.
          </p>

          <div className="flex flex-wrap gap-4">
            <button 
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                onConnect();
              }}
              className="px-12 py-5 rounded-full font-black uppercase tracking-widest text-lg transition-all active:scale-95"
              style={{ 
                backgroundColor: 'var(--bg-accent-strong)', 
                color: 'var(--text-primary)',
                boxShadow: '0 20px 40px rgba(var(--color-1-rgb), 0.2)'
              }}
            >
              {isConnected ? 'Market Ready' : 'Connect Extension'}
            </button>
            <button 
              className="px-10 py-5 rounded-full font-black uppercase tracking-widest text-lg transition-all active:scale-95 border-2"
              style={{ 
                backgroundColor: 'transparent', 
                borderColor: 'var(--border-default)', 
                color: 'var(--text-primary)' 
              }}
            >
              Explore Bonds
            </button>
          </div>
        </div>

        {/* Right Side: Interactive Card */}
        <div className="flex-1 flex items-center justify-center -mt-28 lg:-mt-32 ml-5">
          <BondCard enableTilt={true} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
