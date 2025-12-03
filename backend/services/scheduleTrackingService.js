import db from "../config/db.js";
import { emitAttendanceNotification } from "../socket/socketManager.js";

/**
 * Kiểm tra và cập nhật trạng thái lịch trình dựa trên chi tiết trạm
 * - pending: Chưa qua trạm nào (tất cả TrangThaiQua = '0')
 * - running: Đã qua ít nhất 1 trạm nhưng chưa qua hết
 * - completed: Đã qua hết tất cả các trạm
 */
export const updateScheduleStatus = (scheduleId, callback) => {
  console.log(` [updateScheduleStatus] Bắt đầu kiểm tra lịch trình: ${scheduleId}`);
  
  // Lấy thông tin lịch trình
  const scheduleSql = `
    SELECT MaLT, GioBatDau, GioKetThuc, TrangThai, NgayChay
    FROM lichtrinh
    WHERE MaLT = ?
  `;

  db.query(scheduleSql, [scheduleId], (err, schedules) => {
    if (err) {
      console.error(` [updateScheduleStatus] Lỗi query lịch trình:`, err);
      return callback(err);
    }
    
    if (schedules.length === 0) {
      console.warn(` [updateScheduleStatus] Không tìm thấy lịch trình: ${scheduleId}`);
      return callback(new Error('Không tìm thấy lịch trình'));
    }

    const schedule = schedules[0];
    
    // Kiểm tra trạng thái dựa trên chi tiết lịch trình
    checkScheduleProgress(scheduleId, (checkErr, progress) => {
      if (checkErr) return callback(checkErr);
      
      const { total, passed } = progress;
      let newStatus = schedule.TrangThai;
      
      // Xác định trạng thái mới
      if (total === 0) {
        // Không có trạm nào
        newStatus = 'pending';
      } else if (passed === 0) {
        // Chưa qua trạm nào -> Chờ khởi hành
        newStatus = 'pending';
      } else if (passed > 0 && passed < total) {
        // Đã qua ít nhất 1 trạm nhưng chưa hết -> Đang chạy
        newStatus = 'running';
      } else if (passed === total) {
        // Đã qua hết tất cả trạm -> Hoàn thành
        newStatus = 'completed';
      }
      
      // Cập nhật nếu trạng thái thay đổi
      if (newStatus !== schedule.TrangThai) {
        const updateSql = `UPDATE lichtrinh SET TrangThai = ? WHERE MaLT = ?`;
        
        db.query(updateSql, [newStatus, scheduleId], (updateErr) => {
          if (updateErr) return callback(updateErr);
          
          console.log(` Lịch trình ${scheduleId}: ${schedule.TrangThai} -> ${newStatus} (${passed}/${total} trạm)`);
          
          // Gửi thông báo nếu vừa bắt đầu
          if (newStatus === 'running' && schedule.TrangThai === 'pending') {
            notifyFirstStopParents(scheduleId);
          }
          
          callback(null, { status: newStatus, changed: true });
        });
      } else {
        callback(null, { status: newStatus, changed: false });
      }
    });
  });
};

/**
 * Kiểm tra tiến độ lịch trình (số trạm đã qua / tổng số trạm)
 */
const checkScheduleProgress = (scheduleId, callback) => {
  const sql = `
    SELECT COUNT(*) as total, 
           SUM(CASE WHEN TrangThaiQua = '1' THEN 1 ELSE 0 END) as passed
    FROM chitietlichtrinh
    WHERE MaLT = ? AND TrangThaiXoa = '0'
  `;

  db.query(sql, [scheduleId], (err, results) => {
    if (err) {
      console.error(` [checkScheduleProgress] Lỗi query:`, err);
      return callback(err);
    }
    
    if (!results || results.length === 0) {
      console.warn(` [checkScheduleProgress] Không có kết quả cho lịch trình ${scheduleId}`);
      return callback(null, { total: 0, passed: 0 });
    }
    
    const { total, passed } = results[0];
    const progress = { total: total || 0, passed: passed || 0 };
    console.log(` [checkScheduleProgress] Lịch trình ${scheduleId}: ${progress.passed}/${progress.total} trạm`);
    
    callback(null, progress);
  });
};



/**
 * Gửi thông báo cho phụ huynh có con ở trạm đầu tiên khi lịch trình bắt đầu
 */
