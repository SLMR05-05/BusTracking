import db from "../config/db.js";

const StudentModel = {
  // Lấy tất cả học sinh
  getAll: (callback) => {
    const sql = `
      SELECT hs.*, ph.TenPH, ph.SDT as SDT_PhuHuynh, t.TenTram, td.TenTuyenDuong
      FROM hocsinh hs
      LEFT JOIN phuhuynh ph ON hs.MaPH = ph.MaPH
      LEFT JOIN tram t ON hs.MaTram = t.MaTram
      LEFT JOIN tuyenduong td ON t.MaTD = td.MaTD
      WHERE hs.TrangThaiXoa = '0'
    `;
    db.query(sql, callback);
  },

  // Lấy học sinh theo ID
  findById: (id, callback) => {
    const sql = `
      SELECT hs.*, ph.TenPH, ph.SDT as SDT_PhuHuynh, t.TenTram, t.DiaChi as DiaChi_Tram
      FROM hocsinh hs
      LEFT JOIN phuhuynh ph ON hs.MaPH = ph.MaPH
      LEFT JOIN tram t ON hs.MaTram = t.MaTram
      WHERE hs.MaHS = ? AND hs.TrangThaiXoa = '0'
    `;
    db.query(sql, [id], callback);
  },

  // Tạo học sinh mới
  create: (studentData, callback) => {
    const sql = "INSERT INTO hocsinh SET ?";
    db.query(sql, studentData, callback);
  },

  // Cập nhật học sinh
  update: (id, studentData, callback) => {
    const sql = "UPDATE hocsinh SET ? WHERE MaHS = ?";
    db.query(sql, [studentData, id], callback);
  },

  // Xóa mềm học sinh
  softDelete: (id, callback) => {
    const sql = "UPDATE hocsinh SET TrangThaiXoa = '1' WHERE MaHS = ?";
    db.query(sql, [id], callback);
  },

  // Lấy học sinh theo tuyến đường
  getByRoute: (routeId, callback) => {
    const sql = `
      SELECT hs.*, ph.TenPH, ph.SDT, t.TenTram
      FROM hocsinh hs
      INNER JOIN tram t ON hs.MaTram = t.MaTram
      LEFT JOIN phuhuynh ph ON hs.MaPH = ph.MaPH
      WHERE t.MaTD = ? AND hs.TrangThaiXoa = '0'
    `;
    db.query(sql, [routeId], callback);
  },

  // Lấy học sinh theo danh sách trạm
  getByStations: (stationIds, callback) => {
    if (!stationIds || stationIds.length === 0) {
      return callback(null, []);
    }
    
    const placeholders = stationIds.map(() => '?').join(',');
    const sql = `
      SELECT hs.MaHS, hs.TenHS, hs.MaTram
      FROM hocsinh hs
      WHERE hs.MaTram IN (${placeholders}) AND hs.TrangThaiXoa = '0'
    `;
    db.query(sql, stationIds, callback);
  }
};

export default StudentModel;
