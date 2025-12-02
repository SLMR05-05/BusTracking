import RouteModel from "../../models/admin/RouteModel.js";

export const getAllRoutes = (req, res) => {
  RouteModel.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const getRouteById = (req, res) => {
  RouteModel.findById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Tuyến đường không tồn tại" });
    res.json(results[0]);
  });
};

export const createRoute = (req, res) => {
  // Tự động sinh mã tuyến đường
  RouteModel.getLatestId((err, latestResult) => {
    if (err) return res.status(500).json({ error: err.message });

    let newMaTD = "TD0001";
    if (latestResult.length > 0 && latestResult[0].MaTD) {
      const lastId = latestResult[0].MaTD;
      const num = parseInt(lastId.slice(2)) + 1;
      newMaTD = "TD" + num.toString().padStart(4, "0");
    }

    const routeData = {
      MaTD: newMaTD,
      BatDau: req.body.BatDau,
      KetThuc: req.body.KetThuc,
      TenTuyenDuong: req.body.TenTuyenDuong,
      TrangThaiXoa: '0'
    };

    RouteModel.create(routeData, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ 
        message: "Tạo tuyến đường thành công", 
        MaTD: newMaTD,
        id: result.insertId 
      });
    });
  });
};

export const updateRoute = (req, res) => {
  const routeData = {
    BatDau: req.body.BatDau,
    KetThuc: req.body.KetThuc,
    TenTuyenDuong: req.body.TenTuyenDuong
  };

  RouteModel.update(req.params.id, routeData, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Tuyến đường không tồn tại" });
    res.json({ message: "Cập nhật tuyến đường thành công" });
  });
};

export const deleteRoute = (req, res) => {
  RouteModel.softDelete(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Tuyến đường không tồn tại" });
    res.json({ message: "Xóa tuyến đường thành công" });
  });
};

export const getRouteStops = (req, res) => {
  RouteModel.getStops(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const addRouteStop = (req, res) => {
  // Nếu không có ThuTu, tự động lấy số thứ tự tiếp theo
  if (!req.body.ThuTu) {
    RouteModel.getMaxThuTu(req.params.id, (err, maxResult) => {
      if (err) return res.status(500).json({ error: err.message });
      
      const nextThuTu = (maxResult && maxResult.maxThuTu) ? maxResult.maxThuTu + 1 : 1;
      
      const stopData = {
        MaTram: req.body.MaTram,
        MaTD: req.params.id,
        TenTram: req.body.TenTram,
        DiaChi: req.body.DiaChi,
        KinhDo: req.body.KinhDo,
        ViDo: req.body.ViDo,
        ThuTu: nextThuTu,
        TrangThaiXoa: '0'
      };

      RouteModel.addStop(stopData, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ 
          message: "Thêm điểm dừng thành công", 
          id: result.insertId,
          ThuTu: nextThuTu
        });
      });
    });
  } else {
    const stopData = {
      MaTram: req.body.MaTram,
      MaTD: req.params.id,
      TenTram: req.body.TenTram,
      DiaChi: req.body.DiaChi,
      KinhDo: req.body.KinhDo,
      ViDo: req.body.ViDo,
      ThuTu: req.body.ThuTu,
      TrangThaiXoa: '0'
    };

    RouteModel.addStop(stopData, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Thêm điểm dừng thành công", id: result.insertId });
    });
  }
};

export const updateRouteStop = (req, res) => {
  console.log(`🔄 [updateRouteStop] Cập nhật trạm ${req.params.stopId}:`, req.body);
  
  // Chỉ cập nhật các trường được gửi lên
  const stopData = {};
  
  if (req.body.TenTram !== undefined) stopData.TenTram = req.body.TenTram;
  if (req.body.DiaChi !== undefined) stopData.DiaChi = req.body.DiaChi;
  if (req.body.KinhDo !== undefined) stopData.KinhDo = req.body.KinhDo;
  if (req.body.ViDo !== undefined) stopData.ViDo = req.body.ViDo;
  if (req.body.ThuTu !== undefined) stopData.ThuTu = req.body.ThuTu;

  // Nếu không có trường nào để cập nhật
  if (Object.keys(stopData).length === 0) {
    return res.status(400).json({ error: "Không có dữ liệu để cập nhật" });
  }

  console.log(`📝 [updateRouteStop] Dữ liệu cập nhật:`, stopData);

  RouteModel.updateStop(req.params.stopId, stopData, (err, result) => {
    if (err) {
      console.error(`❌ [updateRouteStop] Lỗi:`, err);
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      console.warn(`⚠️ [updateRouteStop] Không tìm thấy trạm ${req.params.stopId}`);
      return res.status(404).json({ message: "Điểm dừng không tồn tại" });
    }
    console.log(`✅ [updateRouteStop] Cập nhật thành công trạm ${req.params.stopId}`);
    res.json({ message: "Cập nhật điểm dừng thành công" });
  });
};

export const deleteRouteStop = (req, res) => {
  const stopId = req.params.stopId;
  
  // Kiểm tra xem trạm có đang được sử dụng trong lịch trình không
  RouteModel.checkStopUsageInSchedule(stopId, (checkErr, usageResult) => {
    if (checkErr) {
      console.error('Error checking stop usage:', checkErr);
      return res.status(500).json({ error: checkErr.message });
    }
    
    if (usageResult && usageResult.length > 0 && usageResult[0].count > 0) {
      return res.status(400).json({ 
        error: "Không thể xóa trạm này vì đang được sử dụng trong lịch trình. Vui lòng xóa các lịch trình liên quan trước." 
      });
    }
    
    // Nếu không được sử dụng, tiến hành xóa
    RouteModel.deleteStop(stopId, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Điểm dừng không tồn tại" });
      res.json({ message: "Xóa điểm dừng thành công" });
    });
  });
};
