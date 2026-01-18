
import React, { useMemo, useState, useEffect } from 'react';
import { Holding } from '../App';

interface YieldProps {
  portfolio: Holding[];
  balance: number;
  tick: number;
}

const YieldPage: React.FC<YieldProps> = ({ portfolio, balance, tick }) => {
  const [investmentAmount, setInvestmentAmount] = useState<number>(10000);
  const [selectedApy, setSelectedApy] = useState<number>(7.18);
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  // Calculate stats from actual portfolio
  const stats = useMemo(() => {
    const totalYield = portfolio.reduce((sum, h) => {
      const start = new Date(h.purchaseDate).getTime();
      const now = Date.now();
      const yearsElapsed = (now - start) / (1000 * 60 * 60 * 24 * 365);
      return sum + (h.investedAmount * (h.apy / 100) * yearsElapsed);
    }, 0);

    const projectedAnnual = portfolio.reduce((sum, h) => sum + (h.investedAmount * (h.apy / 100)), 0);
    const totalInvested = portfolio.reduce((sum, h) => sum + h.investedAmount, 0);
    const avgApy = portfolio.length > 0 ? portfolio.reduce((sum, h) => sum + h.apy, 0) / portfolio.length : 7.18;

    return { totalYield, projectedAnnual, totalInvested, avgApy };
  }, [portfolio, tick]);

  // Calculate monthly projections for the graph
  const monthlyProjections = useMemo(() => {
    const monthlyRate = selectedApy / 100 / 12;
    const projections = [];
    
    for (let month = 1; month <= 12; month++) {
      // Compound interest formula: A = P(1 + r)^n - P
      const totalValue = investmentAmount * Math.pow(1 + monthlyRate, month);
      const yieldEarned = totalValue - investmentAmount;
      const cumulativeYield = yieldEarned;
      
      projections.push({
        month,
        principal: investmentAmount,
        yield: cumulativeYield,
        total: totalValue,
        monthlyYield: month === 1 ? yieldEarned : yieldEarned - (investmentAmount * Math.pow(1 + monthlyRate, month - 1) - investmentAmount)
      });
    }
    
    return projections;
  }, [investmentAmount, selectedApy]);

  // APY options based on available bonds
  const apyOptions = [
    { label: 'G-Sec 2030', apy: 7.18 },
    { label: 'Maharashtra SDL', apy: 7.45 },
    { label: 'NHAI Tax-Free', apy: 6.80 },
    { label: 'RBI Float', apy: 8.05 },
  ];

  // Quick investment amounts
  const quickAmounts = [1000, 5000, 10000, 25000, 50000, 100000];

  return (
    <div className="pt-32 pb-20 px-6 lg:px-12 max-w-[1400px] mx-auto animate-in fade-in duration-700">
      <header className="mb-16">
        <h1 className="text-huge font-black uppercase mb-4 tracking-tighter" style={{ color: 'var(--text-primary)' }}>
          ₹ YIELD <span className="italic" style={{ color: 'var(--bg-accent-strong)' }}>REPORT.</span>
        </h1>
        <p className="font-bold uppercase tracking-widest text-sm" style={{ color: 'var(--text-muted)' }}>
          Daily accrual metrics for your <span style={{ color: 'var(--text-primary)' }}>Altis Portfolio</span>.
        </p>
      </header>

      <div className="grid lg:grid-cols-3 gap-12 mb-20">
        {/* Main Chart Section */}
        <div className="lg:col-span-2 border p-8 lg:p-12 rounded-[3.5rem] relative overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-default)' }}>
          <div className="absolute top-0 right-0 p-10 font-black text-8xl pointer-events-none italic uppercase" style={{ color: 'rgba(var(--color-7-rgb), 0.05)' }}>INR</div>
          
          {/* Chart Header with Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <h2 className="text-2xl font-black uppercase tracking-tight" style={{ color: 'var(--text-primary)' }}>Return Projection</h2>
            
            {/* APY Selector */}
            <div className="flex flex-wrap gap-2">
              {apyOptions.map((option) => (
                <button
                  key={option.apy}
                  onClick={() => setSelectedApy(option.apy)}
                  className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
                  style={selectedApy === option.apy
                    ? { backgroundColor: '#C7F70A', color: 'var(--text-primary)' }
                    : { backgroundColor: 'var(--bg-accent-soft)', color: 'var(--text-muted)' }
                  }
                >
                  {option.apy}%
                </button>
              ))}
            </div>
          </div>

          {/* Investment Amount Input */}
          <div className="mb-8">
            <label className="text-[10px] font-black uppercase tracking-widest mb-3 block" style={{ color: 'var(--text-muted)' }}>
              Simulation Amount (₹)
            </label>
            <div className="flex flex-wrap gap-2 mb-4">
              {quickAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setInvestmentAmount(amount)}
                  className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
                  style={investmentAmount === amount
                    ? { backgroundColor: '#C7F70A', color: 'var(--text-primary)' }
                    : { backgroundColor: 'var(--bg-accent-soft)', color: 'var(--text-muted)' }
                  }
                >
                  ₹{amount.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-black" style={{ color: 'var(--text-muted)' }}>₹</span>
              <input
                type="number"
                value={investmentAmount || ''}
                onChange={(e) => setInvestmentAmount(Number(e.target.value) || 0)}
                onBlur={(e) => {
                  if (!e.target.value || Number(e.target.value) < 100) {
                    setInvestmentAmount(100);
                  }
                }}
                placeholder="Enter amount"
                className="w-full border rounded-xl pl-10 pr-4 py-4 text-xl font-black focus:outline-none"
                style={{ 
                  backgroundColor: 'var(--bg-page)', 
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
          </div>

          {/* Live Chart */}
          <div className="relative">
            {/* Calculate chart bounds - base starts at 95% of principal to show growth clearly */}
            {(() => {
              const baseValue = investmentAmount * 0.95; // Start Y-axis at 95% of principal
              const maxValue = monthlyProjections[11]?.total || investmentAmount;
              const range = maxValue - baseValue;
              const midValue = baseValue + range / 2;
              
              return (
                <>
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 bottom-12 w-24 flex flex-col justify-between text-[10px] font-bold text-zinc-500 pr-3 text-right">
                    <span>₹{maxValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                    <span>₹{midValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                    <span>₹{baseValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  </div>
                  
                  {/* Chart Area */}
                  <div className="ml-24">
                    <div className="flex items-end gap-3 h-[280px] border-b border-l border-white/10 relative bg-gray-50 rounded-lg p-4">
                      {/* Grid lines */}
                      <div className="absolute inset-4 flex flex-col justify-between pointer-events-none">
                        {[0, 1, 2].map((i) => (
                          <div key={i} className="border-t border-dashed border-white/5 w-full" />
                        ))}
                      </div>
                      
                      
                      
                      {/* Bars */}
                      {monthlyProjections.map((projection, i) => {
                        // Calculate bar height relative to the visible range (baseValue to maxValue)
                        const valueAboveBase = projection.total - baseValue;
                        const barHeight = Math.max(5, (valueAboveBase / range) * 100);
                        
                        return (
                          <div 
                            key={i} 
                            className="flex-1 flex flex-col justify-end group relative cursor-pointer h-full"
                            onMouseEnter={() => setHoveredMonth(i)}
                            onMouseLeave={() => setHoveredMonth(null)}
                          >
                            {/* Tooltip */}
                            {hoveredMonth === i && (
                              <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 border rounded-xl p-4 z-20 min-w-[200px] shadow-2xl animate-in fade-in zoom-in-95 duration-200" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-default)' }}>
                                <div className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: '#C7F70A' }}>
                                  Month {projection.month}
                                </div>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between gap-4">
                                    <span style={{ color: 'var(--text-muted)' }}>Principal:</span>
                                    <span className="font-bold" style={{ color: 'var(--text-primary)' }}>₹{projection.principal.toLocaleString('en-IN')}</span>
                                  </div>
                                  <div className="flex justify-between gap-4">
                                    <span style={{ color: 'var(--text-muted)' }}>Yield Earned:</span>
                                    <span className="font-bold" style={{ color: 'var(--state-success)' }}>+₹{projection.yield.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between gap-4 border-t pt-2 mt-2" style={{ borderColor: 'var(--border-default)' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Total Value:</span>
                                    <span className="font-black" style={{ color: '#000000ff' }}>₹{projection.total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                                  </div>
                                </div>
                                {/* Tooltip arrow */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent" style={{ borderTopColor: 'var(--bg-card)' }} />
                              </div>
                            )}
                            
                            {/* Bar Container */}
                            <div className="relative w-full h-full flex flex-col justify-end">
                              {/* Bar */}
                              <div 
                                className="w-full transition-all duration-500 ease-out rounded-t-lg relative"
                                style={{ 
                                  height: `${barHeight}%`,
                                  minHeight: '24px',
                                  background: hoveredMonth === i 
                                    ? '#B6E600'
                                    : 'linear-gradient(to top, #9BC700, #B6E600, #C7F70A)',
                                  boxShadow: hoveredMonth === i ? '0 10px 30px rgba(199, 247, 10, 0.3)' : 'none'
                                }} 
                              >
                                {/* Value label on top of bar */}
                                <div className={`absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-black whitespace-nowrap transition-opacity ${
                                  hoveredMonth === i ? 'opacity-100' : 'opacity-0'
                                }`} style={{ color: '#000000ff' }}>
                                  +₹{projection.yield.toFixed(0)}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* X-axis labels */}
                    <div className="flex gap-3 mt-3 px-4">
                      {monthlyProjections.map((_, i) => (
                        <div 
                          key={i} 
                          className="flex-1 text-center text-[10px] font-black uppercase transition-colors"
                          style={{ color: hoveredMonth === i ? '#C7F70A' : 'var(--text-muted)' }}
                        >
                          M{i + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>

          {/* Chart Summary */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="rounded-2xl p-4 border" style={{ backgroundColor: 'var(--bg-accent-soft)', borderColor: 'var(--border-default)' }}>
              <div className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>6-Month Yield</div>
              <div className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>₹{monthlyProjections[5]?.yield.toFixed(2)}</div>
            </div>
            <div className="rounded-2xl p-4 border" style={{ backgroundColor: 'var(--bg-accent-soft)', borderColor: 'var(--border-default)' }}>
              <div className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>12-Month Yield</div>
              <div className="text-xl font-black" style={{ color: '#000000ff' }}>₹{monthlyProjections[11]?.yield.toFixed(2)}</div>
            </div>
            <div className="rounded-2xl p-4 border" style={{ backgroundColor: 'var(--bg-accent-soft)', borderColor: 'var(--border-default)' }}>
              <div className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Effective APY</div>
              <div className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>{selectedApy}%</div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          <div className="p-12 rounded-[3rem] shadow-2xl" style={{ backgroundColor: '#C7F70A', color: 'var(--text-primary)', boxShadow: '0 25px 50px rgba(199, 247, 10, 0.15)' }}>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 opacity-70">Est. Yearly Income</h3>
            <div className="text-5xl font-black tracking-tighter mb-2">
              ₹{(investmentAmount * selectedApy / 100).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
            <div className="text-sm font-bold opacity-70">
              on ₹{investmentAmount.toLocaleString('en-IN')} @ {selectedApy}%
            </div>
            <p className="text-xs font-bold uppercase tracking-widest leading-relaxed mt-6 opacity-60">Derived from sovereign fixed-rate coupons</p>
          </div>
          
          <div className="border p-10 rounded-[3rem]" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-default)' }}>
            <h3 className="text-[10px] font-black uppercase tracking-widest mb-6" style={{ color: 'var(--text-muted)' }}>Live Payout Pool</h3>
            <div className="flex justify-between items-center mb-8">
              <span className="text-4xl font-black italic tracking-tighter" style={{ color: 'var(--text-primary)' }}>₹{stats.totalYield.toFixed(4)}</span>
              <span className="text-[10px] font-bold uppercase px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--bg-accent-soft)', color: 'var(--text-primary)' }}>ON-CHAIN</span>
            </div>
            <button className="w-full py-5 rounded-full font-black uppercase tracking-widest text-xs transition-all shadow-xl" style={{ backgroundColor: 'var(--text-primary)', color: 'var(--bg-card)' }}>Sweep to Wallet</button>
          </div>

          {/* Portfolio Stats */}
          {portfolio.length > 0 && (
            <div className="border p-8 rounded-[2rem]" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-default)' }}>
              <h3 className="text-[10px] font-black uppercase tracking-widest mb-6" style={{ color: 'var(--text-muted)' }}>Your Portfolio</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Total Invested</span>
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>₹{stats.totalInvested.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Avg APY</span>
                  <span className="font-bold" style={{ color: '#C7F70A' }}>{stats.avgApy.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Annual Yield</span>
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>₹{stats.projectedAnnual.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Breakdown Section */}
      <section className="p-16 rounded-[4rem] border mb-20" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-default)' }}>
        <h3 className="text-xl font-black uppercase mb-12 italic underline underline-offset-8" style={{ textDecorationColor: '#C7F70A', color: 'var(--text-primary)' }}>Breakdown</h3>
        <div className="grid md:grid-cols-4 gap-12">
          <div>
            <span className="font-black text-xs uppercase tracking-widest mb-3 block" style={{ color: '#C7F70A' }}>Daily Accrual</span>
            <div className="text-4xl font-black" style={{ color: 'var(--text-primary)' }}>₹{((investmentAmount * selectedApy / 100) / 365).toFixed(2)}</div>
            <div className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>per day</div>
          </div>
          <div>
            <span className="font-black text-xs uppercase tracking-widest mb-3 block" style={{ color: 'var(--text-muted)' }}>Weekly Accrual</span>
            <div className="text-4xl font-black" style={{ color: 'var(--text-primary)' }}>₹{((investmentAmount * selectedApy / 100) / 52).toFixed(2)}</div>
            <div className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>per week</div>
          </div>
          <div>
            <span className="font-black text-xs uppercase tracking-widest mb-3 block" style={{ color: 'var(--text-muted)' }}>Monthly Accrual</span>
            <div className="text-4xl font-black" style={{ color: 'var(--text-primary)' }}>₹{((investmentAmount * selectedApy / 100) / 12).toFixed(2)}</div>
            <div className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>per month</div>
          </div>
          <div>
            <span className="font-black text-xs uppercase tracking-widest mb-3 block" style={{ color: 'var(--text-muted)' }}>Yearly Total</span>
            <div className="text-4xl font-black" style={{ color: '#C7F70A' }}>₹{(investmentAmount * selectedApy / 100).toFixed(2)}</div>
            <div className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>per year</div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="border rounded-[3rem] p-12" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-default)' }}>
        <h3 className="text-xl font-black uppercase mb-8" style={{ color: 'var(--text-primary)' }}>Compare Bond Returns</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border-default)' }}>
                <th className="text-left py-4 text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Bond Type</th>
                <th className="text-right py-4 text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>APY</th>
                <th className="text-right py-4 text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Monthly</th>
                <th className="text-right py-4 text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>6 Months</th>
                <th className="text-right py-4 text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>1 Year</th>
              </tr>
            </thead>
            <tbody>
              {apyOptions.map((option, idx) => {
                const monthly = (investmentAmount * option.apy / 100) / 12;
                const sixMonth = monthly * 6;
                const yearly = investmentAmount * option.apy / 100;
                const isSelected = selectedApy === option.apy;
                return (
                  <tr 
                    key={option.apy} 
                    className="border-b transition-colors cursor-pointer"
                    style={{ 
                      borderColor: 'var(--border-default)',
                      backgroundColor: isSelected ? 'rgba(199, 247, 10, 0.1)' : 'transparent'
                    }}
                    onClick={() => setSelectedApy(option.apy)}
                    onMouseEnter={(e) => !isSelected && (e.currentTarget.style.backgroundColor = 'var(--bg-accent-soft)')}
                    onMouseLeave={(e) => !isSelected && (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td className="py-4 font-bold" style={{ color: 'var(--text-primary)' }}>{option.label}</td>
                    <td className="py-4 text-right font-black" style={{ color: isSelected ? '#C7F70A' : 'var(--text-primary)' }}>
                      {option.apy}%
                    </td>
                    <td className="py-4 text-right" style={{ color: 'var(--text-muted)' }}>₹{monthly.toFixed(2)}</td>
                    <td className="py-4 text-right" style={{ color: 'var(--text-muted)' }}>₹{sixMonth.toFixed(2)}</td>
                    <td className="py-4 text-right font-bold" style={{ color: isSelected ? '#C7F70A' : 'var(--text-primary)' }}>
                      ₹{yearly.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default YieldPage;
