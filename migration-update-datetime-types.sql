-- =====================================================
-- MIGRATION: Cập nhật kiểu dữ liệu NgayChay, GioBatDau, GioKetThuc
-- =====================================================

USE quanlyxebuyt;

-- Bước 1: Backup dữ liệu hiện có (nếu có)
-- Tạo bảng tạm để lưu dữ liệu cũ
CREATE TABLE IF NOT EXISTS lichtrinh_backup AS SELECT * FROM lichtrinh;

-- Bước 2: Xóa dữ liệu trong bảng lichtrinh (nếu có)
-- Lưu ý: Điều này sẽ xóa tất cả lịch trình hiện có
-- Nếu muốn giữ dữ liệu, cần convert thủ công
TRUNCATE TABLE lichtrinh;

-- Bước 3: Thay đổi kiểu dữ liệu
ALTER TABLE lichtrinh 
  MODIFY COLUMN NgayChay DATE,
  MODIFY COLUMN GioBatDau TIME,
  MODIFY COLUMN GioKetThuc TIME;

-- Bước 4: Nếu muốn restore dữ liệu từ backup (cần convert format)
-- Uncomment các dòng dưới nếu cần:
/*
INSERT INTO lichtrinh (MaLT, MaXB, MaTD, MaTX, NgayChay, GioBatDau, GioKetThuc, TrangThai, TrangThaiXoa)
SELECT 
  MaLT,
  MaXB,
  MaTD,
  MaTX,
  -- Convert dd-mm-yyyy to yyyy-mm-dd
  STR_TO_DATE(NgayChay, '%d-%m-%Y') as NgayChay,
  -- Convert HH:MM to HH:MM:SS (nếu chưa có :SS)
  CASE 
    WHEN LENGTH(GioBatDau) = 5 THEN CONCAT(GioBatDau, ':00')
    ELSE GioBatDau
  END as GioBatDau,
  CASE 
    WHEN LENGTH(GioKetThuc) = 5 THEN CONCAT(GioKetThuc, ':00')
    ELSE GioKetThuc
  END as GioKetThuc,
  TrangThai,
  TrangThaiXoa
FROM lichtrinh_backup
WHERE TrangThaiXoa = '0';
*/

-- Kiểm tra kết quả
SELECT '========================================' as '';
SELECT 'KIỂM TRA CẤU TRÚC BẢNG LICHTRINH' as '';
SELECT '========================================' as '';

DESCRIBE lichtrinh;

SELECT '========================================' as '';
SELECT 'Migration hoàn tất!' as '';
SELECT '========================================' as '';

-- Lưu ý: Có thể xóa bảng backup sau khi đã kiểm tra
-- DROP TABLE IF EXISTS lichtrinh_backup;
