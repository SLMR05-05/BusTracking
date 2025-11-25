import DashboardModel from "../../models/driver/DashBoardModel.js";
import db from "../../config/db.js";
import { createAttendanceNotification, createStopPassedNotification } from "../../services/notificationService.js";

/**
 * DashboardController - xử lý logic cho Driver Dashboard
 */

// 1. Lấy thông tin tài xế
export const getDriverInfo = (req, res) => {
  // ✅ Sửa: req.user.userId (từ JWT)
  const maTK = req.user.userId;

  console.log('🔍 [getDriverInfo] MaTK từ token:', maTK);

  DashboardModel.getDriverInfo(maTK, (err, results) => {
    if (err) {
      console.error('❌ [getDriverInfo] Lỗi:', err);
      return res.status(500).json({ message: "Lỗi lấy thông tin tài xế", error: err });
    }
    console.log('📋 [getDriverInfo] Kết quả:', results);
    if (results.length === 0) {
      console.warn('⚠️ [getDriverInfo] Không tìm thấy tài xế với MaTK:', maTK);
      return res.status(404).json({ message: "Không tìm thấy tài xế" });
    }
    res.json(results[0]);
  });
};

// 2. Lấy lịch chạy của tài xế (hôm nay hoặc ngày chỉ định)
export const getSchedules = (req, res) => {
  const maTK = req.user.userId; // Lấy MaTK từ Token
  const { date } = req.query;

  console.log('🔍 [getSchedules] MaTK từ token:', maTK);
  console.log('🔍 [getSchedules] Date filter:', date);

  // B1: Tìm thông tin Tài xế từ MaTK
  DashboardModel.getDriverInfo(maTK, (err, driverInfo) => {
    if (err) {
      console.error('❌ [getSchedules] Lỗi getDriverInfo:', err);
      return res.status(500).json({ message: "Lỗi server", error: err });
    }
    
    console.log('📋 [getSchedules] Driver info:', driverInfo);
    
    // Nếu tài khoản này không phải là tài xế
    if (!driverInfo || driverInfo.length === 0) {
      console.warn('⚠️ [getSchedules] Không tìm thấy tài xế với MaTK:', maTK);
      return res.status(404).json({ message: "Không tìm thấy hồ sơ tài xế cho tài khoản này" });
    }

    const maTX = driverInfo[0].MaTX; // Lấy MaTX thực sự
    console.log('✅ [getSchedules] MaTX:', maTX);

    // B2: Dùng MaTX để lấy lịch trình
    DashboardModel.getSchedulesByDriver(maTX, date || null, (scheduleErr, results) => {
      if (scheduleErr) {
        console.error('❌ [getSchedules] Lỗi getSchedulesByDriver:', scheduleErr);
        return res.status(500).json({ message: "Lỗi lấy lịch chạy", error: scheduleErr });
      }
      console.log('📅 [getSchedules] Số lịch tìm thấy:', results?.length || 0);
      console.log('📅 [getSchedules] Dữ liệu:', results);
      res.json(results || []);
    });
  });
};

// 3. Lấy chi tiết 1 lịch chạy
export const getScheduleDetail = (req, res) => {
  const { scheduleId } = req.params;

  DashboardModel.getScheduleDetails(scheduleId, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi lấy chi tiết lịch", error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy lịch" });
    }
    res.json(results[0]);
  });
};

// 4. Lấy danh sách điểm dừng của 1 lịch
export const getStops = (req, res) => {
  const { scheduleId } = req.params;

  DashboardModel.getStopsForSchedule(scheduleId, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi lấy danh sách điểm dừng", error: err });
    }
    res.json(results || []);
  });
};

// 5. Lấy danh sách học sinh cho 1 lịch
export const getStudents = (req, res) => {
  const { scheduleId } = req.params;

  DashboardModel.getStudentsForSchedule(scheduleId, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi lấy danh sách học sinh", error: err });
    }
    res.json(results || []);
  });
};

// 6. Lấy trạng thái điểm danh của 1 lịch
export const getAttendance = (req, res) => {
  const { scheduleId } = req.params;

  DashboardModel.getAttendanceBySchedule(scheduleId, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi lấy trạng thái điểm danh", error: err });
    }
    res.json(results || []);
  });
};

// 7. Cập nhật trạng thái điểm danh học sinh
export const updateAttendance = (req, res) => {
  const { scheduleId, studentId } = req.params;
  const { status } = req.body; // status: '0' (chưa hoàn thành), '2' (hoàn thành)

  // Chỉ cho phép 2 trạng thái
  if (!status || !['0', '2'].includes(status)) {
    return res.status(400).json({ message: "Trạng thái không hợp lệ. Chỉ chấp nhận '0' hoặc '2'" });
  }

  DashboardModel.upsertAttendance(scheduleId, studentId, status, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi cập nhật điểm danh", error: err });
    }

    console.log(`📝 [updateAttendance] Điểm danh: scheduleId=${scheduleId}, studentId=${studentId}, status=${status}`);

    // Tạo thông báo cho phụ huynh
    createAttendanceNotification(scheduleId, studentId, status, (notifErr, notification) => {
      if (notifErr) {
        console.error('⚠️ Lỗi tạo thông báo:', notifErr);
      } else {
        console.log('✅ Đã tạo thông báo:', notification);
      }
    });

    // Tự động cập nhật trạng thái lịch trình
    const updateStatusSql = `
      UPDATE lichtrinh lt
      SET TrangThai = (
        CASE 
          WHEN (
            SELECT COUNT(*) 
            FROM diemdanh dd 
            WHERE dd.MaLT = lt.MaLT AND dd.TrangThaiXoa = '0' AND dd.TrangThai = '2'
          ) = (
            SELECT COUNT(*) 
            FROM diemdanh dd 
            WHERE dd.MaLT = lt.MaLT AND dd.TrangThaiXoa = '0'
          ) AND (
            SELECT COUNT(*) 
            FROM diemdanh dd 
            WHERE dd.MaLT = lt.MaLT AND dd.TrangThaiXoa = '0'
          ) > 0
          THEN 'completed'
          ELSE 'pending'
        END
      )
      WHERE lt.MaLT = ?
    `;
    
    db.query(updateStatusSql, [scheduleId], (updateErr) => {
      if (updateErr) {
        console.error('⚠️ Lỗi cập nhật trạng thái lịch trình:', updateErr);
      }
    });

    res.json({ message: "Cập nhật điểm danh thành công", data: results });
  });
};

