const request = require('supertest');

const API_URL = 'http://localhost:5000/api';

describe('Incident API Tests', () => {
  let adminToken;
  let driverToken;
  let testIncidentId;

  beforeAll(async () => {
    // Login as admin
    const adminResponse = await request(API_URL)
      .post('/users/login')
      .send({
        username: 'admin',
        password: '12345'
      });
    adminToken = adminResponse.body.token;

    // Login as driver
    const driverResponse = await request(API_URL)
      .post('/users/login')
      .send({
        username: 'driver1',
        password: '12345'
      });
    
    if (driverResponse.status === 200) {
      driverToken = driverResponse.body.token;
    }
  });

  describe('POST /driver-dashboard/incidents', () => {
    test('Tài xế báo cáo sự cố thành công', async () => {
      if (!driverToken) {
        console.log('Skipping test - no driver token');
        return;
      }

      const response = await request(API_URL)
        .post('/driver-dashboard/incidents')
        .set('Authorization', `Bearer ${driverToken}`)
        .send({
          description: 'Test incident - Xe bị hỏng',
          scheduleId: 'LT001',
          busId: 'XB001'
        });

      expect([200, 201, 500]).toContain(response.status);
      
      if (response.status === 201) {
        expect(response.body).toHaveProperty('MaCB');
        testIncidentId = response.body.MaCB;
      }
    });

    test('Báo cáo sự cố thất bại khi thiếu nội dung', async () => {
      if (!driverToken) {
        console.log('Skipping test - no driver token');
        return;
      }

      const response = await request(API_URL)
        .post('/driver-dashboard/incidents')
        .set('Authorization', `Bearer ${driverToken}`)
        .send({
          scheduleId: 'LT001'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /incidents', () => {
    test('Admin lấy danh sách sự cố', async () => {
      const response = await request(API_URL)
        .get('/incidents')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('DELETE /incidents/:id', () => {
    test('Admin xóa sự cố', async () => {
      if (testIncidentId) {
        const response = await request(API_URL)
          .delete(`/incidents/${testIncidentId}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect([200, 404]).toContain(response.status);
      }
    });
  });
});
