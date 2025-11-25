import express from "express";
import db from "../config/db.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Lấy danh sách thông báo của phụ huynh
router.get("/parent/:parentId", verifyToken, (req, res) => {
  const { parentId } = req.params;
  
  const sql = `
    SELECT tb.*, hs.TenHS, lt.MaLT,
           DATE_FORMAT(tb.ThoiGian, '%Y-%m-%d %H:%i:%s') as ThoiGianFormatted
    FROM thongbao tb
    LEFT JOIN hocsinh hs ON tb.MaHS = hs.MaHS
    LEFT JOIN lichtrinh lt ON tb.MaLT = lt.MaLT
    WHERE tb.MaPH = ? AND tb.TrangThaiXoa = '0'
    ORDER BY tb.ThoiGian DESC
    LIMIT 50
  `;
  
  db.query(sql, [parentId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Đánh dấu đã đọc
router.put("/:notificationId/read", verifyToken, (req, res) => {
  const { notificationId } = req.params;
  
  const sql = "UPDATE thongbao SET DaDoc = '1' WHERE MaTB = ?";
  
  db.query(sql, [notificationId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Đã đánh dấu đọc" });
  });
});

// Đánh dấu tất cả đã đọc
router.put("/parent/:parentId/read-all", verifyToken, (req, res) => {
  const { parentId } = req.params;
  
  const sql = "UPDATE thongbao SET DaDoc = '1' WHERE MaPH = ? AND DaDoc = '0'";
  
  db.query(sql, [parentId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Đã đánh dấu tất cả" });
  });
});

// Lấy số lượng thông báo chưa đọc
router.get("/parent/:parentId/unread-count", verifyToken, (req, res) => {
  const { parentId } = req.params;
  
  const sql = `
    SELECT COUNT(*) as count
    FROM thongbao
    WHERE MaPH = ? AND DaDoc = '0' AND TrangThaiXoa = '0'
  `;
  
  db.query(sql, [parentId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ count: results[0].count });
  });
});

export default router;
