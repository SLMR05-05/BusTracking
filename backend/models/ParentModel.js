import db from "../config/db.js";

const ParentModel = {
  // Lấy tất cả phụ huynh
  getAll: (callback) => {
    const sql = `
      SELECT ph.*, tk.TenDangNhap
      FROM phuhuynh ph
      LEFT JOIN taikhoan tk ON ph.MaTK = tk.MaTK
      WHERE ph.TrangThaiXoa = '0'
    `;
    db.query(sql, callback);
  },

  // Lấy phụ huynh theo ID
  findById: (id, callback) => {
    const sql = `
      SELECT ph.*, tk.TenDangNhap
      FROM phuhuynh ph
      LEFT JOIN taikhoan tk ON ph.MaTK = tk.MaTK
      WHERE ph.MaPH = ? AND ph.TrangThaiXoa = '0'
    `;
    db.query(sql, [id], callback);
  },

  // Tạo phụ huynh mới
  create: (parentData, callback) => {
    const sql = "INSERT INTO phuhuynh SET ?";
    db.query(sql, parentData, callback);
  },

  // Cập nhật phụ huynh
  update: (id, parentData, callback) => {
    const sql = "UPDATE phuhuynh SET ? WHERE MaPH = ?";
    db.query(sql, [parentData, id], callback);
  },

  // Xóa mềm phụ huynh
  softDelete: (id, callback) => {
    const sql = "UPDATE phuhuynh SET TrangThaiXoa = '1' WHERE MaPH = ?";
    db.query(sql, [id], callback);
  },

  // Lấy danh sách con của phụ huynh
  getChildren: (parentId, callback) => {
    const sql = `
      SELECT hs.*, t.TenTram, td.TenTuyenDuong
      FROM hocsinh hs
      LEFT JOIN tram t ON hs.MaTram = t.MaTram
      LEFT JOIN tuyenduong td ON t.MaTD = td.MaTD
      WHERE hs.MaPH = ? AND hs.TrangThaiXoa = '0'
    `;
    db.query(sql, [parentId], callback);
  }
};

export default ParentModel;
