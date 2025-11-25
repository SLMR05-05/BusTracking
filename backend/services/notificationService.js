import db from "../config/db.js";
import { emitAttendanceNotification, emitAdminUpdate } from "../socket/socketManager.js";

/**
 * Tạo thông báo khi điểm danh học sinh
 */
export const createAttendanceNotification = (scheduleId, studentId, status, callback) => {
  // Lấy thông tin học sinh và phụ huynh
  const sql = `
    SELECT hs.MaHS, hs.TenHS, hs.MaPH, ph.TenPH, 
           lt.MaLT, td.TenTuyenDuong, t.TenTram
    FROM hocsinh hs
    JOIN phuhuynh ph ON hs.MaPH = ph.MaPH
    JOIN tram t ON hs.MaTram = t.MaTram
    JOIN lichtrinh lt ON lt.MaLT = ?
    JOIN tuyenduong td ON lt.MaTD = td.MaTD
    WHERE hs.MaHS = ?
  `;

  db.query(sql, [scheduleId, studentId], (err, results) => {
    if (err || results.length === 0) {
      return callback(err || new Error('Không tìm thấy thông tin'));
    }

    const info = results[0];
    let noiDung = '';
    let loaiThongBao = 'attendance';

    if (status === '2') {
      noiDung = `Con ${info.TenHS} đã được đón tại ${info.TenTram} - ${info.TenTuyenDuong}`;
    } else if (status === '0') {
      noiDung = `Con ${info.TenHS} chưa được đón tại ${info.TenTram} - ${info.TenTuyenDuong}`;
    }

    // Tạo thông báo trong database
    const insertSql = `
      INSERT INTO thongbao (MaTB, MaLT, MaPH, MaHS, NoiDung, LoaiThongBao, ThoiGian, DaDoc, TrangThaiXoa)
      VALUES (UUID(), ?, ?, ?, ?, ?, NOW(), '0', '0')
    `;

    db.query(insertSql, [scheduleId, info.MaPH, studentId, noiDung, loaiThongBao], (insertErr, insertResult) => {
      if (insertErr) {
        return callback(insertErr);
      }

      // Emit realtime notification
      const notification = {
        MaTB: insertResult.insertId,
        MaLT: scheduleId,
        MaPH: info.MaPH,
        MaHS: studentId,
        TenHS: info.TenHS,
        NoiDung: noiDung,
        LoaiThongBao: loaiThongBao,
        ThoiGian: new Date(),
        DaDoc: '0'
      };

      emitAttendanceNotification(info.MaPH, notification);
      emitAdminUpdate({ type: 'attendance', data: notification });

      callback(null, notification);
    });
  });
};

/**
 * Tạo thông báo khi xe qua trạm
 */
export const createStopPassedNotification = (scheduleId, stopId, callback) => {
  // Lấy danh sách học sinh tại trạm này
  const sql = `
    SELECT hs.MaHS, hs.TenHS, hs.MaPH, ph.TenPH,
           t.TenTram, td.TenTuyenDuong,
           dd.TrangThai as AttendanceStatus
    FROM hocsinh hs
    JOIN phuhuynh ph ON hs.MaPH = ph.MaPH
    JOIN tram t ON hs.MaTram = t.MaTram
    JOIN lichtrinh lt ON lt.MaLT = ?
    JOIN tuyenduong td ON lt.MaTD = td.MaTD
    LEFT JOIN diemdanh dd ON dd.MaHS = hs.MaHS AND dd.MaLT = ?
    WHERE t.MaTram = ? AND hs.TrangThaiXoa = '0'
  `;

  db.query(sql, [scheduleId, scheduleId, stopId], (err, students) => {
    if (err) return callback(err);

    const notifications = [];
    let completed = 0;

    students.forEach((student) => {
      const isPickedUp = student.AttendanceStatus === '2';
      const noiDung = isPickedUp
        ? `Xe đã qua ${student.TenTram}. Con ${student.TenHS} đã lên xe.`
        : `Xe đã qua ${student.TenTram}. Con ${student.TenHS} CHƯA lên xe!`;

      // Lưu loại thông báo chi tiết: stop_passed_success hoặc stop_passed_missed
      const loaiThongBao = isPickedUp ? 'stop_passed_success' : 'stop_passed_missed';

      const insertSql = `
        INSERT INTO thongbao (MaTB, MaLT, MaPH, MaHS, NoiDung, LoaiThongBao, ThoiGian, DaDoc, TrangThaiXoa)
        VALUES (UUID(), ?, ?, ?, ?, ?, NOW(), '0', '0')
      `;

      db.query(insertSql, [scheduleId, student.MaPH, student.MaHS, noiDung, loaiThongBao], (insertErr) => {
        if (!insertErr) {
          const notification = {
            MaPH: student.MaPH,
            MaHS: student.MaHS,
            TenHS: student.TenHS,
            NoiDung: noiDung,
            LoaiThongBao: loaiThongBao,
            ThoiGian: new Date(),
            IsPickedUp: isPickedUp
          };

          notifications.push(notification);
          emitAttendanceNotification(student.MaPH, notification);
        }

        completed++;
        if (completed === students.length) {
          callback(null, notifications);
        }
      });
    });

    if (students.length === 0) {
      callback(null, []);
    }
  });
};
