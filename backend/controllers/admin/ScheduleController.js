import ScheduleModel from "../../models/admin/ScheduleModel.js";
import StudentModel from "../../models/admin/StudentModel.js";
import AttendanceModel from "../../models/admin/AttendanceModel.js";

export const getAllSchedules = (req, res) => {
  ScheduleModel.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const getScheduleById = (req, res) => {
  ScheduleModel.findById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Lịch trình không tồn tại" });
    res.json(results[0]);
  });
};

export const createSchedule = (req, res) => {
  const scheduleData = {
    MaLT: req.body.MaLT,
    MaXB: req.body.MaXB,
    MaTD: req.body.MaTD,
    MaTX: req.body.MaTX,
    NgayChay: req.body.NgayChay, // Format: YYYY-MM-DD
    GioBatDau: req.body.GioBatDau, // Format: HH:MM:SS
    GioKetThuc: req.body.GioKetThuc, // Format: HH:MM:SS
    TrangThai: req.body.TrangThai || 'pending',
    TrangThaiXoa: '0'
  };

  // Kiểm tra trùng lịch trình
  ScheduleModel.checkConflict(scheduleData, null, (err, conflicts) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (conflicts && conflicts.length > 0) {
      const conflict = conflicts[0];
      const conflictType = conflict.MaTX === scheduleData.MaTX ? 'Tài xế' : 'Xe buýt';
      const conflictName = conflict.MaTX === scheduleData.MaTX ? conflict.TenTX : conflict.BienSo;
      
      return res.status(400).json({ 
        error: `${conflictType} ${conflictName} đã có lịch trình vào ngày ${scheduleData.NgayChay} từ ${conflict.GioBatDau} đến ${conflict.GioKetThuc}`,
        conflict: conflict
      });
    }

    // Không có conflict, tạo lịch trình
    ScheduleModel.create(scheduleData, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Tạo lịch trình thành công", id: result.insertId });
    });
  });
};

export const updateSchedule = (req, res) => {
  const scheduleData = {
    MaXB: req.body.MaXB,
    MaTD: req.body.MaTD,
    MaTX: req.body.MaTX,
    NgayChay: req.body.NgayChay, // Format: YYYY-MM-DD
    GioBatDau: req.body.GioBatDau, // Format: HH:MM:SS
    GioKetThuc: req.body.GioKetThuc, // Format: HH:MM:SS
    TrangThai: req.body.TrangThai
  };

  // Kiểm tra trùng lịch trình (loại trừ lịch trình đang sửa)
  ScheduleModel.checkConflict(scheduleData, req.params.id, (err, conflicts) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (conflicts && conflicts.length > 0) {
      const conflict = conflicts[0];
      const conflictType = conflict.MaTX === scheduleData.MaTX ? 'Tài xế' : 'Xe buýt';
      const conflictName = conflict.MaTX === scheduleData.MaTX ? conflict.TenTX : conflict.BienSo;
      
      return res.status(400).json({ 
        error: `${conflictType} ${conflictName} đã có lịch trình vào ngày ${scheduleData.NgayChay} từ ${conflict.GioBatDau} đến ${conflict.GioKetThuc}`,
        conflict: conflict
      });
    }

    // Không có conflict, cập nhật lịch trình
    ScheduleModel.update(req.params.id, scheduleData, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Lịch trình không tồn tại" });
      res.json({ message: "Cập nhật lịch trình thành công" });
    });
  });
};

export const deleteSchedule = (req, res) => {
  ScheduleModel.softDelete(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Lịch trình không tồn tại" });
    res.json({ message: "Xóa lịch trình thành công" });
  });
};

export const getSchedulesByDate = (req, res) => {
  const { date } = req.query;
  
  ScheduleModel.getByDate(date, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const getScheduleDetails = (req, res) => {
  ScheduleModel.getScheduleDetails(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const addScheduleDetail = (req, res) => {
  const detailData = {
    MaCTLT: req.body.MaCTLT,
    MaLT: req.params.id,
    MaTram: req.body.MaTram,
    TrangThaiQua: '0',
    TrangThaiXoa: '0'
  };

  ScheduleModel.addDetail(detailData, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Thêm điểm dừng vào lịch trình thành công" });
  });
};

// Tạo điểm danh cho học sinh trong lịch trình
export const createAttendanceForSchedule = (req, res) => {
  const scheduleId = req.params.id;
  
  // Lấy danh sách trạm trong lịch trình
  ScheduleModel.getScheduleDetails(scheduleId, (err, stations) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (!stations || stations.length === 0) {
      return res.status(400).json({ error: "Lịch trình chưa có trạm nào" });
    }
    
    // Lấy danh sách MaTram
    const stationIds = stations.map(s => s.MaTram);
    
    // Lấy học sinh thuộc các trạm này
    StudentModel.getByStations(stationIds, (err, students) => {
      if (err) return res.status(500).json({ error: err.message });
      
      if (!students || students.length === 0) {
        return res.status(200).json({ 
          message: "Không có học sinh nào thuộc các trạm trong lịch trình",
          count: 0
        });
      }
      
      // Tạo danh sách điểm danh
      const timestamp = Date.now();
      const attendanceList = students.map((student, index) => {
        // Tạo MaDD unique cho mỗi học sinh
        const uniqueId = `${timestamp}${index}`.slice(-10);
        const random = Math.random().toString(36).substr(2, 4);
        return {
          MaDD: `DD${uniqueId}${random}`,
          MaLT: scheduleId,
          MaHS: student.MaHS,
          TrangThai: '0',
          TrangThaiXoa: '0'
        };
      });
      
      // Tạo bản ghi điểm danh hàng loạt
      AttendanceModel.createBulk(attendanceList, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        
        res.status(201).json({ 
          message: `Tạo điểm danh thành công cho ${students.length} học sinh`,
          count: students.length
        });
      });
    });
  });
};

export const updateStopStatus = (req, res) => {
  const { detailId } = req.params;
  const { status } = req.body;

  ScheduleModel.updateStopStatus(detailId, status, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Chi tiết lịch trình không tồn tại" });
    res.json({ message: "Cập nhật trạng thái điểm dừng thành công" });
  });
};

export const deleteScheduleDetails = (req, res) => {
  ScheduleModel.deleteAllDetails(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Xóa chi tiết lịch trình thành công" });
  });
};

// Lấy danh sách điểm danh theo lịch trình
export const getAttendanceBySchedule = (req, res) => {
  const scheduleId = req.params.id;
  
  AttendanceModel.getBySchedule(scheduleId, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
