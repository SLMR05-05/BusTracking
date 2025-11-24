import NotificationModel from "../../models/admin/NotificationModel.js";

export const getNotificationsByParent = (req, res) => {
  NotificationModel.getByParent(req.params.parentId, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const createNotification = (req, res) => {
  const notificationData = {
    MaTB: req.body.MaTB,
    MaLT: req.body.MaLT,
    MaPH: req.body.MaPH,
    NoiDung: req.body.NoiDung,
    TrangThaiXoa: '0'
  };

  NotificationModel.create(notificationData, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Tạo thông báo thành công", id: result.insertId });
  });
};

export const deleteNotification = (req, res) => {
  NotificationModel.softDelete(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Thông báo không tồn tại" });
    res.json({ message: "Xóa thông báo thành công" });
  });
};
