import db from "../../config/db.js";

export const getAllIncidents = (req, res) => {
  const sql = `
    SELECT 
      cb.MaCB,
      cb.MaLT,
      cb.MaTX,
      cb.NoiDungSuCo,
      cb.TrangThaiXoa,
      lt.MaTD,
      td.TenTuyenDuong,
      tx.TenTX,
      xb.BienSo
    FROM canhbaosuco cb
    LEFT JOIN lichtrinh lt ON cb.MaLT = lt.MaLT
    LEFT JOIN tuyenduong td ON lt.MaTD = td.MaTD
    LEFT JOIN taixe tx ON cb.MaTX = tx.MaTX
    LEFT JOIN xebuyt xb ON lt.MaXB = xb.MaXB
    WHERE cb.TrangThaiXoa = '0'
    ORDER BY cb.MaCB DESC
    LIMIT 50
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching incidents:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

export const createIncident = (req, res) => {
  const { MaLT, MaTX, NoiDungSuCo } = req.body;
  
  if (!NoiDungSuCo) {
    return res.status(400).json({ error: 'Nội dung sự cố là bắt buộc' });
  }
  
  const MaCB = `CB${Date.now()}`;
  
  const sql = `
    INSERT INTO canhbaosuco (MaCB, MaLT, MaTX, NoiDungSuCo, TrangThaiXoa)
    VALUES (?, ?, ?, ?, '0')
  `;
  
  db.query(sql, [MaCB, MaLT, MaTX, NoiDungSuCo], (err, result) => {
    if (err) {
      console.error('Error creating incident:', err);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ 
      message: 'Tạo báo cáo sự cố thành công',
      MaCB
    });
  });
};

export const deleteIncident = (req, res) => {
  const { id } = req.params;
  
  const sql = "UPDATE canhbaosuco SET TrangThaiXoa = '1' WHERE MaCB = ?";
  
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting incident:', err);
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sự cố' });
    }
    res.json({ message: 'Xóa sự cố thành công' });
  });
};
