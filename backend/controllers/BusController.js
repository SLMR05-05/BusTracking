import BusModel from "../models/BusModel.js";

export const getAllBuses = (req, res) => {
  BusModel.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const getBusById = (req, res) => {
  BusModel.findById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Xe buýt không tồn tại" });
    res.json(results[0]);
  });
};

export const createBus = (req, res) => {
  const busData = {
    MaXB: req.body.MaXB,
    BienSo: req.body.BienSo,
    SucChua: req.body.SucChua,
    TrangThai: req.body.TrangThai || 'available',
    TrangThaiXoa: '0'
  };

  BusModel.create(busData, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Tạo xe buýt thành công", id: result.insertId });
  });
};

export const updateBus = (req, res) => {
  const busData = {
    BienSo: req.body.BienSo,
    SucChua: req.body.SucChua,
    TrangThai: req.body.TrangThai
  };

  BusModel.update(req.params.id, busData, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Xe buýt không tồn tại" });
    res.json({ message: "Cập nhật xe buýt thành công" });
  });
};

export const deleteBus = (req, res) => {
  BusModel.softDelete(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Xe buýt không tồn tại" });
    res.json({ message: "Xóa xe buýt thành công" });
  });
};

export const getBusLocation = (req, res) => {
  BusModel.getLocation(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Không tìm thấy vị trí" });
    res.json(results[0]);
  });
};

export const updateBusLocation = (req, res) => {
  const locationData = {
    MaVTXe: req.body.MaVTXe,
    MaXB: req.params.id,
    KinhDo: req.body.KinhDo,
    ViDo: req.body.ViDo,
    TrangThaiXe: req.body.TrangThaiXe || 'running',
    TrangThaiXoa: '0'
  };

  BusModel.updateLocation(locationData, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Cập nhật vị trí thành công" });
  });
};
