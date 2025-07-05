class MockContentAnalyzer {
    constructor() {
        this.analysisCount = 0;
    }

    async analyze(config) {
        this.analysisCount++;
        
        // Simulate analysis delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const { script, topic, targetAudience, niche } = config;
        
        // Generate mock engagement predictions based on content characteristics
        const baseViews = this.calculateBaseViews(script.length, topic, niche);
        const engagementMultiplier = this.calculateEngagementMultiplier(targetAudience, niche);
        const viralityScore = this.calculateViralityScore(script, topic);
        
        const predictedViews = Math.floor(baseViews * engagementMultiplier * (1 + viralityScore));
        const predictedLikes = Math.floor(predictedViews * 0.08); // 8% like rate
        const predictedShares = Math.floor(predictedViews * 0.02); // 2% share rate
        const predictedComments = Math.floor(predictedViews * 0.01); // 1% comment rate
        
        return {
            contentId: `analysis_${Date.now()}_${this.analysisCount}`,
            predictedViews,
            predictedLikes,
            predictedShares,
            predictedComments,
            viralityScore,
            engagementRate: (predictedLikes + predictedShares + predictedComments) / predictedViews,
            audienceMatch: this.calculateAudienceMatch(targetAudience, niche),
            contentQuality: this.calculateContentQuality(script),
            trendingPotential: this.calculateTrendingPotential(topic, niche),
            recommendations: this.generateRecommendations(script, topic, niche),
            analysisTimestamp: new Date().toISOString()
        };
    }

    calculateBaseViews(scriptLength, topic, niche) {
        // Base views calculation based on content characteristics
        let base = 1000;
        
        // Adjust for script length (optimal 100-200 words)
        if (scriptLength > 50 && scriptLength < 300) base *= 1.5;
        else if (scriptLength > 300) base *= 0.8;
        
        // Adjust for niche popularity
        const nicheMultipliers = {
            'tech': 1.8,
            'fitness': 1.4,
            'cooking': 1.2,
            'travel': 1.6,
            'education': 1.3,
            'entertainment': 2.0
        };
        
        base *= nicheMultipliers[niche] || 1.0;
        
        return Math.floor(base);
    }

    calculateEngagementMultiplier(targetAudience, niche) {
        // Engagement multiplier based on target audience and niche
        let multiplier = 1.0;
        
        const audienceMultipliers = {
            'gen-z': 1.4,
            'millennials': 1.2,
            'gen-x': 0.9,
            'boomers': 0.7
        };
        
        multiplier *= audienceMultipliers[targetAudience] || 1.0;
        
        return multiplier;
    }

    calculateViralityScore(script, topic) {
        // Calculate virality potential based on content characteristics
        let score = 0.1; // Base score
        
        // Check for trending keywords
        const trendingKeywords = ['ai', 'crypto', 'viral', 'trending', 'breaking', 'exclusive'];
        const scriptLower = script.toLowerCase();
        
        trendingKeywords.forEach(keyword => {
            if (scriptLower.includes(keyword)) score += 0.1;
        });
        
        // Check for emotional triggers
        const emotionalWords = ['amazing', 'incredible', 'shocking', 'unbelievable', 'wow'];
        emotionalWords.forEach(word => {
            if (scriptLower.includes(word)) score += 0.05;
        });
        
        return Math.min(score, 0.5); // Cap at 0.5
    }

    calculateAudienceMatch(targetAudience, niche) {
        // Calculate how well content matches target audience
        const audienceNicheMatch = {
            'gen-z': ['tech', 'entertainment', 'fitness'],
            'millennials': ['tech', 'travel', 'cooking', 'education'],
            'gen-x': ['education', 'cooking', 'travel'],
            'boomers': ['cooking', 'education']
        };
        
        const matches = audienceNicheMatch[targetAudience] || [];
        return matches.includes(niche) ? 0.9 : 0.6;
    }

    calculateContentQuality(script) {
        // Simple content quality calculation
        let quality = 0.5; // Base quality
        
        // Length factor
        if (script.length > 100) quality += 0.2;
        if (script.length > 200) quality += 0.1;
        
        // Structure factor (check for paragraphs, punctuation)
        const sentences = script.split(/[.!?]+/).length;
        if (sentences > 3) quality += 0.1;
        
        return Math.min(quality, 1.0);
    }

    calculateTrendingPotential(topic, niche) {
        // Calculate trending potential
        const trendingTopics = ['ai', 'blockchain', 'crypto', 'metaverse', 'web3'];
        const isTrending = trendingTopics.some(t => topic.toLowerCase().includes(t));
        
        return isTrending ? 0.8 : 0.3;
    }

    generateRecommendations(script, topic, niche) {
        const recommendations = [];
        
        if (script.length < 100) {
            recommendations.push("Consider expanding the script for better engagement");
        }
        
        if (!script.includes('?')) {
            recommendations.push("Add questions to encourage viewer interaction");
        }
        
        if (niche === 'tech' && !script.toLowerCase().includes('ai')) {
            recommendations.push("Consider mentioning AI trends for tech audience");
        }
        
        return recommendations;
    }
}

module.exports = MockContentAnalyzer; 