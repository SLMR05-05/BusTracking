CREATE DATABASE quanlyxebuyt;
USE quanlyxebuyt;

CREATE TABLE canhbaosuco (
  MaCB varchar(50) NOT NULL,
  MaLT varchar(50),
  MaTX varchar(50),
  NoiDungSuCo varchar(255),
  TrangThaiXoa varchar(1),
  PRIMARY KEY (MaCB)
);

CREATE TABLE chitietlichtrinh (
  MaCTLT varchar(50) NOT NULL,
  MaLT varchar(50),
  MaTram varchar(50),
  TrangThaiQua VARCHAR(1) DEFAULT '0',
  TrangThaiXoa varchar(1),
  PRIMARY KEY (MaCTLT)
);

CREATE TABLE hocsinh (
  MaHS varchar(50) NOT NULL,
  MaPH varchar(50),
  MaTram varchar(50),
  TenHS varchar(100),
  Lop varchar(50),
  TrangThaiXoa varchar(1),
  PRIMARY KEY (MaHS)
);

CREATE TABLE lichtrinh (
  MaLT varchar(50) NOT NULL,
  MaXB varchar(50),
  MaTD varchar(50),
  MaTX varchar(50),
  NgayChay DATE,          
  GioBatDau TIME,         
  GioKetThuc TIME,       
  TrangThai varchar(50),
  TrangThaiXoa varchar(1),
  PRIMARY KEY (MaLT)
);

CREATE TABLE phuhuynh (
  MaPH varchar(50) NOT NULL,
  MaTK varchar(50),
  TenPH varchar(100),
  SDT varchar(20),
  DiaChi varchar(255),
  TrangThaiXoa varchar(1),
  PRIMARY KEY (MaPH)
);

CREATE TABLE taikhoan (
  MaTK varchar(50) NOT NULL,
  MaVT varchar(50),
  TenDangNhap varchar(100),
  MatKhau varchar(255),
  TrangThaiXoa varchar(1),
  PRIMARY KEY (MaTK)
);

CREATE TABLE taixe (
  MaTX varchar(50) NOT NULL,
  MaTK varchar(50),
  TenTX varchar(100),
  SDT varchar(20),
  TrangThaiXoa varchar(1),
  PRIMARY KEY (MaTX)
);

CREATE TABLE thongbao (
  MaTB varchar(50) NOT NULL,
  MaLT varchar(50),
  MaPH varchar(50),
  MaHS varchar(50),
  NoiDung varchar(255),
  LoaiThongBao varchar(50),  -- 'attendance', 'stop_passed', 'alert'
  ThoiGian DATETIME DEFAULT CURRENT_TIMESTAMP,
  DaDoc VARCHAR(1) DEFAULT '0',  -- '0': chưa đọc, '1': đã đọc
  TrangThaiXoa varchar(1),
  PRIMARY KEY (MaTB)
);

CREATE TABLE tram (
  MaTram varchar(50) NOT NULL,
  MaTD varchar(50),
  TenTram varchar(100),
  DiaChi varchar(255),
  KinhDo varchar(50),
  ViDo varchar(50),
  ThuTu INT DEFAULT 0,
  TrangThaiXoa varchar(1),
  PRIMARY KEY (MaTram)
);

CREATE TABLE tuyenduong (
  MaTD varchar(50) NOT NULL,
  BatDau varchar(100),   -- dạng chuỗi
  KetThuc varchar(100), -- dạng chuỗi
  TenTuyenDuong varchar(100),
  TrangThaiXoa varchar(1),
  PRIMARY KEY (MaTD)
);

CREATE TABLE vaitro (
  MaVT varchar(50) NOT NULL,
  TenVT varchar(100),
  PRIMARY KEY (MaVT)
);

CREATE TABLE vitrixe (
  MaVTXe varchar(50) NOT NULL,
  MaXB varchar(50),
  KinhDo varchar(50),
  ViDo varchar(50),
  TrangThaiXe varchar(50),
  TrangThaiXoa varchar(1),
  PRIMARY KEY (MaVTXe)
);

