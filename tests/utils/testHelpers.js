const request = require('supertest');

const API_URL = 'http://localhost:5000/api';

/**
 * Helper function to login and get token
 */
async function loginAndGetToken(username, password) {
  const response = await request(API_URL)
    .post('/users/login')
    .send({ username, password });

  if (response.status === 200) {
    return response.body.token;
  }
  return null;
}

/**
 * Helper function to create test schedule
 */
async function createTestSchedule(token, scheduleData) {
  const response = await request(API_URL)
    .post('/schedules')
    .set('Authorization', `Bearer ${token}`)
    .send(scheduleData);

  return response.body;
}

/**
 * Helper function to cleanup test data
 */
async function cleanupTestData(token, scheduleId) {
  if (scheduleId) {
    await request(API_URL)
      .delete(`/schedules/${scheduleId}`)
      .set('Authorization', `Bearer ${token}`);
  }
}

/**
 * Wait for a condition to be true
 */
async function waitFor(condition, timeout = 5000) {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  return false;
}

module.exports = {
  loginAndGetToken,
  createTestSchedule,
  cleanupTestData,
  waitFor
};
