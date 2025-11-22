import db from "../../config/db.js";

/**
 * DashboardModel - các truy vấn phục vụ trang Driver Dashboard / DriverSchedule
 * Sử dụng callback (err, results) giống style project hiện tại.
 */
const DashboardModel = {
  // 1. Lấy thông tin tài xế theo MaTX
  getDriverInfo: (userId, callback) => {
    const sql = `SELECT tx.*, tk.TenDangNhap
                 FROM taixe tx
                 LEFT JOIN taikhoan tk ON tx.MaTK = tk.MaTK
                 WHERE tk.MaTK = ? AND (tx.TrangThaiXoa IS NULL OR tx.TrangThaiXoa = '0')`;
    db.query(sql, [userId], callback);
  },

  // 2. Lấy lịch chạy (lichtrinh) của tài xế theo ngày (dateStr dạng 'YYYY-MM-DD' hoặc null -> lấy tất cả)
  getSchedulesByDriver: (driverId, dateStr, callback) => {
    let sql = `SELECT l.*, x.BienSo, td.TenTuyenDuong
               FROM lichtrinh l
               LEFT JOIN xebuyt x ON l.MaXB = x.MaXB
               LEFT JOIN tuyenduong td ON l.MaTD = td.MaTD
               WHERE l.MaTX = ? AND (l.TrangThaiXoa IS NULL OR l.TrangThaiXoa = '0')`;
    const params = [driverId];

    if (dateStr) {
      // Lưu ý: NgayChay trong schema là varchar, truyền đúng định dạng
      sql += ` AND l.NgayChay = ?`;
      params.push(dateStr);
    }

    sql += ` ORDER BY l.GioBatDau ASC`;
    db.query(sql, params, callback);
  },

  // 3. Lấy chi tiết 1 lịch (lichtrinh) kèm thông tin tuyến, xe, tài xế
  getScheduleDetails: (scheduleId, callback) => {
    const sql = `SELECT l.*, x.BienSo, td.TenTuyenDuong, tx.TenTX
                 FROM lichtrinh l
                 LEFT JOIN xebuyt x ON l.MaXB = x.MaXB
                 LEFT JOIN tuyenduong td ON l.MaTD = td.MaTD
                 LEFT JOIN taixe tx ON l.MaTX = tx.MaTX
                 WHERE l.MaLT = ?`;
    db.query(sql, [scheduleId], callback);
  },

  // 4. Lấy danh sách điểm dừng cho 1 lịch (kèm thông tin trạm và thứ tự)
  getStopsForSchedule: (scheduleId, callback) => {
    const sql = `SELECT ct.MaCTLT, ct.MaLT, ct.MaTram, ct.TrangThaiQua,
                        t.TenTram, t.DiaChi, t.KinhDo, t.ViDo, t.ThuTu
                 FROM chitietlichtrinh ct
                 JOIN tram t ON ct.MaTram = t.MaTram
                 WHERE ct.MaLT = ? AND (ct.TrangThaiXoa IS NULL OR ct.TrangThaiXoa = '0')
                 ORDER BY t.ThuTu ASC, ct.MaCTLT ASC`;
    db.query(sql, [scheduleId], callback);
  },

  // 5. Lấy học sinh theo lịch (các học sinh thuộc các trạm trong lịch)
  getStudentsForSchedule: (scheduleId, callback) => {
    const sql = `SELECT hs.MaHS, hs.TenHS, hs.Lop, hs.MaPH, ph.TenPH, ph.SDT AS SDT_PH, t.MaTram, t.TenTram
                 FROM chitietlichtrinh ct
                 JOIN tram t ON ct.MaTram = t.MaTram
                 JOIN hocsinh hs ON hs.MaTram = t.MaTram AND (hs.TrangThaiXoa IS NULL OR hs.TrangThaiXoa = '0')
                 LEFT JOIN phuhuynh ph ON hs.MaPH = ph.MaPH
                 WHERE ct.MaLT = ?
                 ORDER BY t.ThuTu ASC, hs.TenHS ASC`;
                 
    db.query(sql, [scheduleId], callback);
  },

  // 6. Lấy trạng thái điểm danh (diemdanh) cho lịch
  getAttendanceBySchedule: (scheduleId, callback) => {
    const sql = `SELECT dd.MaDD, dd.MaLT, dd.MaHS, dd.ThoiGian, dd.TrangThai
                 FROM diemdanh dd
                 WHERE dd.MaLT = ?`;
    db.query(sql, [scheduleId], callback);
  },

  // 7. Thêm hoặc cập nhật bản ghi điểm danh (upsert)
  upsertAttendance: (scheduleId, studentId, status, callback) => {
    const findSql = `SELECT MaDD FROM diemdanh WHERE MaLT = ? AND MaHS = ? LIMIT 1`;
    db.query(findSql, [scheduleId, studentId], (err, results) => {
      if (err) return callback(err);
      if (results && results.length > 0) {
        const id = results[0].MaDD;
        const updateSql = `UPDATE diemdanh SET TrangThai = ?, ThoiGian = NOW() WHERE MaDD = ?`;
        db.query(updateSql, [status, id], callback);
      } else {
        const insertSql = `INSERT INTO diemdanh (MaDD, MaLT, MaHS, ThoiGian, TrangThai, TrangThaiXoa)
                           VALUES (UUID(), ?, ?, NOW(), ?, '0')`;
        db.query(insertSql, [scheduleId, studentId, status], callback);
      }
    });
  },

  // 8. Lấy vị trí xe (vitrixe) theo MaXB - trả về bản ghi vị trí (ghi chú: bảng không có timestamp)
  getBusPosition: (busId, callback) => {
    const sql = `SELECT MaVTXe, MaXB, KinhDo, ViDo, TrangThaiXe
                 FROM vitrixe
                 WHERE MaXB = ?
                 ORDER BY MaVTXe DESC
                 LIMIT 1`;
    db.query(sql, [busId], callback);
  },

  // 9. Lấy tóm tắt dashboard: số học sinh, số điểm dừng, trạng thái chuyến
  getScheduleSummary: (scheduleId, callback) => {
    const sql = `
      SELECT 
        (SELECT COUNT(*) FROM chitietlichtrinh ct WHERE ct.MaLT = ?) AS total_stops,
        (SELECT COUNT(*) FROM hocsinh hs 
           JOIN tram t ON hs.MaTram = t.MaTram
           JOIN chitietlichtrinh ct2 ON ct2.MaTram = t.MaTram AND ct2.MaLT = ?
           WHERE hs.TrangThaiXoa = '0') AS total_students,
        (SELECT COUNT(*) FROM diemdanh dd WHERE dd.MaLT = ? AND dd.TrangThai = '1') AS picked_count
    `;
    db.query(sql, [scheduleId, scheduleId, scheduleId], callback);
  }
};

export default DashboardModel;