CREATE TABLE xebuyt (
  MaXB varchar(50) NOT NULL,
  BienSo varchar(50),
  SucChua varchar(50),
  TrangThai varchar(50),
  TrangThaiXoa varchar(1),
  PRIMARY KEY (MaXB)
);

CREATE TABLE diemdanh (
  MaDD varchar(50) NOT NULL,
  MaLT varchar(50),
  MaHS varchar(50),
  ThoiGian datetime,
  TrangThai VARCHAR(1) NOT NULL, -- trạng thái điểm danh: có thể là 'chưa đón', 'đã đón', ' đã trả'.
  TrangThaiXoa VARCHAR(1) DEFAULT '0', 
  PRIMARY KEY (MaDD)
);


-- Các ràng buộc khóa ngoại

ALTER TABLE canhbaosuco
  ADD CONSTRAINT fk_canhbaosuco_lichtrinh FOREIGN KEY (MaLT) REFERENCES lichtrinh(MaLT),
  ADD CONSTRAINT fk_canhbaosuco_taixe FOREIGN KEY (MaTX) REFERENCES taixe(MaTX);

ALTER TABLE chitietlichtrinh
  ADD CONSTRAINT fk_chitietlichtrinh_lichtrinh FOREIGN KEY (MaLT) REFERENCES lichtrinh(MaLT),
  ADD CONSTRAINT fk_chitietlichtrinh_tram FOREIGN KEY (MaTram) REFERENCES tram(MaTram);

ALTER TABLE hocsinh
  ADD CONSTRAINT fk_hocsinh_phuhuynh FOREIGN KEY (MaPH) REFERENCES phuhuynh(MaPH),
  ADD CONSTRAINT fk_hocsinh_tram FOREIGN KEY (MaTram) REFERENCES tram(MaTram);

ALTER TABLE lichtrinh
  ADD CONSTRAINT fk_lichtrinh_xebuyt FOREIGN KEY (MaXB) REFERENCES xebuyt(MaXB),
  ADD CONSTRAINT fk_lichtrinh_tuyenduong FOREIGN KEY (MaTD) REFERENCES tuyenduong(MaTD);

ALTER TABLE phuhuynh
  ADD CONSTRAINT fk_phuhuynh_taikhoan FOREIGN KEY (MaTK) REFERENCES taikhoan(MaTK);

ALTER TABLE taikhoan
  ADD CONSTRAINT fk_taikhoan_vaitro FOREIGN KEY (MaVT) REFERENCES vaitro(MaVT);

ALTER TABLE taixe
  ADD CONSTRAINT fk_taixe_taikhoan FOREIGN KEY (MaTK) REFERENCES taikhoan(MaTK);

ALTER TABLE thongbao
  ADD CONSTRAINT fk_thongbao_lichtrinh FOREIGN KEY (MaLT) REFERENCES lichtrinh(MaLT),
  ADD CONSTRAINT fk_thongbao_phuhuynh FOREIGN KEY (MaPH) REFERENCES phuhuynh(MaPH),
  ADD CONSTRAINT fk_thongbao_hocsinh FOREIGN KEY (MaHS) REFERENCES hocsinh(MaHS);

ALTER TABLE tram
  ADD CONSTRAINT fk_tram_tuyenduong FOREIGN KEY (MaTD) REFERENCES tuyenduong(MaTD);

ALTER TABLE vitrixe
  ADD CONSTRAINT fk_vitrixe_xebuyt FOREIGN KEY (MaXB) REFERENCES xebuyt(MaXB);

ALTER TABLE lichtrinh
  ADD CONSTRAINT fk_lichtrinh_taixe FOREIGN KEY (MaTX) REFERENCES taixe(MaTX);

ALTER TABLE diemdanh
  ADD CONSTRAINT fk_diemdanh_lichtrinh FOREIGN KEY (MaLT) REFERENCES lichtrinh(MaLT),
  ADD CONSTRAINT fk_diemdanh_hocsinh FOREIGN KEY (MaHS) REFERENCES hocsinh(MaHS);
  

