import db from "../../config/db.js";
import { emitAttendanceNotification } from "../../socket/socketManager.js";

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

export const notifyParentsAboutIncident = (req, res) => {
  const { id } = req.params; // MaCB
  
  console.log(`📢 [notifyParentsAboutIncident] Gửi thông báo sự cố: ${id}`);
  
  // Lấy thông tin sự cố và lịch trình
  const getIncidentSql = `
    SELECT 
      cb.MaCB,
      cb.MaLT,
      cb.NoiDungSuCo,
      td.TenTuyenDuong,
      tx.TenTX,
      xb.BienSo
    FROM canhbaosuco cb
    LEFT JOIN lichtrinh lt ON cb.MaLT = lt.MaLT
    LEFT JOIN tuyenduong td ON lt.MaTD = td.MaTD
    LEFT JOIN taixe tx ON cb.MaTX = tx.MaTX
    LEFT JOIN xebuyt xb ON lt.MaXB = xb.MaXB
    WHERE cb.MaCB = ? AND cb.TrangThaiXoa = '0'
  `;
  
  db.query(getIncidentSql, [id], (err, incidents) => {
    if (err) {
      console.error('Error fetching incident:', err);
      return res.status(500).json({ error: err.message });
    }
    
    if (incidents.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy sự cố' });
    }
    
    const incident = incidents[0];
    
    if (!incident.MaLT) {
      return res.status(400).json({ error: 'Sự cố không có lịch trình liên kết' });
    }
    
    // Lấy danh sách phụ huynh có con trong lịch trình này
    // Học sinh -> Trạm -> Tuyến đường -> Lịch trình
    const getParentsSql = `
      SELECT DISTINCT 
        ph.MaPH,
        ph.TenPH,
        hs.MaHS,
        hs.TenHS
      FROM hocsinh hs
      JOIN phuhuynh ph ON hs.MaPH = ph.MaPH
      JOIN tram t ON hs.MaTram = t.MaTram
      JOIN lichtrinh lt ON t.MaTD = lt.MaTD
      WHERE lt.MaLT = ? 
        AND hs.TrangThaiXoa = '0' 
        AND ph.TrangThaiXoa = '0'
    `;
    
    db.query(getParentsSql, [incident.MaLT], (err2, parents) => {
      if (err2) {
        console.error('Error fetching parents:', err2);
        return res.status(500).json({ error: err2.message });
      }
      
      if (parents.length === 0) {
        return res.status(404).json({ error: 'Không tìm thấy phụ huynh nào trong lịch trình này' });
      }
      
      // Tạo nội dung thông báo
      const noiDung = ` SỰ CỐ: ${incident.NoiDungSuCo}\n\nTuyến: ${incident.TenTuyenDuong || 'N/A'}\nTài xế: ${incident.TenTX || 'N/A'}\nXe: ${incident.BienSo || 'N/A'}`;
      
      // Gửi thông báo cho từng phụ huynh
      let notified = 0;
      const promises = parents.map(parent => {
        return new Promise((resolve) => {
          const insertSql = `
            INSERT INTO thongbao (MaTB, MaLT, MaPH, MaHS, NoiDung, LoaiThongBao, ThoiGian, DaDoc, TrangThaiXoa)
            VALUES (UUID(), ?, ?, ?, ?, 'incident', NOW(), '0', '0')
          `;
          
          db.query(insertSql, [incident.MaLT, parent.MaPH, parent.MaHS, noiDung], (insertErr) => {
            if (!insertErr) {
              notified++;
              console.log(` Đã gửi thông báo sự cố cho phụ huynh ${parent.MaPH}`);
            } else {
              console.error(` Lỗi gửi thông báo cho ${parent.MaPH}:`, insertErr);
            }
            resolve();
          });
        });
      });
      
      Promise.all(promises).then(() => {
        console.log(` Đã gửi ${notified}/${parents.length} thông báo sự cố`);
        res.json({ 
          message: `Đã gửi thông báo đến ${notified} phụ huynh`,
          notified,
          total: parents.length
        });
      });
    });
  });
};
