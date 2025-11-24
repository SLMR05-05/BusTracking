import DashboardModel from "../../models/driver/DashBoardModel.js";

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
  const { status } = req.body; // status: '0' (chưa đón), '1' (đã đón), '2' (đã trả)

  if (!status) {
    return res.status(400).json({ message: "Thiếu thông tin trạng thái" });
  }

  DashboardModel.upsertAttendance(scheduleId, studentId, status, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi cập nhật điểm danh", error: err });
    }
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
