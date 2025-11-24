import db from "../../config/db.js";

const NotificationModel = {
  // Lấy thông báo theo phụ huynh
  getByParent: (parentId, callback) => {
    const sql = `
      SELECT tb.*, lt.NgayChay, td.TenTuyenDuong
      FROM thongbao tb
      LEFT JOIN lichtrinh lt ON tb.MaLT = lt.MaLT
      LEFT JOIN tuyenduong td ON lt.MaTD = td.MaTD
      WHERE tb.MaPH = ? AND tb.TrangThaiXoa = '0'
      ORDER BY tb.MaTB DESC
    `;
    db.query(sql, [parentId], callback);
  },

  // Tạo thông báo
  create: (notificationData, callback) => {
    const sql = "INSERT INTO thongbao SET ?";
    db.query(sql, notificationData, callback);
  },

  // Xóa thông báo
  softDelete: (id, callback) => {
    const sql = "UPDATE thongbao SET TrangThaiXoa = '1' WHERE MaTB = ?";
    db.query(sql, [id], callback);
  }
};

export default NotificationModel;
