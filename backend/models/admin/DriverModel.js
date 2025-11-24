import db from "../../config/db.js";

const DriverModel = {
  // Lấy tất cả tài xế
  getAll: (callback) => {
    const sql = `
      SELECT tx.*, tk.TenDangNhap
      FROM taixe tx
      LEFT JOIN taikhoan tk ON tx.MaTK = tk.MaTK
      WHERE tx.TrangThaiXoa = '0'
      ORDER BY tx.MaTX ASC
    `;
    db.query(sql, callback);
  },


  // Lấy tài xế theo ID
  findById: (id, callback) => {
    const sql = `
      SELECT tx.*, tk.TenDangNhap
      FROM taixe tx
      LEFT JOIN taikhoan tk ON tx.MaTK = tk.MaTK
      WHERE tx.MaTX = ? AND tx.TrangThaiXoa = '0'
    `;
    db.query(sql, [id], callback);
  },

  // Tạo tài xế mới
  create: (driverData, callback) => {
    const sql = "INSERT INTO taixe SET ?";
    db.query(sql, driverData, callback);
  },

  // Cập nhật tài xế
  update: (id, driverData, callback) => {
    const sql = "UPDATE taixe SET ? WHERE MaTX = ?";
    db.query(sql, [driverData, id], callback);
  },

  // Xóa mềm tài xế
  softDelete: (id, callback) => {
    const sql = "UPDATE taixe SET TrangThaiXoa = '1' WHERE MaTX = ?";
    db.query(sql, [id], callback);
  },

  // Lấy lịch trình của tài xế theo ngày
  getScheduleByDate: (driverId, date, callback) => {
    const sql = `
      SELECT lt.*, xb.BienSo, td.TenTuyenDuong
      FROM lichtrinh lt
      INNER JOIN xebuyt xb ON lt.MaXB = xb.MaXB
      INNER JOIN tuyenduong td ON lt.MaTD = td.MaTD
      WHERE lt.MaTX = ? AND lt.NgayChay = ? AND lt.TrangThaiXoa = '0'
    `;
    db.query(sql, [driverId, date], callback);
  },
  getLatestId: (callback) => {
  const sql = `
    SELECT MaTX 
    FROM taixe
    ORDER BY MaTX DESC
    LIMIT 1
  `;
  db.query(sql, callback);
}
};
  // Lấy mã tài xế mới nhất


export default DriverModel;
