import ScheduleModel from "../models/ScheduleModel.js";

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
    NgayChay: req.body.NgayChay,
    GioBatDau: req.body.GioBatDau,
    GioKetThuc: req.body.GioKetThuc,
    TrangThai: req.body.TrangThai || 'pending',
    TrangThaiXoa: '0'
  };

  ScheduleModel.create(scheduleData, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Tạo lịch trình thành công", id: result.insertId });
  });
};

export const updateSchedule = (req, res) => {
  const scheduleData = {
    MaXB: req.body.MaXB,
    MaTD: req.body.MaTD,
    MaTX: req.body.MaTX,
    NgayChay: req.body.NgayChay,
    GioBatDau: req.body.GioBatDau,
    GioKetThuc: req.body.GioKetThuc,
    TrangThai: req.body.TrangThai
  };

  ScheduleModel.update(req.params.id, scheduleData, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Lịch trình không tồn tại" });
    res.json({ message: "Cập nhật lịch trình thành công" });
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
    ThuTu: req.body.ThuTu,
    TrangThaiQua: '0',
    TrangThaiXoa: '0'
  };

  ScheduleModel.addDetail(detailData, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Thêm điểm dừng vào lịch trình thành công" });
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