-- 2. Bảng hocsinh: thêm cột SDT
ALTER TABLE hocsinh
ADD COLUMN SDT varchar(50) DEFAULT NULL;

-- 3. Bảng taixe: thêm các cột SCCCD, BangLai, DiaChi
ALTER TABLE taixe
ADD COLUMN SCCCD varchar(50) DEFAULT NULL,
ADD COLUMN BangLai varchar(50) DEFAULT NULL,
ADD COLUMN DiaChi varchar(100) DEFAULT NULL;



-- 1. VAI TRÒ (ROLES)
INSERT INTO vaitro (MaVT, TenVT) VALUES
  ('AD', 'admin'),
  ('TX', 'driver'),
  ('PH', 'parent');

-- 2. TÀI KHOẢN (ACCOUNTS)
INSERT INTO taikhoan (MaTK, MaVT, TenDangNhap, MatKhau, TrangThaiXoa) VALUES
  ('TK001', 'AD', 'admin', 'admin123', '0'),
  ('TK002', 'TX', 'driver1', 'driver123', '0'),
  ('TK003', 'TX', 'driver2', 'driver123', '0'),
  ('TK004', 'TX', 'driver3', 'driver123', '0'),
  ('TK005', 'PH', 'parent1', 'parent123', '0'),
  ('TK006', 'PH', 'parent2', 'parent123', '0'),
  ('TK007', 'PH', 'parent3', 'parent123', '0');

-- 3. TÀI XẾ (DRIVERS)
INSERT INTO taixe (MaTX, MaTK, TenTX, SDT, SCCCD, BangLai, DiaChi, TrangThaiXoa) VALUES
  ('TX001', 'TK002', 'Nguyễn Văn Tài', '0912345678', '123456789012', 'B2', '123 Đường A, Quận 1', '0'),
  ('TX002', 'TK003', 'Trần Văn Bình', '0987654321', '234567890123', 'B2', '456 Đường B, Quận 3', '0'),
  ('TX003', 'TK004', 'Lê Văn Cường', '0901234567', '345678901234', 'B1', '789 Đường C, Quận 5', '0');

-- 4. PHỤ HUYNH (PARENTS)
INSERT INTO phuhuynh (MaPH, MaTK, TenPH, SDT, DiaChi, TrangThaiXoa) VALUES
  ('PH001', 'TK005', 'Trần Thị Mai', '0987654321', '789 Võ Thị Sáu, Q.3, TP.HCM', '0'),
  ('PH002', 'TK006', 'Nguyễn Thị Lan', '0976543210', '321 Điện Biên Phủ, Q.3, TP.HCM', '0'),
  ('PH003', 'TK007', 'Lê Thị Hoa', '0965432109', '654 Cách Mạng Tháng 8, Q.10, TP.HCM', '0');

-- 5. XE BUÝT (BUSES)
INSERT INTO xebuyt (MaXB, BienSo, SucChua, TrangThai, TrangThaiXoa) VALUES
  ('XB00001', '51A-12345', '45', 'available', '0'),
  ('XB00002', '51B-67890', '40', 'available', '0'),
  ('XB00003', '51C-11111', '50', 'available', '0'),
  ('XB00004', '51D-22222', '45', 'maintenance', '0');

-- 6. TUYẾN ĐƯỜNG (ROUTES)
INSERT INTO tuyenduong (MaTD, BatDau, KetThuc, TenTuyenDuong, TrangThaiXoa) VALUES
  ('TD00001', 'Trường THPT Lê Quý Đôn', 'Khu dân cư Phú Mỹ Hưng', 'Tuyến 1 - Quận 1 đến Quận 7', '0'),
  ('TD00002', 'Trường THCS Nguyễn Du', 'Khu chung cư Sunrise City', 'Tuyến 2 - Quận 3 đến Quận 7', '0'),
  ('TD00003', 'Trường Tiểu học Trần Đại Nghĩa', 'Khu đô thị Vinhomes', 'Tuyến 3 - Quận 1 đến Bình Thạnh', '0');

