const request = require('supertest');

const API_URL = 'http://localhost:5000/api';

describe('Notification API Tests', () => {
  let token;
  let parentId = 'PH001'; // Test parent ID

  beforeAll(async () => {
    // Login as parent
    const response = await request(API_URL)
      .post('/users/login')
      .send({
        username: 'parent1',
        password: '12345'
      });
    
    if (response.status === 200) {
      token = response.body.token;
      parentId = response.body.user.parentId || 'PH001';
    }
  });

  describe('GET /parent-notifications/parent/:parentId', () => {
    test('Lấy danh sách thông báo của phụ huynh', async () => {
      if (!token) {
        console.log('Skipping test - no parent token');
        return;
      }

      const response = await request(API_URL)
        .get(`/parent-notifications/parent/${parentId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /parent-notifications/parent/:parentId/unread-count', () => {
    test('Lấy số lượng thông báo chưa đọc', async () => {
      if (!token) {
        console.log('Skipping test - no parent token');
        return;
      }

      const response = await request(API_URL)
        .get(`/parent-notifications/parent/${parentId}/unread-count`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('count');
      expect(typeof response.body.count).toBe('number');
    });
  });

  describe('PUT /parent-notifications/parent/:parentId/read-all', () => {
    test('Đánh dấu tất cả thông báo đã đọc', async () => {
      if (!token) {
        console.log('Skipping test - no parent token');
        return;
      }

      const response = await request(API_URL)
        .put(`/parent-notifications/parent/${parentId}/read-all`)
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(response.status).toBe(200);
    });
  });
});
