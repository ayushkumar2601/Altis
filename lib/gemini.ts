/**
 * GEMINI AI INTEGRATION
 * 
 * Provides AI-powered bond recommendations and portfolio insights
 */

const GEMINI_API_KEY = import.meta.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export interface UserProfile {
  age?: number;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  investmentGoal: 'retirement' | 'wealth-building' | 'income' | 'short-term';
  investmentHorizon: 'short' | 'medium' | 'long'; // < 2 years, 2-5 years, > 5 years
  monthlyInvestment?: number;
}

export interface BondRecommendation {
  bondId: string;
  bondName: string;
  score: number; // 0-100
  reasoning: string;
  pros: string[];
  cons: string[];
}

export interface PortfolioInsight {
  type: 'optimization' | 'risk' | 'opportunity' | 'warning';
  title: string;
  description: string;
  actionable: boolean;
  suggestedAction?: string;
}

export interface AIRecommendationResponse {
  recommendations: BondRecommendation[];
  portfolioInsights: PortfolioInsight[];
  marketSummary: string;
  riskAssessment: string;
}

/**
 * Call Gemini API
 */
async function callGeminiAPI(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    console.error('[Gemini] API key not found');
    throw new Error('Gemini API key not configured');
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new Error('No response from Gemini API');
    }

    return text;
  } catch (error) {
    console.error('[Gemini] API call failed:', error);
    throw error;
  }
}

/**
 * Generate AI-powered bond recommendations
 */
export async function getAIRecommendations(
  userProfile: UserProfile,
  availableBonds: any[],
  currentPortfolio: any[]
): Promise<AIRecommendationResponse> {
  
  console.log('[Gemini] Generating AI recommendations...');

  const prompt = `You are an expert financial advisor specializing in Indian government bonds and fixed-income securities.

USER PROFILE:
- Risk Tolerance: ${userProfile.riskTolerance}
- Investment Goal: ${userProfile.investmentGoal}
- Investment Horizon: ${userProfile.investmentHorizon}
${userProfile.age ? `- Age: ${userProfile.age}` : ''}
${userProfile.monthlyInvestment ? `- Monthly Investment Capacity: ₹${userProfile.monthlyInvestment}` : ''}

AVAILABLE BONDS:
${availableBonds.map((b, i) => `${i + 1}. ${b.name} - APY: ${b.apy}%, Maturity: ${b.maturityDate}, Min: ₹${b.pricePerUnit}, Risk: ${b.risk}`).join('\n')}

CURRENT PORTFOLIO:
${currentPortfolio.length > 0 
  ? currentPortfolio.map(h => `- ${h.bondName}: ₹${h.investedAmount} invested, ${h.apy}% APY`).join('\n')
  : 'No current holdings'}

TASK:
Provide personalized bond recommendations and portfolio insights in the following JSON format:

{
  "recommendations": [
    {
      "bondId": "bond-id-here",
      "bondName": "Bond Name",
      "score": 85,
      "reasoning": "Brief explanation why this bond suits the user",
      "pros": ["Pro 1", "Pro 2", "Pro 3"],
      "cons": ["Con 1", "Con 2"]
    }
  ],
  "portfolioInsights": [
    {
      "type": "optimization|risk|opportunity|warning",
      "title": "Insight Title",
      "description": "Detailed description",
      "actionable": true,
      "suggestedAction": "What user should do"
    }
  ],
  "marketSummary": "Brief overview of current Indian bond market conditions and trends",
  "riskAssessment": "Assessment of user's current portfolio risk and diversification"
}

GUIDELINES:
1. Recommend 3-5 bonds that best match the user's profile
2. Consider diversification across maturity dates and bond types
3. Provide 2-4 actionable portfolio insights
4. Be specific and practical in recommendations
5. Consider Indian market context and regulations
6. Return ONLY valid JSON, no additional text

Generate the recommendations now:`;

  try {
    const response = await callGeminiAPI(prompt);
    
    // Extract JSON from response (handle markdown code blocks)
    let jsonText = response.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }
    
    const result = JSON.parse(jsonText);
    
    console.log('[Gemini] Recommendations generated successfully');
    return result;
    
  } catch (error) {
    console.error('[Gemini] Failed to generate recommendations:', error);
    
    // Fallback recommendations
    return generateFallbackRecommendations(userProfile, availableBonds, currentPortfolio);
  }
}

