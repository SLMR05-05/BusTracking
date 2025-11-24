import StopModel from "../models/StopModel.js";

export const getAllStops = (req, res) => {
  StopModel.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const getStopById = (req, res) => {
  StopModel.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
};

export const createStop = (req, res) => {
  StopModel.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Tạo trạm thành công", id: result.insertId });
  });
};

export const updateStop = (req, res) => {
  StopModel.update(req.params.id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Cập nhật trạm thành công" });
  });
};

export const deleteStop = (req, res) => {
  StopModel.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Xóa trạm thành công" });
  });
};
