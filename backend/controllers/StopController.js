import StopModel from "../models/StopModel.js";

export const getAllStops = (req, res) => {
  StopModel.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

export const getStopById = (req, res) => {
  StopModel.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
};

export const createStop = (req, res) => {
  console.log(`➕ [createStop] Dữ liệu:`, req.body);
  
  // Tự động sinh mã trạm
  StopModel.getLatestId((err, latestResult) => {
    if (err) {
      console.error(`❌ [createStop] Lỗi khi lấy mã mới nhất:`, err);
      return res.status(500).json({ error: err.message });
    }

    let newMaTram = "T0001";
    if (latestResult.length > 0 && latestResult[0].MaTram) {
      const lastId = latestResult[0].MaTram;
      const num = parseInt(lastId.slice(1)) + 1;
      newMaTram = "T" + num.toString().padStart(4, "0");
    }

    const stopData = {
      MaTram: newMaTram,
      TenTram: req.body.TenTram,
      DiaChi: req.body.DiaChi,
      ViDo: req.body.ViDo,
      KinhDo: req.body.KinhDo,
      MaTD: req.body.MaTD,
      ThuTu: req.body.ThuTu || 1
    };

    StopModel.create(stopData, (err, result) => {
      if (err) {
        console.error(`❌ [createStop] Lỗi:`, err);
        return res.status(500).json({ error: err.message });
      }
      console.log(`✅ [createStop] Đã tạo trạm: ${newMaTram}`);
      res.json({ 
        message: "Tạo trạm thành công", 
        MaTram: newMaTram,
        id: newMaTram 
      });
    });
  });
};

export const updateStop = (req, res) => {
  const stopId = req.params.id;
  console.log(`✏️ [updateStop] Cập nhật trạm: ${stopId}`, req.body);
  
  StopModel.update(stopId, req.body, (err, result) => {
    if (err) {
      console.error(`❌ [updateStop] Lỗi:`, err);
      return res.status(500).json({ error: err.message });
    }
    
    if (result.affectedRows === 0) {
      console.warn(`⚠️ [updateStop] Không tìm thấy trạm: ${stopId}`);
      return res.status(404).json({ error: "Không tìm thấy trạm" });
    }
    
    console.log(`✅ [updateStop] Đã cập nhật trạm: ${stopId}`);
    res.json({ message: "Cập nhật trạm thành công" });
  });
};

export const deleteStop = (req, res) => {
  const stopId = req.params.id;
  console.log(`🗑️ [deleteStop] Đang xóa trạm: ${stopId}`);
  
  // Kiểm tra xem trạm có đang được sử dụng trong lịch trình không
  StopModel.checkStopUsage(stopId, (checkErr, usageResult) => {
    if (checkErr) {
      console.error(`❌ [deleteStop] Lỗi khi kiểm tra:`, checkErr);
      return res.status(500).json({ error: checkErr.message });
    }
    
    if (usageResult && usageResult.length > 0 && usageResult[0].count > 0) {
      console.warn(`⚠️ [deleteStop] Trạm đang được sử dụng: ${stopId}`);
      return res.status(400).json({ 
        error: "Không thể xóa trạm này vì đang được sử dụng trong lịch trình. Vui lòng xóa các lịch trình liên quan trước." 
      });
    }
    
    // Nếu không được sử dụng, tiến hành xóa
    StopModel.delete(stopId, (err, result) => {
      if (err) {
        console.error(`❌ [deleteStop] Lỗi:`, err);
        return res.status(500).json({ error: err.message });
      }
      
      if (result.affectedRows === 0) {
        console.warn(`⚠️ [deleteStop] Không tìm thấy trạm: ${stopId}`);
        return res.status(404).json({ error: "Không tìm thấy trạm" });
      }
      
      console.log(`✅ [deleteStop] Đã xóa trạm: ${stopId}`);
      res.json({ message: "Xóa trạm thành công" });
    });
  });
};
