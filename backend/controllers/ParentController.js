import ParentModel from "../models/ParentModel.js";

export const getAllParents = (req, res) => {
  ParentModel.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const getParentById = (req, res) => {
  ParentModel.findById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Phụ huynh không tồn tại" });
    res.json(results[0]);
  });
};

export const createParent = (req, res) => {
  const parentData = {
    MaPH: req.body.MaPH,
    MaTK: req.body.MaTK || null,
    TenPH: req.body.TenPH,
    SDT: req.body.SDT,
    DiaChi: req.body.DiaChi,
    TrangThaiXoa: '0'
  };

  ParentModel.create(parentData, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Tạo phụ huynh thành công", id: result.insertId });
  });
};

export const updateParent = (req, res) => {
  const parentData = {
    TenPH: req.body.TenPH,
    SDT: req.body.SDT,
    DiaChi: req.body.DiaChi
  };

  ParentModel.update(req.params.id, parentData, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Phụ huynh không tồn tại" });
    res.json({ message: "Cập nhật phụ huynh thành công" });
  });
};

export const deleteParent = (req, res) => {
  ParentModel.softDelete(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Phụ huynh không tồn tại" });
    res.json({ message: "Xóa phụ huynh thành công" });
  });
};

export const getParentChildren = (req, res) => {
  ParentModel.getChildren(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
