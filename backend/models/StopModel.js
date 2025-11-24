import db from "../config/db.js";

const StopModel = {
  getAll: (callback) => {
    const sql = "SELECT * FROM tram"; 
    db.query(sql, callback);
  },

  getById: (id, callback) => {
    const sql = "SELECT * FROM tram WHERE id = ?";
    db.query(sql, [id], callback);
  },

  create: (data, callback) => {
    const sql = "INSERT INTO tram (TenTram, DiaChi) VALUES (?, ?)";
    db.query(sql, [data.TenTram, data.DiaChi], callback);
  },

  update: (id, data, callback) => {
    const sql = "UPDATE tram SET TenTram = ?, DiaChi = ? WHERE id = ?";
    db.query(sql, [data.TenTram, data.DiaChi, id], callback);
  },

  delete: (id, callback) => {
    const sql = "DELETE FROM tram WHERE id = ?";
    db.query(sql, [id], callback);
  }
};

export default StopModel;