const notifyFirstStopParents = (scheduleId) => {
  const sql = `
    SELECT hs.MaHS, hs.TenHS, hs.MaPH, ph.TenPH,
           t.TenTram, td.TenTuyenDuong, t.ThuTu
    FROM chitietlichtrinh ct
    JOIN tram t ON ct.MaTram = t.MaTram
    JOIN lichtrinh lt ON ct.MaLT = lt.MaLT
    JOIN tuyenduong td ON lt.MaTD = td.MaTD
    JOIN hocsinh hs ON hs.MaTram = t.MaTram
    JOIN phuhuynh ph ON hs.MaPH = ph.MaPH
    WHERE ct.MaLT = ? AND t.ThuTu = 1 AND hs.TrangThaiXoa = '0'
  `;

  db.query(sql, [scheduleId], (err, students) => {
    if (err || students.length === 0) return;

    students.forEach((student) => {
      const noiDung = ` Xe buýt ${student.TenTuyenDuong} đã bắt đầu chuyến đi. Sẽ đến ${student.TenTram} sớm nhất.`;
      
      const insertSql = `
        INSERT INTO thongbao (MaTB, MaLT, MaPH, MaHS, NoiDung, LoaiThongBao, ThoiGian, DaDoc, TrangThaiXoa)
        VALUES (UUID(), ?, ?, ?, ?, 'schedule_started', NOW(), '0', '0')
      `;

      db.query(insertSql, [scheduleId, student.MaPH, student.MaHS, noiDung], (insertErr) => {
        if (!insertErr) {
          const notification = {
            MaPH: student.MaPH,
            MaHS: student.MaHS,
            TenHS: student.TenHS,
            NoiDung: noiDung,
            LoaiThongBao: 'schedule_started',
            ThoiGian: new Date(),
            DaDoc: '0'
          };

          emitAttendanceNotification(student.MaPH, notification);
          console.log(` Thông báo bắt đầu cho phụ huynh ${student.MaPH}`);
        }
      });
    });
  });
};

/**
 * Gửi thông báo khi xe đến gần trạm của học sinh
 * Được gọi khi tài xế đánh dấu trạm trước đó đã qua
 */
export const notifyUpcomingStop = (scheduleId, currentStopOrder, callback) => {
  // Tìm trạm tiếp theo (trạm gần nhất chưa qua)
  const nextStopOrder = currentStopOrder + 1;
  
  const sql = `
    SELECT hs.MaHS, hs.TenHS, hs.MaPH, ph.TenPH,
           t.TenTram, td.TenTuyenDuong, t.ThuTu,
           t.DiaChi
    FROM chitietlichtrinh ct
    JOIN tram t ON ct.MaTram = t.MaTram
    JOIN lichtrinh lt ON ct.MaLT = lt.MaLT
    JOIN tuyenduong td ON lt.MaTD = td.MaTD
    JOIN hocsinh hs ON hs.MaTram = t.MaTram
    JOIN phuhuynh ph ON hs.MaPH = ph.MaPH
    WHERE ct.MaLT = ? 
      AND t.ThuTu = ? 
      AND ct.TrangThaiQua = '0'
      AND hs.TrangThaiXoa = '0'
  `;

  db.query(sql, [scheduleId, nextStopOrder], (err, students) => {
    if (err) return callback(err);
    
    if (students.length === 0) {
      return callback(null, { notified: 0 });
    }

    let notified = 0;
    students.forEach((student) => {
      const noiDung = ` Xe buýt đang đến gần ${student.TenTram}! Vui lòng chuẩn bị.`;
      
      const insertSql = `
        INSERT INTO thongbao (MaTB, MaLT, MaPH, MaHS, NoiDung, LoaiThongBao, ThoiGian, DaDoc, TrangThaiXoa)
        VALUES (UUID(), ?, ?, ?, ?, 'approaching_stop', NOW(), '0', '0')
      `;

      db.query(insertSql, [scheduleId, student.MaPH, student.MaHS, noiDung], (insertErr) => {
        if (!insertErr) {
          const notification = {
            MaPH: student.MaPH,
            MaHS: student.MaHS,
            TenHS: student.TenHS,
            NoiDung: noiDung,
            LoaiThongBao: 'approaching_stop',
            ThoiGian: new Date(),
            DaDoc: '0'
          };

          emitAttendanceNotification(student.MaPH, notification);
          notified++;
          console.log(` thông báo xe đến gần cho phụ huynh ${student.MaPH}`);
        }
      });
    });

    callback(null, { notified });
  });
};

/**
 * Tự động kiểm tra và cập nhật trạng thái tất cả lịch trình hôm nay
 */
export const autoUpdateScheduleStatuses = () => {
  const today = new Date().toISOString().split('T')[0];
  
  const sql = `
    SELECT MaLT, TrangThai, GioBatDau
    FROM lichtrinh
    WHERE DATE(NgayChay) = ? AND TrangThai IN ('pending', 'running')
  `;

  db.query(sql, [today], (err, schedules) => {
    if (err) {
      console.error('Lỗi kiểm tra lịch trình:', err);
      return;
    }

    schedules.forEach((schedule) => {
      updateScheduleStatus(schedule.MaLT, (updateErr, result) => {
        if (updateErr) {
          console.error(` Lỗi cập nhật lịch trình ${schedule.MaLT}:`, updateErr);
        } else if (result.status === 'started') {
          console.log(` Lịch trình ${schedule.MaLT} đã tự động bắt đầu`);
        } else if (result.status === 'completed') {
          console.log(` Lịch trình ${schedule.MaLT} đã tự động hoàn thành`);
        }
      });
    });
  });
};
