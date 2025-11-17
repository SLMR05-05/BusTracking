import AttendanceModel from "../models/AttendanceModel.js";

export const getAttendanceBySchedule = (req, res) => {
  AttendanceModel.getBySchedule(req.params.scheduleId, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const createAttendance = (req, res) => {
  const attendanceData = {
    MaDD: req.body.MaDD,
    MaLT: req.body.MaLT,
    MaHS: req.body.MaHS,
    ThoiGian: new Date(),
    TrangThai: req.body.TrangThai || '0',
    TrangThaiXoa: '0'
  };

  AttendanceModel.create(attendanceData, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Tạo điểm danh thành công", id: result.insertId });
  });
};

export const updateAttendanceStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  AttendanceModel.updateStatus(id, status, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Điểm danh không tồn tại" });
    res.json({ message: "Cập nhật trạng thái điểm danh thành công" });
  });
};

export const getStudentAttendanceHistory = (req, res) => {
  AttendanceModel.getStudentHistory(req.params.studentId, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
