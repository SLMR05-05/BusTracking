import DriverModel from "../models/DriverModel.js";

export const getAllDrivers = (req, res) => {
  DriverModel.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const getDriverById = (req, res) => {
  DriverModel.findById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Tài xế không tồn tại" });
    res.json(results[0]);
  });
};

export const createDriver = (req, res) => {
  const driverData = {
    MaTX: req.body.MaTX,
    MaTK: req.body.MaTK || null,
    TenTX: req.body.TenTX,
    SoCCCD: req.body.SoCCCD,
    BLX: req.body.BLX,
    DiaChi: req.body.DiaChi,
    SDT: req.body.SDT,
    TrangThaiXoa: '0'
  };

  DriverModel.create(driverData, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Tạo tài xế thành công", id: result.insertId });
  });
};

export const updateDriver = (req, res) => {
  const driverData = {
    TenTX: req.body.TenTX,
    SoCCCD: req.body.SoCCCD,
    BLX: req.body.BLX,
    DiaChi: req.body.DiaChi,
    SDT: req.body.SDT
  };

  DriverModel.update(req.params.id, driverData, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Tài xế không tồn tại" });
    res.json({ message: "Cập nhật tài xế thành công" });
  });
};

export const deleteDriver = (req, res) => {
  DriverModel.softDelete(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Tài xế không tồn tại" });
    res.json({ message: "Xóa tài xế thành công" });
  });
};

export const getDriverSchedule = (req, res) => {
  const { id } = req.params;
  const { date } = req.query;

  DriverModel.getScheduleByDate(id, date, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
