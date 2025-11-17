-- Dữ liệu test cho đăng nhập
USE quanlyxebuyt;

-- 1. Tạo vai trò
INSERT INTO vaitro (MaVT, TenVT) VALUES
('VT001', 'admin'),
('VT002', 'driver'),
('VT003', 'parent');

-- 2. Tạo tài khoản test
INSERT INTO taikhoan (MaTK, MaVT, TenDangNhap, MatKhau, TrangThaiXoa) VALUES
('TK001', 'VT001', 'admin', 'admin123', '0'),
('TK002', 'VT002', 'driver', 'driver123', '0'),
('TK003', 'VT003', 'parent', 'parent123', '0');

-- 3. Tạo tài xế
INSERT INTO taixe (MaTX, MaTK, TenTX, SoCCCD, BLX, DiaChi, SDT, TrangThaiXoa) VALUES
('TX001', 'TK002', 'Nguyễn Văn A', '001234567890', 'B2', 'Hà Nội', '0912345678', '0');

-- 4. Tạo phụ huynh
INSERT INTO phuhuynh (MaPH, MaTK, TenPH, SDT, DiaChi, TrangThaiXoa) VALUES
('PH001', 'TK003', 'Trần Thị B', '0987654321', 'Hà Nội', '0');

-- 5. Tạo xe buýt
INSERT INTO xebuyt (MaXB, BienSo, SucChua, TrangThai, TrangThaiXoa) VALUES
('XB001', '29A-12345', '45', 'available', '0'),
('XB002', '29B-67890', '40', 'available', '0');

-- 6. Tạo tuyến đường
INSERT INTO tuyenduong (MaTD, BatDau, KetThuc, TenTuyenDuong, TrangThaiXoa) VALUES
('TD001', 'Trường ABC', 'Khu đô thị XYZ', 'Tuyến 1', '0');

-- 7. Tạo điểm dừng
INSERT INTO tram (MaTram, MaTD, TenTram, DiaChi, KinhDo, ViDo, TrangThaiXoa) VALUES
('T001', 'TD001', 'Điểm dừng 1', '123 Đường ABC', '105.8342', '21.0278', '0'),
('T002', 'TD001', 'Điểm dừng 2', '456 Đường DEF', '105.8400', '21.0300', '0');

-- 8. Tạo học sinh
INSERT INTO hocsinh (MaHS, MaPH, MaTram, TenHS, Lop, DiaChi, TrangThaiXoa) VALUES
('HS001', 'PH001', 'T001', 'Trần Văn C', '10A1', 'Hà Nội', '0'),
('HS002', 'PH001', 'T001', 'Trần Văn D', '9A2', 'Hà Nội', '0');

-- Kiểm tra dữ liệu
SELECT 'Tài khoản:' as Info;
SELECT tk.*, vt.TenVT FROM taikhoan tk 
INNER JOIN vaitro vt ON tk.MaVT = vt.MaVT;

SELECT 'Tài xế:' as Info;
SELECT * FROM taixe;

SELECT 'Phụ huynh:' as Info;
SELECT * FROM phuhuynh;
