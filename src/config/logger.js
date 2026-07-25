const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFile = path.join(logsDir, 'app.log');

const logger = {
  info: (message, data = {}) => {
    const log = `[${new Date().toISOString()}] INFO: ${message} ${JSON.stringify(data)}\n`;
    console.log(log);
    fs.appendFileSync(logFile, log);
  },
  error: (message, error = {}) => {
    const log = `[${new Date().toISOString()}] ERROR: ${message} ${JSON.stringify(error)}\n`;
    console.error(log);
    fs.appendFileSync(logFile, log);
  },
  warn: (message, data = {}) => {
    const log = `[${new Date().toISOString()}] WARN: ${message} ${JSON.stringify(data)}\n`;
    console.warn(log);
    fs.appendFileSync(logFile, log);
  },
};

module.exports = logger;
