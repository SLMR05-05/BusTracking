import StudentModel from "../models/StudentModel.js";

export const getAllStudents = (req, res) => {
  StudentModel.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const getStudentById = (req, res) => {
  StudentModel.findById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Học sinh không tồn tại" });
    res.json(results[0]);
  });
};

export const createStudent = (req, res) => {
  const studentData = {
    MaHS: req.body.MaHS,
    MaPH: req.body.MaPH,
    MaTram: req.body.MaTram,
    TenHS: req.body.TenHS,
    Lop: req.body.Lop,
    DiaChi: req.body.DiaChi,
    TrangThaiXoa: '0'
  };

  StudentModel.create(studentData, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Tạo học sinh thành công", id: result.insertId });
  });
};

export const updateStudent = (req, res) => {
  const studentData = {
    MaPH: req.body.MaPH,
    MaTram: req.body.MaTram,
    TenHS: req.body.TenHS,
    Lop: req.body.Lop,
    DiaChi: req.body.DiaChi
  };

  StudentModel.update(req.params.id, studentData, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Học sinh không tồn tại" });
    res.json({ message: "Cập nhật học sinh thành công" });
  });
};

export const deleteStudent = (req, res) => {
  StudentModel.softDelete(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Học sinh không tồn tại" });
    res.json({ message: "Xóa học sinh thành công" });
  });
};

export const getStudentsByRoute = (req, res) => {
  StudentModel.getByRoute(req.params.routeId, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
