import db from "../config/db.js";

const StopModel = {
  getAll: (callback) => {
    const sql = `
      SELECT t.*, td.TenTuyenDuong 
      FROM tram t
      LEFT JOIN tuyenduong td ON t.MaTD = td.MaTD
      WHERE t.TrangThaiXoa = '0'
      ORDER BY t.MaTD, t.ThuTu
    `; 
    db.query(sql, callback);
  },

  getById: (id, callback) => {
    const sql = "SELECT * FROM tram WHERE MaTram = ? AND TrangThaiXoa = '0'";
    db.query(sql, [id], callback);
  },

  create: (data, callback) => {
    const sql = "INSERT INTO tram (MaTram, TenTram, DiaChi, ViDo, KinhDo, MaTD, ThuTu, TrangThaiXoa) VALUES (?, ?, ?, ?, ?, ?, ?, '0')";
    db.query(sql, [
      data.MaTram, 
      data.TenTram, 
      data.DiaChi, 
      data.ViDo || null, 
      data.KinhDo || null,
      data.MaTD || null,
      data.ThuTu || 0
    ], callback);
  },

  update: (id, data, callback) => {
    const sql = "UPDATE tram SET TenTram = ?, DiaChi = ?, ViDo = ?, KinhDo = ?, MaTD = ?, ThuTu = ? WHERE MaTram = ?";
    db.query(sql, [
      data.TenTram, 
      data.DiaChi, 
      data.ViDo || null, 
      data.KinhDo || null,
      data.MaTD || null,
      data.ThuTu || 0,
      id
    ], callback);
  },

  delete: (id, callback) => {
    // Soft delete
    const sql = "UPDATE tram SET TrangThaiXoa = '1' WHERE MaTram = ?";
    db.query(sql, [id], callback);
  },

  // Kiểm tra xem trạm có đang được sử dụng trong lịch trình không
  checkStopUsage: (id, callback) => {
    const sql = `
      SELECT COUNT(*) as count 
      FROM chitietlichtrinh 
      WHERE MaTram = ? AND TrangThaiXoa = '0'
    `;
    db.query(sql, [id], callback);
  },

  // Lấy mã trạm mới nhất để tự sinh mã
  getLatestId: (callback) => {
    const sql = `
      SELECT MaTram 
      FROM tram 
      WHERE MaTram LIKE 'T%' AND MaTram REGEXP '^T[0-9]+$'
      ORDER BY CAST(SUBSTRING(MaTram, 2) AS UNSIGNED) DESC 
      LIMIT 1
    `;
    db.query(sql, callback);
  }
};

export default StopModel;
