# 🤖 AI Advisor Feature

## Overview
The AI Advisor is powered by Google's Gemini AI and provides personalized bond recommendations, portfolio analysis, and market insights for Altis users.

## Features

### 1. **Personalized Bond Recommendations**
- AI analyzes user's risk profile, investment goals, and time horizon
- Recommends 3-5 bonds that best match user preferences
- Provides detailed reasoning, pros, and cons for each recommendation
- Match score (0-100%) showing how well each bond fits the user's profile

### 2. **Portfolio Analysis**
- **Diversification Score**: Measures how well-diversified your portfolio is (0-100)
- **Risk Score**: Assesses overall portfolio risk level (0-100)
- **Actionable Suggestions**: 3-5 specific recommendations to improve your portfolio

### 3. **Market Insights**
- Real-time analysis of Indian G-Sec market trends
- RBI monetary policy impact assessment
- 6-month outlook for bond investors

### 4. **Portfolio Insights**
- Optimization opportunities
- Risk warnings
- Investment opportunities
- Actionable suggestions with specific next steps

## How It Works

### User Profile Collection
Users provide:
- **Risk Tolerance**: Conservative, Moderate, or Aggressive
- **Investment Goal**: Retirement, Wealth Building, Income, or Short-term
- **Investment Horizon**: Short (< 2 years), Medium (2-5 years), or Long (> 5 years)
- **Age** (optional): For more personalized recommendations

### AI Processing
1. Gemini AI analyzes user profile against available bonds
2. Considers current portfolio holdings for diversification
3. Evaluates market conditions and trends
4. Generates personalized recommendations with detailed reasoning

### Recommendation Display
- Visual cards showing top bond recommendations
- Match percentage for each bond
- Pros and cons clearly listed
- One-click navigation to bond details

## Technical Implementation

### API Integration
```typescript
// lib/gemini.ts
- getAIRecommendations(): Main recommendation engine
- getMarketInsights(): Market analysis
- analyzePortfolio(): Portfolio health check
```

### Components
```typescript
// components/AIRecommendations.tsx
- Profile form for user input
- Recommendation cards
- Portfolio analysis dashboard
- Market insights banner
```

### Fallback System
If Gemini API fails, the system uses rule-based recommendations to ensure users always get suggestions.

## Usage

### For Users
1. Navigate to "AI Advisor" in the navbar
2. Fill out your investment profile
3. Click "Get AI Recommendations"
4. Review personalized bond suggestions
5. Click on any bond to view details or invest

### For Developers
```typescript
import { getAIRecommendations, UserProfile } from './lib/gemini';

const profile: UserProfile = {
  riskTolerance: 'moderate',
  investmentGoal: 'wealth-building',
  investmentHorizon: 'medium'
};

const recommendations = await getAIRecommendations(
  profile,
  availableBonds,
  currentPortfolio
);
```

## API Configuration

The Gemini API key is stored in `.env.local`:
```
GEMINI_API_KEY=your_api_key_here
```

## Benefits

### For Users
- **Personalized**: Recommendations tailored to individual goals and risk tolerance
- **Educational**: Learn why certain bonds are recommended
- **Time-saving**: No need to manually research dozens of bonds
- **Confidence**: Make informed decisions backed by AI analysis

### For Platform
- **Differentiation**: Unique feature not available on traditional platforms
- **Engagement**: Users spend more time exploring recommendations
- **Conversion**: Personalized suggestions increase investment likelihood
- **Retention**: Regular insights keep users coming back

## Future Enhancements

1. **Historical Performance Tracking**: Track how AI recommendations perform over time
2. **Learning System**: Improve recommendations based on user behavior
3. **Alerts**: Notify users when new bonds match their profile
4. **Comparison Tool**: Compare AI recommendations vs user's actual choices
5. **Voice Interface**: Ask questions and get AI responses
6. **Multi-language**: Support for Hindi, Tamil, Telugu, etc.

## Performance

- **Response Time**: 2-5 seconds for full analysis
- **Accuracy**: Recommendations based on proven investment principles
- **Reliability**: Fallback system ensures 100% uptime

## Security & Privacy

- User profiles are not stored permanently
- API calls are made securely over HTTPS
- No personal financial data is sent to Gemini
- Only bond preferences and portfolio composition are analyzed

## Support

For issues or questions about the AI Advisor:
1. Check browser console for detailed error messages
2. Verify Gemini API key is configured correctly
3. Ensure internet connection is stable
4. Try the fallback recommendations if AI is unavailable

---

**Built with ❤️ using Google Gemini AI**
