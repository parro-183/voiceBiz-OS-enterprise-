// Simple in-memory database for MVP
// In production, use PostgreSQL with Prisma

const database = {
  users: [],
  agents: [],
  calls: [],
  recordings: [],
  analytics: [],
};

module.exports = database;
