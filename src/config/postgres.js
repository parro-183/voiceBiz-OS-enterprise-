const { Pool } = require('pg');
const logger = require('../config/logger');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err);
});

const initDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS agents (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        status VARCHAR(50) DEFAULT 'available',
        current_calls INT DEFAULT 0,
        max_calls INT DEFAULT 5,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS calls (
        id SERIAL PRIMARY KEY,
        customer_id VARCHAR(255) NOT NULL,
        agent_id INT REFERENCES agents(id),
        status VARCHAR(50) DEFAULT 'active',
        start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        end_time TIMESTAMP,
        duration INT,
        recording_id VARCHAR(255),
        transcription TEXT,
        sentiment VARCHAR(50),
        phone_number VARCHAR(20)
      );

      CREATE TABLE IF NOT EXISTS recordings (
        id SERIAL PRIMARY KEY,
        call_id INT REFERENCES calls(id),
        audio_url VARCHAR(500),
        duration INT,
        format VARCHAR(10) DEFAULT 'mp3',
        encrypted BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_calls_agent_id ON calls(agent_id);
      CREATE INDEX IF NOT EXISTS idx_calls_status ON calls(status);
      CREATE INDEX IF NOT EXISTS idx_recordings_call_id ON recordings(call_id);
    `);
    logger.info('Database initialized successfully');
  } catch (error) {
    logger.error('Database initialization failed', error);
  }
};

module.exports = { pool, initDatabase };
