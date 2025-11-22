-- Dữ liệu test cho hệ thống quản lý xe buýt
USE quanlyxebuyt;

-- Xóa dữ liệu cũ (nếu có)
DELETE FROM diemdanh;
DELETE FROM chitietlichtrinh;
DELETE FROM lichtrinh;
DELETE FROM hocsinh;
DELETE FROM phuhuynh;
DELETE FROM taixe;
DELETE FROM tram;
DELETE FROM tuyenduong;
DELETE FROM xebuyt;
DELETE FROM taikhoan;
DELETE FROM vaitro;

-- 1. Tạo vai trò
INSERT INTO vaitro (MaVT, TenVT) VALUES
('AD', 'admin'),
('TX', 'driver'),
('PH', 'parent');

-- 2. Tạo tài khoản test
INSERT INTO taikhoan (MaTK, MaVT, TenDangNhap, MatKhau, TrangThaiXoa) VALUES
('TK001', 'AD', 'admin', 'admin123', '0'),
('TK002', 'TX', 'driver1', 'driver123', '0'),
('TK003', 'TX', 'driver2', 'driver123', '0'),
('TK004', 'PH', 'parent', 'parent123', '0');

-- 3. Tạo tài xế
INSERT INTO taixe (MaTX, MaTK, TenTX, SoCCCD, BLX, DiaChi, SDT, TrangThaiXoa) VALUES
('TX001', 'TK002', 'Nguyễn Văn Tài', '001234567890', 'B2', '123 Nguyễn Văn Cừ, Q.5, TP.HCM', '0912345678', '0'),
('TX002', 'TK003', 'Trần Văn Bình', '001234567891', 'B2', '456 Lê Lợi, Q.1, TP.HCM', '0987654321', '0');

-- 4. Tạo phụ huynh
INSERT INTO phuhuynh (MaPH, MaTK, TenPH, SDT, DiaChi, TrangThaiXoa) VALUES
('PH001', 'TK004', 'Trần Thị Mai', '0987654321', '789 Võ Thị Sáu, Q.3, TP.HCM', '0');

-- 5. Tạo xe buýt
INSERT INTO xebuyt (MaXB, BienSo, SucChua, TrangThai, TrangThaiXoa) VALUES
('XB00001', '51A-12345', '45', 'available', '0'),
('XB00002', '51B-67890', '40', 'available', '0'),
('XB00003', '51C-11111', '50', 'available', '0');

-- 6. Tạo tuyến đường
INSERT INTO tuyenduong (MaTD, BatDau, KetThuc, TenTuyenDuong, TrangThaiXoa) VALUES
('TD00001', 'Trường THPT ABC', 'Khu dân cư XYZ', 'Tuyến 1 - Quận 1', '0'),
('TD00002', 'Trường THCS DEF', 'Khu chung cư GHI', 'Tuyến 2 - Quận 3', '0');

-- 7. Tạo trạm dừng cho tuyến 1
INSERT INTO tram (MaTram, MaTD, TenTram, DiaChi, KinhDo, ViDo, TrangThaiXoa) VALUES
('T001', 'TD00001', 'Trạm 1 - Trường ABC', '123 Nguyễn Văn Cừ, Q.5', '106.6818', '10.7626', '0'),
('T002', 'TD00001', 'Trạm 2 - Chợ Bến Thành', '45 Lê Lợi, Q.1', '106.6980', '10.7720', '0'),
('T003', 'TD00001', 'Trạm 3 - Công viên 23/9', '89 Võ Thị Sáu, Q.3', '106.6950', '10.7820', '0'),
('T004', 'TD00001', 'Trạm 4 - Trường XYZ', '200 Hoàng Hoa Thám, Q.Tân Bình', '106.6550', '10.7870', '0');

-- 8. Tạo trạm dừng cho tuyến 2
INSERT INTO tram (MaTram, MaTD, TenTram, DiaChi, KinhDo, ViDo, TrangThaiXoa) VALUES
('T005', 'TD00002', 'Trạm 5 - Trường DEF', '111 Cách Mạng Tháng 8, Q.3', '106.6850', '10.7750', '0'),
('T006', 'TD00002', 'Trạm 6 - Chung cư GHI', '222 Điện Biên Phủ, Q.3', '106.6900', '10.7800', '0');

-- 9. Tạo học sinh
INSERT INTO hocsinh (MaHS, MaPH, MaTram, TenHS, Lop, DiaChi, TrangThaiXoa) VALUES
('HS001', 'PH001', 'T001', 'Trần Văn An', '10A1', '123 Nguyễn Văn Cừ, Q.5', '0'),
('HS002', 'PH001', 'T002', 'Trần Thị Bình', '9A2', '45 Lê Lợi, Q.1', '0');

