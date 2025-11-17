import db from "../config/db.js";

const AttendanceModel = {
  // Lấy điểm danh theo lịch trình
  getBySchedule: (scheduleId, callback) => {
    const sql = `
      SELECT dd.*, hs.TenHS, hs.Lop, t.TenTram
      FROM diemdanh dd
      INNER JOIN hocsinh hs ON dd.MaHS = hs.MaHS
      LEFT JOIN tram t ON hs.MaTram = t.MaTram
      WHERE dd.MaLT = ? AND dd.TrangThaiXoa = '0'
      ORDER BY t.MaTram
    `;
    db.query(sql, [scheduleId], callback);
  },

  // Tạo điểm danh
  create: (attendanceData, callback) => {
    const sql = "INSERT INTO diemdanh SET ?";
    db.query(sql, attendanceData, callback);
  },

  // Cập nhật trạng thái điểm danh
  updateStatus: (id, status, callback) => {
    const sql = "UPDATE diemdanh SET TrangThai = ?, ThoiGian = NOW() WHERE MaDD = ?";
    db.query(sql, [status, id], callback);
  },

  // Lấy lịch sử điểm danh của học sinh
  getStudentHistory: (studentId, callback) => {
    const sql = `
      SELECT dd.*, lt.NgayChay, lt.GioBatDau, td.TenTuyenDuong
      FROM diemdanh dd
      INNER JOIN lichtrinh lt ON dd.MaLT = lt.MaLT
      INNER JOIN tuyenduong td ON lt.MaTD = td.MaTD
      WHERE dd.MaHS = ? AND dd.TrangThaiXoa = '0'
      ORDER BY lt.NgayChay DESC, lt.GioBatDau DESC
    `;
    db.query(sql, [studentId], callback);
  }
};

export default AttendanceModel;
