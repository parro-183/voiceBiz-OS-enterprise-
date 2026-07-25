const database = require('../config/database');
const logger = require('../config/logger');

class RecordingService {
  createRecording(callId, audioUrl) {
    try {
      const recording = {
        id: `rec_${Date.now()}`,
        callId,
        audioUrl,
        duration: 0,
        size: 0,
        format: 'mp3',
        createdAt: new Date(),
        encrypted: true,
      };

      database.recordings.push(recording);
      logger.info('Recording created', { recordingId: recording.id, callId });
      return recording;
    } catch (error) {
      logger.error('Failed to create recording', error);
      throw error;
    }
  }

  getRecording(recordingId) {
    return database.recordings.find(r => r.id === recordingId);
  }

  getRecordingsByCall(callId) {
    return database.recordings.filter(r => r.callId === callId);
  }

  deleteRecording(recordingId) {
    const index = database.recordings.findIndex(r => r.id === recordingId);
    if (index === -1) return false;
    database.recordings.splice(index, 1);
    logger.info('Recording deleted', { recordingId });
    return true;
  }
}

module.exports = new RecordingService();
