const database = require('../config/database');
const logger = require('../config/logger');

class UserService {
  createUser(userData) {
    try {
      const user = {
        id: `user_${Date.now()}`,
        email: userData.email,
        name: userData.name,
        role: userData.role || 'user',
        createdAt: new Date(),
        ...userData,
      };
      database.users.push(user);
      logger.info('User created', { userId: user.id, email: user.email });
      return user;
    } catch (error) {
      logger.error('Failed to create user', error);
      throw error;
    }
  }

  getUser(userId) {
    return database.users.find(u => u.id === userId);
  }

  getAllUsers() {
    return database.users;
  }

  updateUser(userId, updates) {
    const user = this.getUser(userId);
    if (!user) return null;
    Object.assign(user, updates);
    logger.info('User updated', { userId });
    return user;
  }

  deleteUser(userId) {
    const index = database.users.findIndex(u => u.id === userId);
    if (index === -1) return false;
    database.users.splice(index, 1);
    logger.info('User deleted', { userId });
    return true;
  }
}

module.exports = new UserService();