// 8. Lấy vị trí xe hiện tại
export const getBusLocation = (req, res) => {
  const { busId } = req.params;

  DashboardModel.getBusPosition(busId, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi lấy vị trí xe", error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy vị trí xe" });
    }
    res.json(results[0]);
  });
};

// 9. Lấy tóm tắt dashboard (tổng điểm dừng, học sinh, v.v)
export const getSummary = (req, res) => {
  const { scheduleId } = req.params;

  DashboardModel.getScheduleSummary(scheduleId, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi lấy tóm tắt", error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy dữ liệu" });
    }
    res.json(results[0]);
  });
};

// 10. Kiểm tra quyền chạy lịch trình
export const checkSchedulePermission = (req, res) => {
  const { scheduleId } = req.params;

  // Không kiểm tra ngày - tài xế có thể chạy bất kỳ lúc nào
  const sql = `
    SELECT 
      DATE_FORMAT(lt.NgayChay, '%Y-%m-%d') as NgayChay,
      lt.TrangThai,
      COUNT(CASE WHEN dd.TrangThai = '2' THEN 1 END) as completedAttendance
    FROM lichtrinh lt
    LEFT JOIN diemdanh dd ON lt.MaLT = dd.MaLT AND dd.TrangThaiXoa = '0'
    WHERE lt.MaLT = ? AND lt.TrangThaiXoa = '0'
    GROUP BY lt.MaLT
  `;

  db.query(sql, [scheduleId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi kiểm tra quyền", error: err });
    }
    if (results.length === 0) {
      return res.json({ canRun: false, reason: 'Lịch trình không tồn tại' });
    }

    const schedule = results[0];
    const hasStarted = schedule.completedAttendance > 0;
    
    // Luôn cho phép chạy
    const canRun = true;

    console.log('🔍 [checkSchedulePermission] Schedule Date:', schedule.NgayChay);
    console.log('🔍 [checkSchedulePermission] Has Started:', hasStarted);
    console.log('🔍 [checkSchedulePermission] Can Run:', canRun);

    res.json({
      canRun,
      reason: null,
      hasStarted,
      status: schedule.TrangThai,
      scheduleDate: schedule.NgayChay
    });
  });
};

// 11. Lấy tiến độ lịch trình
export const getProgress = (req, res) => {
  const { scheduleId } = req.params;

  const sql = `
    SELECT 
      COUNT(DISTINCT ctlt.MaCTLT) as totalStops,
      SUM(CASE WHEN ctlt.TrangThaiQua = '1' THEN 1 ELSE 0 END) as completedStops,
      COUNT(DISTINCT dd.MaDD) as totalStudents,
      SUM(CASE WHEN dd.TrangThai = '2' THEN 1 ELSE 0 END) as completedStudents
    FROM lichtrinh lt
    LEFT JOIN chitietlichtrinh ctlt ON lt.MaLT = ctlt.MaLT AND ctlt.TrangThaiXoa = '0'
    LEFT JOIN diemdanh dd ON lt.MaLT = dd.MaLT AND dd.TrangThaiXoa = '0'
    WHERE lt.MaLT = ? AND lt.TrangThaiXoa = '0'
    GROUP BY lt.MaLT
  `;

  db.query(sql, [scheduleId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi lấy tiến độ", error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy dữ liệu" });
    }
    res.json(results[0]);
  });
};

// 12. Báo cáo sự cố
export const createIncident = (req, res) => {
  const { description, scheduleId, busId } = req.body;
  const maTK = req.user.userId;

  if (!description) {
    return res.status(400).json({ message: 'Nội dung sự cố là bắt buộc' });
  }

  // Lấy MaTX từ MaTK
  DashboardModel.getDriverInfo(maTK, (err, driverInfo) => {
    if (err || !driverInfo || driverInfo.length === 0) {
      return res.status(500).json({ message: 'Không tìm thấy thông tin tài xế' });
    }

    const maTX = driverInfo[0].MaTX;
    const maCB = `CB${Date.now()}`;

    const sql = `
      INSERT INTO canhbaosuco (MaCB, MaLT, MaTX, NoiDungSuCo, TrangThaiXoa)
      VALUES (?, ?, ?, ?, '0')
    `;

    db.query(sql, [maCB, scheduleId, maTX, description], (insertErr, result) => {
      if (insertErr) {
        console.error('❌ Lỗi tạo báo cáo sự cố:', insertErr);
        return res.status(500).json({ message: 'Lỗi tạo báo cáo sự cố', error: insertErr });
      }

      console.log(`✅ Tài xế ${maTX} đã báo cáo sự cố: ${description}`);
      res.status(201).json({
        message: 'Báo cáo sự cố thành công',
        MaCB: maCB
      });
    });
  });
};
