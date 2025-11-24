import StudentModel from "../../models/admin/StudentModel.js";

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
  StudentModel.getLatestId((errLatest, resultLatest) => {
    if (errLatest) return res.status(500).json({ error: errLatest.message });

    let newMaHS = "HS001";
    if (resultLatest.length > 0) {
      const lastId = resultLatest[0].MaHS;
      const num = parseInt(lastId.slice(2)) + 1;
      newMaHS = "HS" + num.toString().padStart(3, "0");
    }

    const studentData = {
      MaHS: newMaHS,
      MaPH: req.body.MaPH,
      MaTram: req.body.MaTram,
      TenHS: req.body.TenHS,
      Lop: req.body.Lop,
      SDT: req.body.SDT || "",
      TrangThaiXoa: "0",
    };

    StudentModel.create(studentData, (errStudent) => {
      if (errStudent) return res.status(500).json({ error: errStudent.message });
      res.status(201).json({ message: "Tạo học sinh thành công", MaHS: newMaHS });
    });
  });
};


export const updateStudent = (req, res) => {
  const studentData = {
    MaPH: req.body.MaPH,
    MaTram: req.body.MaTram,
    TenHS: req.body.TenHS,
    Lop: req.body.Lop,
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
