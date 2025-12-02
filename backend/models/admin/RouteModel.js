import db from "../../config/db.js";

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
    // Build dynamic SQL query để chỉ cập nhật các trường được cung cấp
    const fields = Object.keys(stopData);
    if (fields.length === 0) {
      return callback(new Error('No fields to update'));
    }
    
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => stopData[field]);
    values.push(stopId);
    
    const sql = `UPDATE tram SET ${setClause} WHERE MaTram = ?`;
    console.log(`🔍 [RouteModel.updateStop] SQL:`, sql, 'Values:', values);
    
    db.query(sql, values, callback);
  },

  // Xóa điểm dừng
  deleteStop: (stopId, callback) => {
    const sql = "UPDATE tram SET TrangThaiXoa = '1' WHERE MaTram = ?";
    db.query(sql, [stopId], callback);
  },

  // Lấy số thứ tự lớn nhất của tuyến đường
  getMaxThuTu: (routeId, callback) => {
    const sql = `
      SELECT MAX(ThuTu) as maxThuTu 
      FROM tram 
      WHERE MaTD = ? AND TrangThaiXoa = '0'
    `;
    db.query(sql, [routeId], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  // Kiểm tra xem trạm có đang được sử dụng trong lịch trình không
  checkStopUsageInSchedule: (stopId, callback) => {
    const sql = `
      SELECT COUNT(*) as count 
      FROM chitietlichtrinh 
      WHERE MaTram = ? AND TrangThaiXoa = '0'
    `;
    db.query(sql, [stopId], callback);
  },

  // Lấy mã tuyến đường mới nhất để tự sinh mã
  getLatestId: (callback) => {
    const sql = `
      SELECT MaTD 
      FROM tuyenduong 
      WHERE MaTD LIKE 'TD%'
      ORDER BY MaTD DESC 
      LIMIT 1
    `;
    db.query(sql, callback);
  }
};

export default RouteModel;