SELECT '=== TÀI KHOẢN ===' as Info;
SELECT tk.MaTK, tk.TenDangNhap, vt.TenVT, tk.TrangThaiXoa
FROM taikhoan tk 
INNER JOIN vaitro vt ON tk.MaVT = vt.MaVT
WHERE tk.TrangThaiXoa = '0';

SELECT '=== TÀI XẾ ===' as Info;
SELECT MaTX, TenTX, SDT, BLX FROM taixe WHERE TrangThaiXoa = '0';

SELECT '=== XE BUÝT ===' as Info;
SELECT MaXB, BienSo, SucChua, TrangThai FROM xebuyt WHERE TrangThaiXoa = '0';

SELECT '=== TUYẾN ĐƯỜNG ===' as Info;
SELECT MaTD, TenTuyenDuong, BatDau, KetThuc FROM tuyenduong WHERE TrangThaiXoa = '0';

SELECT '=== TRẠM DỪNG ===' as Info;
SELECT t.MaTram, t.TenTram, t.DiaChi, td.TenTuyenDuong
FROM tram t
INNER JOIN tuyenduong td ON t.MaTD = td.MaTD
WHERE t.TrangThaiXoa = '0'
ORDER BY t.MaTD, t.MaTram;

-- 10. Tạo lịch trình (sử dụng format ngày dd-mm-yyyy)
INSERT INTO lichtrinh (MaLT, MaXB, MaTD, MaTX, NgayChay, GioBatDau, GioKetThuc, TrangThai, TrangThaiXoa) VALUES
('LT00001', 'XB00001', 'TD00001', 'TX001', '18-11-2025', '6:00', '6:45', 'pending', '0'),
('LT00002', 'XB00002', 'TD00001', 'TX002', '19-11-2025', '6:00', '6:45', 'pending', '0'),
('LT00003', 'XB00001', 'TD00001', 'TX001', '20-11-2025', '6:00', '6:45', 'pending', '0'),
('LT00004', 'XB00003', 'TD00002', 'TX002', '18-11-2025', '7:00', '7:45', 'pending', '0');

-- 11. Tạo chi tiết lịch trình (điểm dừng trong lịch trình)
INSERT INTO chitietlichtrinh (MaCTLT, MaLT, MaTram, ThuTu, TrangThaiQua, TrangThaiXoa) VALUES
-- Lịch trình 1
('CTLT001', 'LT00001', 'T001', '1', '0', '0'),
('CTLT002', 'LT00001', 'T002', '2', '0', '0'),
('CTLT003', 'LT00001', 'T003', '3', '0', '0'),
('CTLT004', 'LT00001', 'T004', '4', '0', '0'),
-- Lịch trình 2
('CTLT005', 'LT00002', 'T001', '1', '0', '0'),
('CTLT006', 'LT00002', 'T002', '2', '0', '0'),
('CTLT007', 'LT00002', 'T003', '3', '0', '0'),
-- Lịch trình 3
('CTLT008', 'LT00003', 'T001', '1', '0', '0'),
('CTLT009', 'LT00003', 'T002', '2', '0', '0'),
('CTLT010', 'LT00003', 'T003', '3', '0', '0'),
('CTLT011', 'LT00003', 'T004', '4', '0', '0'),
-- Lịch trình 4
('CTLT012', 'LT00004', 'T005', '1', '0', '0'),
('CTLT013', 'LT00004', 'T006', '2', '0', '0');

-- Kiểm tra dữ liệu
SELECT '=== LỊCH TRÌNH ===' as Info;
SELECT lt.MaLT, lt.NgayChay, lt.GioBatDau, lt.GioKetThuc, 
       xb.BienSo, tx.TenTX, td.TenTuyenDuong, lt.TrangThai
FROM lichtrinh lt
INNER JOIN xebuyt xb ON lt.MaXB = xb.MaXB
INNER JOIN taixe tx ON lt.MaTX = tx.MaTX
INNER JOIN tuyenduong td ON lt.MaTD = td.MaTD
WHERE lt.TrangThaiXoa = '0'
ORDER BY lt.NgayChay, lt.GioBatDau;

SELECT '=== CHI TIẾT LỊCH TRÌNH ===' as Info;
SELECT ctlt.MaLT, ctlt.ThuTu, t.TenTram, t.DiaChi, ctlt.TrangThaiQua
FROM chitietlichtrinh ctlt
INNER JOIN tram t ON ctlt.MaTram = t.MaTram
WHERE ctlt.TrangThaiXoa = '0'
ORDER BY ctlt.MaLT, CAST(ctlt.ThuTu AS UNSIGNED);
