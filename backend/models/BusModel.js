import db from "../config/db.js";

const BusModel = {
  // Lấy tất cả xe buýt
  getAll: (callback) => {
    const sql = "SELECT * FROM xebuyt WHERE TrangThaiXoa = '0'";
    db.query(sql, callback);
  },

  // Lấy xe buýt theo ID
  findById: (id, callback) => {
    const sql = "SELECT * FROM xebuyt WHERE MaXB = ? AND TrangThaiXoa = '0'";
    db.query(sql, [id], callback);
  },

  // Tạo xe buýt mới
  create: (busData, callback) => {
    const sql = "INSERT INTO xebuyt SET ?";
    db.query(sql, busData, callback);
  },

  // Cập nhật xe buýt
  update: (id, busData, callback) => {
    const sql = "UPDATE xebuyt SET ? WHERE MaXB = ?";
    db.query(sql, [busData, id], callback);
  },

  // Xóa mềm xe buýt
  softDelete: (id, callback) => {
    const sql = "UPDATE xebuyt SET TrangThaiXoa = '1' WHERE MaXB = ?";
    db.query(sql, [id], callback);
  },

  // Lấy vị trí xe buýt
  getLocation: (busId, callback) => {
    const sql = `
      SELECT vtx.*, xb.BienSo
      FROM vitrixe vtx
      INNER JOIN xebuyt xb ON vtx.MaXB = xb.MaXB
      WHERE vtx.MaXB = ? AND vtx.TrangThaiXoa = '0'
      ORDER BY vtx.MaVTXe DESC
      LIMIT 1
    `;
    db.query(sql, [busId], callback);
  },

  // Cập nhật vị trí xe buýt
  updateLocation: (locationData, callback) => {
    const sql = "INSERT INTO vitrixe SET ?";
    db.query(sql, locationData, callback);
  }
};

export default BusModel;
