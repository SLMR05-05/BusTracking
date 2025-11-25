const request = require('supertest');

const API_URL = 'http://localhost:5000/api';

describe('Schedule API Tests', () => {
  let token;
  let testScheduleId;

  beforeAll(async () => {
    // Login to get token
    const response = await request(API_URL)
      .post('/users/login')
      .send({
        username: 'admin',
        password: '12345'
      });
    token = response.body.token;
  });

  describe('GET /schedules', () => {
    test('Lấy danh sách lịch trình thành công', async () => {
      const response = await request(API_URL)
        .get('/schedules')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('Lọc lịch trình theo ngày', async () => {
      const today = new Date().toISOString().split('T')[0];
      const response = await request(API_URL)
        .get(`/schedules/by-date?date=${today}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /schedules', () => {
    test('Tạo lịch trình mới thành công', async () => {
      const newSchedule = {
        MaLT: `LT${Date.now()}`,
        MaTD: 'TD001',
        MaTX: 'TX001',
        MaXB: 'XB001',
        NgayChay: '2025-12-01',
        GioBatDau: '07:00:00',
        GioKetThuc: '08:00:00',
        TrangThai: 'pending'
      };

      const response = await request(API_URL)
        .post('/schedules')
        .set('Authorization', `Bearer ${token}`)
        .send(newSchedule);

      expect(response.status).toBe(201);
      testScheduleId = newSchedule.MaLT;
    });

    test('Tạo lịch trình thất bại khi thiếu thông tin', async () => {
      const response = await request(API_URL)
        .post('/schedules')
        .set('Authorization', `Bearer ${token}`)
        .send({
          MaLT: `LT${Date.now()}`
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /schedules/:id', () => {
    test('Lấy chi tiết lịch trình thành công', async () => {
      if (!testScheduleId) {
        const schedules = await request(API_URL)
          .get('/schedules')
          .set('Authorization', `Bearer ${token}`);
        testScheduleId = schedules.body[0]?.MaLT;
      }

      if (testScheduleId) {
        const response = await request(API_URL)
          .get(`/schedules/${testScheduleId}`)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('MaLT');
      }
    });

    test('Lấy lịch trình không tồn tại', async () => {
      const response = await request(API_URL)
        .get('/schedules/INVALID_ID')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /schedules/:id', () => {
    test('Xóa lịch trình thành công', async () => {
      if (testScheduleId) {
        const response = await request(API_URL)
          .delete(`/schedules/${testScheduleId}`)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
      }
    });
  });
});
