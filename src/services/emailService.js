const nodemailer = require('nodemailer');
const logger = require('../config/logger');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendCallAlert(email, callData) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `voiceBiz Call Alert - ${callData.id}`,
        html: `
          <h2>📞 Call Notification</h2>
          <p><strong>Call ID:</strong> ${callData.id}</p>
          <p><strong>Customer:</strong> ${callData.customerId}</p>
          <p><strong>Status:</strong> ${callData.status}</p>
          <p><strong>Duration:</strong> ${callData.duration}s</p>
          <p><strong>Time:</strong> ${new Date(callData.startTime).toLocaleString()}</p>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      logger.info('Email sent', { email, callId: callData.id });
    } catch (error) {
      logger.error('Failed to send email', error);
    }
  }

  async sendAgentAlert(agentEmail, message) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: agentEmail,
        subject: 'voiceBiz Agent Alert',
        html: `<h2>🤖 Agent Alert</h2><p>${message}</p>`,
      };

      await this.transporter.sendMail(mailOptions);
      logger.info('Agent alert sent', { email: agentEmail });
    } catch (error) {
      logger.error('Failed to send agent alert', error);
    }
  }
}

module.exports = new EmailService();
