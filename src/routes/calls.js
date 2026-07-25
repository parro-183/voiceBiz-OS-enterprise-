const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const callService = require('../services/callService');
const sentimentService = require('../services/sentimentService');
const transcriptionService = require('../services/transcriptionService');
const recordingService = require('../services/recordingService');
const logger = require('../config/logger');

router.use(authMiddleware);

// Create a new call
router.post('/', (req, res) => {
  try {
    const { customerId, phoneNumber } = req.body;

    if (!customerId || !phoneNumber) {
      return res.status(400).json({ error: 'customerId and phoneNumber are required' });
    }

    const call = callService.createCall({ customerId, phoneNumber });
    res.status(201).json({ message: 'Call created', call });
  } catch (error) {
    logger.error('Failed to create call', error);
    res.status(500).json({ error: error.message || 'Failed to create call' });
  }
});

// Get all calls
router.get('/', (req, res) => {
  try {
    const calls = callService.getAllCalls();
    res.json({ calls, count: calls.length });
  } catch (error) {
    logger.error('Failed to fetch calls', error);
    res.status(500).json({ error: 'Failed to fetch calls' });
  }
});

// Get call by ID
router.get('/:callId', (req, res) => {
  try {
    const call = callService.getCall(req.params.callId);
    if (!call) return res.status(404).json({ error: 'Call not found' });
    res.json(call);
  } catch (error) {
    logger.error('Failed to fetch call', error);
    res.status(500).json({ error: 'Failed to fetch call' });
  }
});

// End a call
router.post('/:callId/end', (req, res) => {
  try {
    const call = callService.endCall(req.params.callId);
    if (!call) return res.status(404).json({ error: 'Call not found' });
    res.json({ message: 'Call ended', call });
  } catch (error) {
    logger.error('Failed to end call', error);
    res.status(500).json({ error: 'Failed to end call' });
  }
});

// Add recording to call
router.post('/:callId/record', (req, res) => {
  try {
    const { audioUrl } = req.body;
    const recording = recordingService.createRecording(req.params.callId, audioUrl);
    const call = callService.getCall(req.params.callId);
    if (call) call.recordingId = recording.id;
    res.status(201).json({ message: 'Recording added', recording });
  } catch (error) {
    logger.error('Failed to record call', error);
    res.status(500).json({ error: 'Failed to record call' });
  }
});

// Transcribe call
router.post('/:callId/transcribe', async (req, res) => {
  try {
    const call = callService.getCall(req.params.callId);
    if (!call) return res.status(404).json({ error: 'Call not found' });

    const transcription = await transcriptionService.transcribeAudio(call.recordingId);
    transcriptionService.updateCallTranscription(req.params.callId, transcription);

    res.json({ message: 'Call transcribed', transcription });
  } catch (error) {
    logger.error('Transcription failed', error);
    res.status(500).json({ error: 'Transcription failed' });
  }
});

// Analyze sentiment
router.post('/:callId/sentiment', (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    const call = sentimentService.updateCallSentiment(req.params.callId, text);
    if (!call) return res.status(404).json({ error: 'Call not found' });

    res.json({ message: 'Sentiment analyzed', sentiment: call.sentiment });
  } catch (error) {
    logger.error('Sentiment analysis failed', error);
    res.status(500).json({ error: 'Sentiment analysis failed' });
  }
});

module.exports = router;
