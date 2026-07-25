const database = require('../config/database');
const logger = require('../config/logger');

class TranscriptionService {
  // Mock transcription using pattern matching
  async transcribeAudio(audioUrl) {
    try {
      // In production, use OpenAI Whisper API
      const mockTranscriptions = [
        'Thank you for calling voiceBiz',
        'How can I help you today?',
        'Your call is important to us',
        'Please hold while we connect you',
      ];

      const transcription = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
      logger.info('Audio transcribed', { audioUrl });
      return transcription;
    } catch (error) {
      logger.error('Transcription failed', error);
      throw error;
    }
  }

  updateCallTranscription(callId, transcription) {
    const call = database.calls.find(c => c.id === callId);
    if (call) {
      call.transcription = transcription;
      logger.info('Call transcription updated', { callId });
    }
    return call;
  }
}

module.exports = new TranscriptionService();
