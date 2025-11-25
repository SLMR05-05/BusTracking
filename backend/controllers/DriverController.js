import DriverModel from "../models/DriverModel.js";
import UserModel from "../models/UserModel.js";
import db from "../config/db.js";
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
  const { username, password, TenTX, SDT, SCCCD, BangLai, DiaChi } = req.body;

  // 1. Lấy mã tài khoản mới nhất
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
      MaVT: "TX",
      TenDangNhap: username,
      MatKhau: password || "12345",
      TrangThaiXoa: "0"
    };

    // 2. Tạo tài khoản
    UserModel.create(userData, (errCreateUser) => {
      if (errCreateUser) return res.status(500).json({ error: errCreateUser.message });

      // 3. Sinh mã tài xế
      DriverModel.getLatestId((errLatest, resultLatest) => {
        if (errLatest) return res.status(500).json({ error: errLatest.message });

        let newMaTX = "TX001";
        if (resultLatest.length > 0) {
          const lastId = resultLatest[0].MaTX;
          const num = parseInt(lastId.slice(2)) + 1;
          newMaTX = "TX" + num.toString().padStart(3, "0");
        }

        const driverData = {
          MaTK: newMaTK,      
          MaTX: newMaTX,
          TenTX,
          SDT,
          SCCCD,
          BangLai,
          DiaChi,
          TrangThaiXoa: "0"
        };

        // 4. Tạo tài xế
        DriverModel.create(driverData, (errDriver) => {
          if (errDriver) return res.status(500).json({ error: errDriver.message });

          res.status(201).json({
            message: "Tạo tài xế + tài khoản thành công",
            MaTX: newMaTX,
            MaTK: newMaTK,
            username,
            password: password || "12345"
          });
        });
      });
    });
  });
};

export const updateDriver = (req, res) => {
  const driverData = {
    TenTX: req.body.TenTX,
    SCCCD: req.body.SCCCD,
    BangLai: req.body.BangLai,
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
  const driverId = req.params.id;

  // 1. Lấy MaTK từ tài xế
  const sql = "SELECT MaTK FROM taixe WHERE MaTX = ?";
  db.query(sql, [driverId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) {
      return res.status(404).json({ message: "Tài xế không tồn tại" });
    }

    const maTK = result[0].MaTK;

    // 2. Xóa tài xế
    DriverModel.softDelete(driverId, (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });

      // 3. Xóa tài khoản
      UserModel.softDelete(maTK, (err3) => {
        if (err3) return res.status(500).json({ error: err3.message });

        res.json({ message: "Xóa tài xế + tài khoản thành công" });
      });
    });
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

// API để fix tài xế không có MaTK
export const fixDriverAccount = (req, res) => {
  const { driverId, accountId } = req.body;
  
  if (!driverId || !accountId) {
    return res.status(400).json({ message: "Thiếu thông tin driverId hoặc accountId" });
  }
  
  const sql = "UPDATE taixe SET MaTK = ? WHERE MaTX = ?";
  db.query(sql, [accountId, driverId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy tài xế" });
    }
    res.json({ message: "Cập nhật MaTK cho tài xế thành công" });
  });
};