-- 7. TRẠM DỪNG (STATIONS)
-- Tuyến 1
INSERT INTO tram (MaTram, MaTD, TenTram, DiaChi, KinhDo, ViDo, ThuTu, TrangThaiXoa) VALUES
  ('T001', 'TD00001', 'Trường THPT Lê Quý Đôn', '123 Nguyễn Văn Cừ, Q.5', '106.6818', '10.7626', 1, '0'),
  ('T002', 'TD00001', 'Chợ Bến Thành', '45 Lê Lợi, Q.1', '106.6980', '10.7720', 2, '0'),
  ('T003', 'TD00001', 'Công viên 23/9', '89 Võ Thị Sáu, Q.3', '106.6950', '10.7820', 3, '0'),
  ('T004', 'TD00001', 'Phú Mỹ Hưng', '200 Nguyễn Văn Linh, Q.7', '106.7200', '10.7300', 4, '0'),

-- Tuyến 2
  ('T005', 'TD00002', 'Trường THCS Nguyễn Du', '111 Cách Mạng Tháng 8, Q.3', '106.6850', '10.7750', 1, '0'),
  ('T006', 'TD00002', 'Chung cư Sunrise', '222 Nguyễn Hữu Cảnh, Q.Bình Thạnh', '106.7100', '10.7900', 2, '0'),
  ('T007', 'TD00002', 'Khu dân cư Cityland', '333 Phan Văn Trị, Q.Gò Vấp', '106.6700', '10.8200', 3, '0'),

-- Tuyến 3
  ('T008', 'TD00003', 'Trường TH Trần Đại Nghĩa', '444 Điện Biên Phủ, Q.3', '106.6900', '10.7800', 1, '0'),
  ('T009', 'TD00003', 'Vinhomes Central Park', '555 Nguyễn Hữu Cảnh, Q.Bình Thạnh', '106.7150', '10.7950', 2, '0');

-- 8. HỌC SINH (STUDENTS)
INSERT INTO hocsinh (MaHS, MaPH, MaTram, TenHS, Lop, SDT, TrangThaiXoa) VALUES
  ('HS001', 'PH001', 'T001', 'Trần Văn An', '10A1', '0911222333', '0'),
  ('HS002', 'PH001', 'T002', 'Trần Thị Bình', '9A2', '0911444555', '0'),
  ('HS003', 'PH002', 'T003', 'Nguyễn Văn Cường', '11B1', '0909888777', '0'),
  ('HS004', 'PH002', 'T005', 'Nguyễn Thị Dung', '8A1', '0909777666', '0'),
  ('HS005', 'PH003', 'T008', 'Lê Văn Em', '5A1', '0909666555', '0');

-- KIỂM TRA DỮ LIỆU
SELECT '========================================' as '';
SELECT '   THỐNG KÊ DỮ LIỆU MẪU' as '';
SELECT '========================================' as '';

SELECT CONCAT('Vai trò: ', COUNT(*)) as ThongKe FROM vaitro;
SELECT CONCAT('Tài khoản: ', COUNT(*)) as ThongKe FROM taikhoan WHERE TrangThaiXoa = '0';
SELECT CONCAT('Tài xế: ', COUNT(*)) as ThongKe FROM taixe WHERE TrangThaiXoa = '0';
SELECT CONCAT('Phụ huynh: ', COUNT(*)) as ThongKe FROM phuhuynh WHERE TrangThaiXoa = '0';
SELECT CONCAT('Xe buýt: ', COUNT(*)) as ThongKe FROM xebuyt WHERE TrangThaiXoa = '0';
SELECT CONCAT('Tuyến đường: ', COUNT(*)) as ThongKe FROM tuyenduong WHERE TrangThaiXoa = '0';
SELECT CONCAT('Trạm dừng: ', COUNT(*)) as ThongKe FROM tram WHERE TrangThaiXoa = '0';
SELECT CONCAT('Học sinh: ', COUNT(*)) as ThongKe FROM hocsinh WHERE TrangThaiXoa = '0';

SELECT '========================================' as '';
SELECT 'Dữ liệu mẫu đã được tạo thành công!' as '';
SELECT '========================================' as '';
