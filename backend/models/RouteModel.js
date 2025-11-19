import db from "../config/db.js";

const RouteModel = {
  // Lấy tất cả tuyến đường
  getAll: (callback) => {
    const sql = "SELECT * FROM tuyenduong WHERE TrangThaiXoa = '0'";
    db.query(sql, callback);
  },

  // Lấy tuyến đường theo ID
  findById: (id, callback) => {
    const sql = "SELECT * FROM tuyenduong WHERE MaTD = ? AND TrangThaiXoa = '0'";
    db.query(sql, [id], callback);
  },

  // Tạo tuyến đường mới
  create: (routeData, callback) => {
    const sql = "INSERT INTO tuyenduong SET ?";
    db.query(sql, routeData, callback);
  },

  // Cập nhật tuyến đường
  update: (id, routeData, callback) => {
    const sql = "UPDATE tuyenduong SET ? WHERE MaTD = ?";
    db.query(sql, [routeData, id], callback);
  },

  // Xóa mềm tuyến đường
  softDelete: (id, callback) => {
    const sql = "UPDATE tuyenduong SET TrangThaiXoa = '1' WHERE MaTD = ?";
    db.query(sql, [id], callback);
  },

  // Lấy điểm dừng của tuyến đường
  getStops: (routeId, callback) => {
    const sql = `
      SELECT * FROM tram 
      WHERE MaTD = ? AND TrangThaiXoa = '0'
      ORDER BY ThuTu, MaTram
    `;
    db.query(sql, [routeId], callback);
  },

  // Thêm điểm dừng
  addStop: (stopData, callback) => {
    const sql = "INSERT INTO tram SET ?";
    db.query(sql, stopData, callback);
  },

  // Cập nhật điểm dừng
  updateStop: (stopId, stopData, callback) => {
    const sql = "UPDATE tram SET ? WHERE MaTram = ?";
    db.query(sql, [stopData, stopId], callback);
  },

  // Xóa điểm dừng
  deleteStop: (stopId, callback) => {
    const sql = "UPDATE tram SET TrangThaiXoa = '1' WHERE MaTram = ?";
    db.query(sql, [stopId], callback);
  }
};

export default RouteModel;
