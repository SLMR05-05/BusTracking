import RouteModel from "../models/RouteModel.js";

export const getAllRoutes = (req, res) => {
  RouteModel.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const getRouteById = (req, res) => {
  RouteModel.findById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Tuyến đường không tồn tại" });
    res.json(results[0]);
  });
};

export const createRoute = (req, res) => {
  const routeData = {
    MaTD: req.body.MaTD,
    BatDau: req.body.BatDau,
    KetThuc: req.body.KetThuc,
    TenTuyenDuong: req.body.TenTuyenDuong,
    TrangThaiXoa: '0'
  };

  RouteModel.create(routeData, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Tạo tuyến đường thành công", id: result.insertId });
  });
};

export const updateRoute = (req, res) => {
  const routeData = {
    BatDau: req.body.BatDau,
    KetThuc: req.body.KetThuc,
    TenTuyenDuong: req.body.TenTuyenDuong
  };

  RouteModel.update(req.params.id, routeData, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Tuyến đường không tồn tại" });
    res.json({ message: "Cập nhật tuyến đường thành công" });
  });
};

export const deleteRoute = (req, res) => {
  RouteModel.softDelete(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Tuyến đường không tồn tại" });
    res.json({ message: "Xóa tuyến đường thành công" });
  });
};

export const getRouteStops = (req, res) => {
  RouteModel.getStops(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const addRouteStop = (req, res) => {
  const stopData = {
    MaTram: req.body.MaTram,
    MaTD: req.params.id,
    TenTram: req.body.TenTram,
    DiaChi: req.body.DiaChi,
    KinhDo: req.body.KinhDo,
    ViDo: req.body.ViDo,
    ThuTu: req.body.ThuTu || 0,
    TrangThaiXoa: '0'
  };

  RouteModel.addStop(stopData, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Thêm điểm dừng thành công", id: result.insertId });
  });
};

export const updateRouteStop = (req, res) => {
  const stopData = {
    TenTram: req.body.TenTram,
    DiaChi: req.body.DiaChi,
    KinhDo: req.body.KinhDo,
    ViDo: req.body.ViDo,
    ThuTu: req.body.ThuTu
  };

  RouteModel.updateStop(req.params.stopId, stopData, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Điểm dừng không tồn tại" });
    res.json({ message: "Cập nhật điểm dừng thành công" });
  });
};

export const deleteRouteStop = (req, res) => {
  RouteModel.deleteStop(req.params.stopId, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Điểm dừng không tồn tại" });
    res.json({ message: "Xóa điểm dừng thành công" });
  });
};
