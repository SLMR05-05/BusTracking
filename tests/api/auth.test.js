const request = require('supertest');

const API_URL = 'http://localhost:5000/api';

describe('Authentication API Tests', () => {
  describe('POST /users/login', () => {
    test('Đăng nhập thành công với tài khoản admin', async () => {
      const response = await request(API_URL)
        .post('/users/login')
        .send({
          username: 'admin',
          password: '12345'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.roleId).toBe('AD');
    });

    test('Đăng nhập thất bại với mật khẩu sai', async () => {
      const response = await request(API_URL)
        .post('/users/login')
        .send({
          username: 'admin',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });

    test('Đăng nhập thất bại khi thiếu username', async () => {
      const response = await request(API_URL)
        .post('/users/login')
        .send({
          password: '12345'
        });

      expect(response.status).toBe(400);
    });

    test('Đăng nhập thất bại khi thiếu password', async () => {
      const response = await request(API_URL)
        .post('/users/login')
        .send({
          username: 'admin'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('Token Verification', () => {
    let token;

    beforeAll(async () => {
      const response = await request(API_URL)
        .post('/users/login')
        .send({
          username: 'admin',
          password: '12345'
        });
      token = response.body.token;
    });

    test('Truy cập API với token hợp lệ', async () => {
      const response = await request(API_URL)
        .get('/students')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });

    test('Truy cập API không có token', async () => {
      const response = await request(API_URL)
        .get('/students');

      expect(response.status).toBe(401);
    });

    test('Truy cập API với token không hợp lệ', async () => {
      const response = await request(API_URL)
        .get('/students')
        .set('Authorization', 'Bearer invalid_token');

      expect(response.status).toBe(401);
    });
  });
});
