
import React from 'react';

const InfoStrip: React.FC = () => {
  const stats = [
    { label: 'Risk Level', value: 'Low Risk' },
    { label: 'Ownership', value: 'Fractional Access' },
    { label: 'Currency', value: 'Stablecoin Yield' },
    { label: 'Compliance', value: 'Transparent On-chain' },
  ];

  return (
    <section className="border-y py-12 px-6" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-default)' }}>
      <div className="max-w-[1400px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex flex-col gap-2 group cursor-default">
            <span className="font-bold uppercase tracking-widest text-xs" style={{ color: 'var(--bg-accent-strong)' }}>
              {stat.label}
            </span>
            <span className="text-2xl lg:text-3xl font-black uppercase tracking-tight transition-colors group-hover:opacity-70" style={{ color: 'var(--text-primary)' }}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default InfoStrip;
