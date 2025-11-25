import ParentModel from "../../models/admin/ParentModel.js";
import UserModel from "../../models/admin/UserModel.js";
import db from "../../config/db.js";

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
  const { username, password, TenPH, SDT, DiaChi } = req.body;

  UserModel.getLatestId((errUser, resultUserLatest) => {
    if (errUser) return res.status(500).json({ error: errUser.message });

    let newMaTK = "TK001";
    if (resultUserLatest.length > 0) {
      const lastId = resultUserLatest[0].MaTK; 
      const num = parseInt(lastId.slice(2)) + 1;
      newMaTK = "TK" + num.toString().padStart(3, "0");
    }
    const userData = {
      MaTK: newMaTK,         
      MaVT: "PH",
      TenDangNhap: username,
      MatKhau: password || "12345",
      TrangThaiXoa: "0"
    };

    UserModel.create(userData, (errCreateUser) => {
      if (errCreateUser) return res.status(500).json({ error: errCreateUser.message });

      ParentModel.getLatestId((errLatest, resultLatest) => {
        if (errLatest) return res.status(500).json({ error: errLatest.message });

        let newMaPH = "PH001";
        if (resultLatest.length > 0) {
          const lastId = resultLatest[0].MaPH;
          const num = parseInt(lastId.slice(2)) + 1;
          newMaPH = "PH" + num.toString().padStart(3, "0");
        }

        const parentData = {
          MaTK: newMaTK,      
          MaPH: newMaPH,
          TenPH,
          SDT,
          DiaChi,
          TrangThaiXoa: "0"
        };

        ParentModel.create(parentData, (errParent) => {
          if (errParent) return res.status(500).json({ error: errParent.message });

          res.status(201).json({
            message: "Tạo phụ huynh + tài khoản thành công",
            MaTK: newMaTK,
            MaPH: newMaPH,
            username,
            password: password || "12345"
          });
        });
      });
    });
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
  const parentId = req.params.id;

  // 1. Lấy MaTK từ tài xế
  const sql = "SELECT MaTK FROM phuhuynh WHERE MaPH = ?";
  db.query(sql, [parentId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) {
      return res.status(404).json({ message: "Phụ huynh không tồn tại" });
    }

    const maTK = result[0].MaTK;
    
    // 2. Xóa tài xế
    ParentModel.softDelete(parentId, (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });

      // 3. Xóa tài khoản
      UserModel.softDelete(maTK, (err3) => {
        if (err3) return res.status(500).json({ error: err3.message });

        res.json({ message: "Xóa phụ huynh + tài khoản thành công" });
      });
    });
  });
};

export const getParentChildren = (req, res) => {
  ParentModel.getChildren(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Lấy thông tin phụ huynh hiện tại từ token
export const getCurrentParent = (req, res) => {
  console.log('[getCurrentParent] Called with user:', req.user);
  // JWT payload uses userId (created in UserController.login). Use userId for consistency.
  const userId = req.user.userId || req.user.MaTK;
  
  const sql = `
    SELECT ph.*, tk.TenDangNhap
    FROM phuhuynh ph
    INNER JOIN taikhoan tk ON ph.MaTK = tk.MaTK
    WHERE ph.MaTK = ? AND ph.TrangThaiXoa = '0'
  `;
  
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.log('[getCurrentParent] Error:', err.message);
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      console.log('[getCurrentParent] No parent found for userId:', userId);
      return res.status(404).json({ message: "Phụ huynh không tồn tại" });
    }
    console.log('[getCurrentParent] Success, found parent:', results[0].MaPH);
    res.json(results[0]);
  });
};

// Lấy danh sách con của phụ huynh hiện tại kèm thông tin trạm
export const getCurrentParentStudents = (req, res) => {
  console.log('[getCurrentParentStudents] Called with user:', req.user);
  // Support both userId (from JWT) or legacy MaTK in token payload
  const userId = req.user.userId || req.user.MaTK;
  
  // Test query đơn giản trước
  const testSql = `SELECT * FROM phuhuynh WHERE MaTK = ?`;
  db.query(testSql, [userId], (err, parentResults) => {
    if (err) {
      console.log('[getCurrentParentStudents] Error finding parent:', err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log('[getCurrentParentStudents] Parent found:', parentResults);
    
    if (parentResults.length === 0) {
      console.log('[getCurrentParentStudents] No parent found for userId:', userId);
      return res.json([]);
    }
    
    const parentId = parentResults[0].MaPH;
    console.log('[getCurrentParentStudents] Parent ID:', parentId);
    
    // Query học sinh (bỏ điều kiện TrangThaiXoa để test)
    const sql = `
      SELECT hs.*, t.TenTram, t.DiaChi as DiaChiTram, t.MaTD, td.TenTuyenDuong
      FROM hocsinh hs
      LEFT JOIN tram t ON hs.MaTram = t.MaTram
      LEFT JOIN tuyenduong td ON t.MaTD = td.MaTD
      WHERE hs.MaPH = ?
    `;
    
    db.query(sql, [parentId], (err, results) => {
      if (err) {
        console.log('[getCurrentParentStudents] Error:', err.message);
        return res.status(500).json({ error: err.message });
      }
      console.log('[getCurrentParentStudents] Found students:', results.length);
      console.log('[getCurrentParentStudents] Students data:', results);
      res.json(results);
    });
  });
};
