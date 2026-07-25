const database = require('../config/database');
const logger = require('../config/logger');

class SentimentService {
  // Simple sentiment analysis
  analyzeSentiment(text) {
    const positiveKeywords = ['thank', 'happy', 'great', 'excellent', 'wonderful'];
    const negativeKeywords = ['angry', 'upset', 'bad', 'terrible', 'awful', 'hate'];

    const lowerText = text.toLowerCase();
    let score = 0;

    positiveKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) score += 1;
    });

    negativeKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) score -= 1;
    });

    const sentiment = score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral';
    const confidence = Math.min(Math.abs(score) / 2, 1);

    return { sentiment, score, confidence };
  }

  updateCallSentiment(callId, text) {
    const call = database.calls.find(c => c.id === callId);
    if (!call) return null;

    const sentimentAnalysis = this.analyzeSentiment(text);
    call.sentiment = sentimentAnalysis;

    logger.info('Call sentiment analyzed', { callId, sentiment: sentimentAnalysis.sentiment });
    return call;
  }
}

module.exports = new SentimentService();
