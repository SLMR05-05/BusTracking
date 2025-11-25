/**
 * Test data fixtures
 */

module.exports = {
  users: {
    admin: {
      username: 'admin',
      password: '12345',
      roleId: 'AD'
    },
    driver: {
      username: 'driver1',
      password: '12345',
      roleId: 'TX'
    },
    parent: {
      username: 'parent1',
      password: '12345',
      roleId: 'PH'
    }
  },

  schedules: {
    valid: {
      MaTD: 'TD001',
      MaTX: 'TX001',
      MaXB: 'XB001',
      NgayChay: '2025-12-01',
      GioBatDau: '07:00:00',
      GioKetThuc: '08:00:00',
      TrangThai: 'pending'
    }
  },

  incidents: {
    valid: {
      description: 'Test incident - Xe bị hỏng',
      scheduleId: 'LT001',
      busId: 'XB001'
    }
  },

  students: {
    valid: {
      TenHS: 'Nguyễn Văn A',
      Lop: '1A',
      MaPH: 'PH001',
      MaTram: 'TR001'
    }
  }
};