/**
 * Generate market insights
 */
export async function getMarketInsights(): Promise<string> {
  const prompt = `As an expert on Indian government bonds and fixed-income securities, provide a brief (3-4 sentences) market insight about:
1. Current trends in Indian G-Sec yields
2. RBI monetary policy impact
3. Outlook for the next 6 months

Keep it concise, factual, and relevant for retail investors. Return plain text only.`;

  try {
    const response = await callGeminiAPI(prompt);
    return response.trim();
  } catch (error) {
    console.error('[Gemini] Failed to get market insights:', error);
    return 'Market insights are currently unavailable. Please check back later.';
  }
}

/**
 * Analyze portfolio and suggest optimizations
 */
export async function analyzePortfolio(
  portfolio: any[],
  availableBonds: any[]
): Promise<{
  diversificationScore: number;
  riskScore: number;
  suggestions: string[];
  analysis: string;
}> {
  
  if (portfolio.length === 0) {
    return {
      diversificationScore: 0,
      riskScore: 0,
      suggestions: ['Start investing to build your portfolio'],
      analysis: 'Your portfolio is empty. Consider starting with a diversified mix of government bonds.'
    };
  }

  const prompt = `Analyze this Indian government bond portfolio:

HOLDINGS:
${portfolio.map(h => `- ${h.bondName}: ₹${h.investedAmount}, ${h.apy}% APY, Maturity: ${h.maturityDate}`).join('\n')}

TOTAL INVESTED: ₹${portfolio.reduce((sum, h) => sum + h.investedAmount, 0).toLocaleString('en-IN')}

Provide analysis in this JSON format:
{
  "diversificationScore": 75,
  "riskScore": 30,
  "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"],
  "analysis": "2-3 sentence overall portfolio analysis"
}

- diversificationScore: 0-100 (higher is better diversified)
- riskScore: 0-100 (higher is riskier)
- suggestions: 3-5 actionable recommendations
- analysis: Brief overall assessment

Return ONLY valid JSON.`;

  try {
    const response = await callGeminiAPI(prompt);
    let jsonText = response.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }
    
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('[Gemini] Portfolio analysis failed:', error);
    return {
      diversificationScore: 50,
      riskScore: 50,
      suggestions: ['Consider diversifying across different maturity dates', 'Review your risk tolerance'],
      analysis: 'Portfolio analysis is currently unavailable.'
    };
  }
}

/**
 * Fallback recommendations when AI fails
 */
function generateFallbackRecommendations(
  userProfile: UserProfile,
  availableBonds: any[],
  currentPortfolio: any[]
): AIRecommendationResponse {
  
  // Simple rule-based recommendations
  const recommendations: BondRecommendation[] = [];
  
  // Sort bonds by APY
  const sortedBonds = [...availableBonds].sort((a, b) => b.apy - a.apy);
  
  // Conservative: Lower APY, shorter duration
  // Moderate: Medium APY, medium duration
  // Aggressive: Higher APY, longer duration
  
  const topBonds = sortedBonds.slice(0, 3);
  
  topBonds.forEach((bond, index) => {
    recommendations.push({
      bondId: bond.id,
      bondName: bond.name,
      score: 85 - (index * 10),
      reasoning: `This bond offers a ${bond.apy}% APY with ${bond.risk} risk level, suitable for your ${userProfile.riskTolerance} risk profile.`,
      pros: [
        `${bond.apy}% annual yield`,
        `${bond.risk} risk rating`,
        `Minimum investment of ₹${bond.pricePerUnit}`
      ],
      cons: [
        'Market conditions may change',
        'Consider diversification'
      ]
    });
  });
  
  return {
    recommendations,
    portfolioInsights: [
      {
        type: 'optimization',
        title: 'Diversify Your Portfolio',
        description: 'Consider spreading investments across bonds with different maturity dates to balance risk and returns.',
        actionable: true,
        suggestedAction: 'Invest in bonds with varying maturity periods'
      }
    ],
    marketSummary: 'Indian government bonds continue to offer stable returns backed by sovereign guarantee.',
    riskAssessment: currentPortfolio.length > 0 
      ? 'Your portfolio shows moderate diversification. Consider adding bonds with different characteristics.'
      : 'Start building a diversified portfolio with government-backed securities.'
  };
}
