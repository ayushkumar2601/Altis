import React, { useState, useEffect } from 'react';
import { getAIRecommendations, getMarketInsights, analyzePortfolio, UserProfile, AIRecommendationResponse } from '../lib/gemini';
import { Bond, Holding } from '../App';

interface AIRecommendationsProps {
  availableBonds: Bond[];
  currentPortfolio: Holding[];
  onBondSelect?: (bondId: string) => void;
}

const AIRecommendations: React.FC<AIRecommendationsProps> = ({ 
  availableBonds, 
  currentPortfolio,
  onBondSelect 
}) => {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<AIRecommendationResponse | null>(null);
  const [marketInsights, setMarketInsights] = useState<string>('');
  const [portfolioAnalysis, setPortfolioAnalysis] = useState<any>(null);
  const [showProfileForm, setShowProfileForm] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    riskTolerance: 'moderate',
    investmentGoal: 'wealth-building',
    investmentHorizon: 'medium'
  });

  const loadMarketInsights = async () => {
    try {
      const insights = await getMarketInsights();
      setMarketInsights(insights);
    } catch (error) {
      console.error('Failed to load market insights:', error);
    }
  };

  const loadPortfolioAnalysis = async () => {
    if (currentPortfolio.length === 0) return;
    
    try {
      const analysis = await analyzePortfolio(currentPortfolio, availableBonds);
      setPortfolioAnalysis(analysis);
    } catch (error) {
      console.error('Failed to analyze portfolio:', error);
    }
  };

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      const result = await getAIRecommendations(userProfile, availableBonds, currentPortfolio);
      setRecommendations(result);
      setShowProfileForm(false);
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
      alert('Failed to generate recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMarketInsights();
    loadPortfolioAnalysis();
  }, [currentPortfolio]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'optimization':
        return '⚡';
      case 'risk':
        return '⚠️';
      case 'opportunity':
        return '💡';
      case 'warning':
        return '🚨';
      default:
        return '📊';
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 lg:px-12 max-w-[1400px] mx-auto animate-in fade-in duration-700">
      {/* Header */}
      <header className="mb-16">
        <h1 className="text-huge font-black uppercase mb-4 tracking-tighter" style={{ color: 'var(--text-primary)' }}>
          AI <span className="italic" style={{ color: '#C7F70A' }}>ADVISOR.</span>
        </h1>
        <p className="font-bold uppercase tracking-widest text-sm" style={{ color: 'var(--text-muted)' }}>
          Personalized bond recommendations powered by <span style={{ color: 'var(--text-primary)' }}>Gemini AI</span>
        </p>
      </header>

      {/* Market Insights Banner */}
      {marketInsights && (
        <div className="mb-12 border rounded-3xl p-8" style={{ background: 'linear-gradient(to right, rgba(199, 247, 10, 0.1), transparent)', borderColor: 'rgba(199, 247, 10, 0.2)' }}>
          <div className="flex items-start gap-4">
            <div className="text-4xl">📈</div>
            <div className="flex-1">
              <h3 className="text-lg font-black uppercase mb-3" style={{ color: '#C7F70A' }}>Market Insights</h3>
              <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{marketInsights}</p>
            </div>
          </div>
        </div>
      )}

      {/* Portfolio Analysis */}
      {portfolioAnalysis && currentPortfolio.length > 0 && (
        <div className="mb-12 grid md:grid-cols-3 gap-6">
          <div className="border rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-default)' }}>
            <div className="text-xs font-black uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Diversification Score</div>
            <div className="text-5xl font-black mb-2" style={{ color: '#C7F70A' }}>{portfolioAnalysis.diversificationScore}</div>
            <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'var(--bg-accent-soft)' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${portfolioAnalysis.diversificationScore}%`, backgroundColor: '#C7F70A' }}></div>
            </div>
          </div>

          <div className="border rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-default)' }}>
            <div className="text-xs font-black uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Risk Score</div>
            <div className="text-5xl font-black mb-2" style={{ color: portfolioAnalysis.riskScore > 70 ? 'var(--state-error)' : portfolioAnalysis.riskScore > 40 ? 'var(--state-warning)' : 'var(--state-success)' }}>{portfolioAnalysis.riskScore}</div>
            <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'var(--bg-accent-soft)' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${portfolioAnalysis.riskScore}%`, backgroundColor: portfolioAnalysis.riskScore > 70 ? 'var(--state-error)' : portfolioAnalysis.riskScore > 40 ? 'var(--state-warning)' : 'var(--state-success)' }}></div>
            </div>
          </div>

          <div className="border rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-default)' }}>
            <div className="text-xs font-black uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Holdings</div>
            <div className="text-5xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>{currentPortfolio.length}</div>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Active Bonds</div>
          </div>
        </div>
      )}

      {/* Profile Form */}
      {showProfileForm && (
        <div className="mb-12 border rounded-3xl p-8 lg:p-12" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-default)' }}>
          <h2 className="text-2xl font-black uppercase mb-8" style={{ color: 'var(--text-primary)' }}>Tell Us About Your Goals</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <label className="text-xs font-black uppercase tracking-wider mb-3 block" style={{ color: 'var(--text-muted)' }}>Risk Tolerance</label>
              <div className="grid grid-cols-3 gap-3">
                {(['conservative', 'moderate', 'aggressive'] as const).map((risk) => (
                  <button
                    key={risk}
                    onClick={() => setUserProfile({ ...userProfile, riskTolerance: risk })}
                    className="py-3 px-4 rounded-xl font-bold uppercase text-sm transition-all"
                    style={{
                      backgroundColor: userProfile.riskTolerance === risk ? '#C7F70A' : 'var(--bg-accent-soft)',
                      color: userProfile.riskTolerance === risk ? 'var(--text-primary)' : 'var(--text-muted)',
                      borderWidth: '2px',
                      borderColor: userProfile.riskTolerance === risk ? '#C7F70A' : 'transparent'
                    }}
                  >
                    {risk}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-wider mb-3 block" style={{ color: 'var(--text-muted)' }}>Investment Goal</label>
              <select
                value={userProfile.investmentGoal}
                onChange={(e) => setUserProfile({ ...userProfile, investmentGoal: e.target.value as any })}
                className="w-full py-3 px-4 rounded-xl font-bold border-2 transition-all"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
              >
                <option value="retirement">Retirement Planning</option>
                <option value="wealth-building">Wealth Building</option>
                <option value="income">Regular Income</option>
                <option value="short-term">Short-term Savings</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-wider mb-3 block" style={{ color: 'var(--text-muted)' }}>Investment Horizon</label>
              <div className="grid grid-cols-3 gap-3">
                {(['short', 'medium', 'long'] as const).map((horizon) => (
                  <button
                    key={horizon}
                    onClick={() => setUserProfile({ ...userProfile, investmentHorizon: horizon })}
                    className="py-3 px-4 rounded-xl font-bold uppercase text-sm transition-all"
                    style={{
                      backgroundColor: userProfile.investmentHorizon === horizon ? '#C7F70A' : 'var(--bg-accent-soft)',
                      color: userProfile.investmentHorizon === horizon ? 'var(--text-primary)' : 'var(--text-muted)',
                      borderWidth: '2px',
                      borderColor: userProfile.investmentHorizon === horizon ? '#C7F70A' : 'transparent'
                    }}
                  >
                    {horizon === 'short' ? '< 2Y' : horizon === 'medium' ? '2-5Y' : '> 5Y'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-wider mb-3 block" style={{ color: 'var(--text-muted)' }}>Age (Optional)</label>
              <input
                type="number"
                value={userProfile.age || ''}
                onChange={(e) => setUserProfile({ ...userProfile, age: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="Enter your age"
                className="w-full py-3 px-4 rounded-xl font-bold border-2"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          <button
            onClick={generateRecommendations}
            disabled={loading}
            className="w-full py-5 rounded-full font-black uppercase tracking-widest text-lg transition-all"
            style={{ backgroundColor: '#C7F70A', color: 'var(--text-primary)', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                Analyzing...
              </span>
            ) : (
              '✨ Get AI Recommendations'
            )}
          </button>
        </div>
      )}

      {/* Recommendations */}
      {recommendations && !showProfileForm && (
        <div className="space-y-12">
          {/* Recommended Bonds */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black uppercase" style={{ color: 'var(--text-primary)' }}>Recommended For You</h2>
              <button
                onClick={() => setShowProfileForm(true)}
                className="px-6 py-3 rounded-full font-bold uppercase text-sm transition-all border-2"
                style={{ backgroundColor: 'transparent', borderColor: '#C7F70A', color: 'var(--text-primary)' }}
              >
                Update Profile
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.recommendations.map((rec, index) => (
                <div
                  key={rec.bondId}
                  className="border rounded-2xl p-6 transition-all cursor-pointer"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-default)' }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#C7F70A'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-default)'}
                  onClick={() => onBondSelect?.(rec.bondId)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-black" style={{ color: '#C7F70A' }}>#{index + 1}</div>
                    <div className="px-3 py-1 rounded-full text-xs font-black" style={{ backgroundColor: 'rgba(199, 247, 10, 0.2)', color: '#C7F70A' }}>
                      {rec.score}% Match
                    </div>
                  </div>

                  <h3 className="text-lg font-black mb-3" style={{ color: 'var(--text-primary)' }}>{rec.bondName}</h3>
                  <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{rec.reasoning}</p>

                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="text-xs font-bold uppercase mb-2" style={{ color: 'var(--text-muted)' }}>Pros</div>
                      {rec.pros.slice(0, 2).map((pro, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm mb-1" style={{ color: 'var(--state-success)' }}>
                          <span>✓</span>
                          <span>{pro}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onBondSelect?.(rec.bondId);
                    }}
                    className="w-full py-3 rounded-full font-bold uppercase text-sm transition-all"
                    style={{ backgroundColor: '#C7F70A', color: 'var(--text-primary)' }}
                  >
                    View Bond
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Portfolio Insights */}
          <section>
            <h2 className="text-3xl font-black uppercase mb-8" style={{ color: 'var(--text-primary)' }}>Portfolio Insights</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {recommendations.portfolioInsights.map((insight, index) => (
                <div
                  key={index}
                  className="border rounded-2xl p-6"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-default)' }}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{getInsightIcon(insight.type)}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-black mb-2" style={{ color: 'var(--text-primary)' }}>{insight.title}</h3>
                      <p className="text-sm mb-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{insight.description}</p>
                      {insight.actionable && insight.suggestedAction && (
                        <div className="px-4 py-2 rounded-xl text-sm font-bold" style={{ backgroundColor: 'rgba(199, 247, 10, 0.1)', color: '#C7F70A' }}>
                          💡 {insight.suggestedAction}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Risk Assessment */}
          <section className="border rounded-3xl p-8" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-default)' }}>
            <h2 className="text-2xl font-black uppercase mb-4" style={{ color: 'var(--text-primary)' }}>Risk Assessment</h2>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{recommendations.riskAssessment}</p>
          </section>
        </div>
      )}
    </div>
  );
};

export default AIRecommendations;
