import db from "../config/db.js";

const ScheduleModel = {
  // Lấy tất cả lịch trình
  getAll: (callback) => {
    const sql = `
      SELECT lt.*, xb.BienSo, tx.TenTX, td.TenTuyenDuong
      FROM lichtrinh lt
      INNER JOIN xebuyt xb ON lt.MaXB = xb.MaXB
      INNER JOIN taixe tx ON lt.MaTX = tx.MaTX
      INNER JOIN tuyenduong td ON lt.MaTD = td.MaTD
      WHERE lt.TrangThaiXoa = '0'
      ORDER BY lt.NgayChay DESC, lt.GioBatDau
    `;
    db.query(sql, callback);
  },

  // Lấy lịch trình theo ID
  findById: (id, callback) => {
    const sql = `
      SELECT lt.*, xb.BienSo, tx.TenTX, tx.SDT, td.TenTuyenDuong
      FROM lichtrinh lt
      INNER JOIN xebuyt xb ON lt.MaXB = xb.MaXB
      INNER JOIN taixe tx ON lt.MaTX = tx.MaTX
      INNER JOIN tuyenduong td ON lt.MaTD = td.MaTD
      WHERE lt.MaLT = ? AND lt.TrangThaiXoa = '0'
    `;
    db.query(sql, [id], callback);
  },

  // Tạo lịch trình mới
  create: (scheduleData, callback) => {
    const sql = "INSERT INTO lichtrinh SET ?";
    db.query(sql, scheduleData, callback);
  },

  // Cập nhật lịch trình
  update: (id, scheduleData, callback) => {
    const sql = "UPDATE lichtrinh SET ? WHERE MaLT = ?";
    db.query(sql, [scheduleData, id], callback);
  },

  // Xóa mềm lịch trình
  softDelete: (id, callback) => {
    const sql = "UPDATE lichtrinh SET TrangThaiXoa = '1' WHERE MaLT = ?";
    db.query(sql, [id], callback);
  },

  // Lấy lịch trình theo ngày
  getByDate: (date, callback) => {
    const sql = `
      SELECT lt.*, xb.BienSo, tx.TenTX, td.TenTuyenDuong
      FROM lichtrinh lt
      INNER JOIN xebuyt xb ON lt.MaXB = xb.MaXB
      INNER JOIN taixe tx ON lt.MaTX = tx.MaTX
      INNER JOIN tuyenduong td ON lt.MaTD = td.MaTD
      WHERE lt.NgayChay = ? AND lt.TrangThaiXoa = '0'
      ORDER BY lt.GioBatDau
    `;
    db.query(sql, [date], callback);
  },

  // Lấy chi tiết lịch trình (điểm dừng)
  getScheduleDetails: (scheduleId, callback) => {
    const sql = `
      SELECT ctlt.*, t.TenTram, t.DiaChi, t.KinhDo, t.ViDo
      FROM chitietlichtrinh ctlt
      INNER JOIN tram t ON ctlt.MaTram = t.MaTram
      WHERE ctlt.MaLT = ? AND ctlt.TrangThaiXoa = '0'
      ORDER BY ctlt.ThuTu
    `;
    db.query(sql, [scheduleId], callback);
  },

  // Thêm chi tiết lịch trình
  addDetail: (detailData, callback) => {
    const sql = "INSERT INTO chitietlichtrinh SET ?";
    db.query(sql, detailData, callback);
  },

  // Cập nhật trạng thái điểm dừng
  updateStopStatus: (detailId, status, callback) => {
    const sql = "UPDATE chitietlichtrinh SET TrangThaiQua = ? WHERE MaCTLT = ?";
    db.query(sql, [status, detailId], callback);
  }
};

export default ScheduleModel;
