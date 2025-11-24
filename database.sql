-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th10 24, 2025 lúc 08:28 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `quanlyxebuyt`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `canhbaosuco`
--

CREATE TABLE `canhbaosuco` (
  `MaCB` varchar(50) NOT NULL,
  `MaLT` varchar(50) DEFAULT NULL,
  `MaTX` varchar(50) DEFAULT NULL,
  `NoiDungSuCo` varchar(255) DEFAULT NULL,
  `TrangThaiXoa` varchar(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chitietlichtrinh`
--

CREATE TABLE `chitietlichtrinh` (
  `MaCTLT` varchar(50) NOT NULL,
  `MaLT` varchar(50) DEFAULT NULL,
  `MaTram` varchar(50) DEFAULT NULL,
  `ThuTu` varchar(50) DEFAULT NULL,
  `TrangThaiQua` varchar(1) DEFAULT '0',
  `TrangThaiXoa` varchar(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `diemdanh`
--

CREATE TABLE `diemdanh` (
  `MaDD` varchar(50) NOT NULL,
  `MaLT` varchar(50) DEFAULT NULL,
  `MaHS` varchar(50) DEFAULT NULL,
  `ThoiGian` datetime DEFAULT NULL,
  `TrangThai` varchar(1) NOT NULL,
  `TrangThaiXoa` varchar(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hocsinh`
--

CREATE TABLE `hocsinh` (
  `MaHS` varchar(50) NOT NULL,
  `MaPH` varchar(50) DEFAULT NULL,
  `MaTram` varchar(50) DEFAULT NULL,
  `TenHS` varchar(100) DEFAULT NULL,
  `SDT` varchar(50) DEFAULT NULL,
  `Lop` varchar(50) DEFAULT NULL,
  `TrangThaiXoa` varchar(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `hocsinh`
--

INSERT INTO `hocsinh` (`MaHS`, `MaPH`, `MaTram`, `TenHS`, `SDT`, `Lop`, `TrangThaiXoa`) VALUES
('HS001', 'PH001', 'T001', 'Trần Văn Anh', '0912458734', '10A1', '0'),
('HS002', 'PH001', 'T002', 'Trần Thị Bình', '0983672410', '9A2', '0'),
('HS003', 'PH002', 'T003', 'Nguyễn Văn Cường', '0905823119', '11B1', '0'),
('HS004', 'PH002', 'T005', 'Nguyễn Thị Dung', '0934720586', '8A1', '0'),
('HS005', 'PH003', 'T008', 'Lê Văn Em', '0978154603', '5A1', '0');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `lichtrinh`
--

CREATE TABLE `lichtrinh` (
  `MaLT` varchar(50) NOT NULL,
  `MaXB` varchar(50) DEFAULT NULL,
  `MaTD` varchar(50) DEFAULT NULL,
  `MaTX` varchar(50) DEFAULT NULL,
  `NgayChay` varchar(50) DEFAULT NULL,
  `GioBatDau` varchar(50) DEFAULT NULL,
  `GioKetThuc` varchar(50) DEFAULT NULL,
  `TrangThai` varchar(50) DEFAULT NULL,
  `TrangThaiXoa` varchar(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phuhuynh`
--

CREATE TABLE `phuhuynh` (
  `MaPH` varchar(50) NOT NULL,
  `MaTK` varchar(50) DEFAULT NULL,
  `TenPH` varchar(100) DEFAULT NULL,
  `SDT` varchar(20) DEFAULT NULL,
  `DiaChi` varchar(255) DEFAULT NULL,
  `TrangThaiXoa` varchar(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `phuhuynh`
--

INSERT INTO `phuhuynh` (`MaPH`, `MaTK`, `TenPH`, `SDT`, `DiaChi`, `TrangThaiXoa`) VALUES
('PH001', 'TK005', 'Trần Thị Mai', '0987654321', '789 Võ Thị Sáu, Q.3, TP.HCM', '0'),
('PH002', 'TK006', 'Nguyễn Thị Lan', '0976543210', '321 Điện Biên Phủ, Q.3, TP.HCM', '0'),
('PH003', 'TK007', 'Lê Thị Hoa', '0965432109', '654 Cách Mạng Tháng 8, Q.10, TP.HCM', '0');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `taikhoan`
--

CREATE TABLE `taikhoan` (
  `MaTK` varchar(50) NOT NULL,
  `MaVT` varchar(50) DEFAULT NULL,
  `TenDangNhap` varchar(100) DEFAULT NULL,
  `MatKhau` varchar(255) DEFAULT NULL,
  `TrangThaiXoa` varchar(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `taikhoan`
--

INSERT INTO `taikhoan` (`MaTK`, `MaVT`, `TenDangNhap`, `MatKhau`, `TrangThaiXoa`) VALUES
('TK001', 'AD', 'admin', 'admin123', '0'),
('TK002', 'TX', 'driver1', 'driver123', '0'),
('TK003', 'TX', 'driver2', 'driver123', '0'),
('TK004', 'TX', 'driver3', 'driver123', '0'),
('TK005', 'PH', 'parent1', 'parent123', '0'),
('TK006', 'PH', 'parent2', 'parent123', '0'),
('TK007', 'PH', 'parent3', 'parent123', '0');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `taixe`
--

CREATE TABLE `taixe` (
  `MaTX` varchar(50) NOT NULL,
  `MaTK` varchar(50) DEFAULT NULL,
  `TenTX` varchar(100) DEFAULT NULL,
  `SDT` varchar(20) DEFAULT NULL,
  `SCCCD` varchar(50) DEFAULT NULL,
  `BangLai` varchar(50) DEFAULT NULL,
  `DiaChi` varchar(100) DEFAULT NULL,
  `TrangThaiXoa` varchar(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `taixe`
--

INSERT INTO `taixe` (`MaTX`, `MaTK`, `TenTX`, `SDT`, `SCCCD`, `BangLai`, `DiaChi`, `TrangThaiXoa`) VALUES
('TX001', 'TK002', 'Nguyễn Văn Tài', '0912345678', '079203004512', 'B2', '245 Nguyễn Thị Minh Khai, Phường 5, Quận 3, TP. HCM', '0'),
('TX002', 'TK003', 'Trần Văn Bình', '0987654321', '083194008327', 'B1', '78 Lê Văn Việt, Phường Hiệp Phú, TP. Thủ Đức, TP. HCM', '0'),
('TX003', 'TK004', 'Lê Văn Cường', '0901234567', '075186006951', 'B1', '512 Lý Thường Kiệt, Phường 7, Quận Tân Bình, TP. HCM', '0');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `thongbao`
--

CREATE TABLE `thongbao` (
  `MaTB` varchar(50) NOT NULL,
  `MaLT` varchar(50) DEFAULT NULL,
  `MaPH` varchar(50) DEFAULT NULL,
  `NoiDung` varchar(255) DEFAULT NULL,
  `TrangThaiXoa` varchar(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tram`
--

CREATE TABLE `tram` (
  `MaTram` varchar(50) NOT NULL,
  `MaTD` varchar(50) DEFAULT NULL,
  `TenTram` varchar(100) DEFAULT NULL,
  `DiaChi` varchar(255) DEFAULT NULL,
  `KinhDo` varchar(50) DEFAULT NULL,
  `ViDo` varchar(50) DEFAULT NULL,
  `TrangThaiXoa` varchar(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tram`
--

INSERT INTO `tram` (`MaTram`, `MaTD`, `TenTram`, `DiaChi`, `KinhDo`, `ViDo`, `TrangThaiXoa`) VALUES
('T001', 'TD00001', ' Trường THPT Lê Quý Đôn', '123 Nguyễn Văn Cừ, Q.5', '106.6818', '10.7626', '0'),
('T002', 'TD00001', ' Chợ Bến Thành', '45 Lê Lợi, Q.1', '106.6980', '10.7720', '0'),
('T003', 'TD00001', ' Công viên 23/9', '89 Võ Thị Sáu, Q.3', '106.6950', '10.7820', '0'),
('T004', 'TD00001', ' Phú Mỹ Hưng', '200 Nguyễn Văn Linh, Q.7', '106.7200', '10.7300', '0'),
('T005', 'TD00002', ' Trường THCS Nguyễn Du', '111 Cách Mạng Tháng 8, Q.3', '106.6850', '10.7750', '0'),
('T006', 'TD00002', ' Chung cư Sunrise', '222 Nguyễn Hữu Cảnh, Q.Bình Thạnh', '106.7100', '10.7900', '0'),
('T007', 'TD00002', ' Khu dân cư Cityland', '333 Phan Văn Trị, Q.Gò Vấp', '106.6700', '10.8200', '0'),
('T008', 'TD00003', ' Trường TH Trần Đại Nghĩa', '444 Điện Biên Phủ, Q.3', '106.6900', '10.7800', '0'),
('T009', 'TD00003', ' Vinhomes Central Park', '555 Nguyễn Hữu Cảnh, Q.Bình Thạnh', '106.7150', '10.7950', '0');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tuyenduong`
--

CREATE TABLE `tuyenduong` (
  `MaTD` varchar(50) NOT NULL,
  `BatDau` varchar(100) DEFAULT NULL,
  `KetThuc` varchar(100) DEFAULT NULL,
  `TenTuyenDuong` varchar(100) DEFAULT NULL,
  `TrangThaiXoa` varchar(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tuyenduong`
--

INSERT INTO `tuyenduong` (`MaTD`, `BatDau`, `KetThuc`, `TenTuyenDuong`, `TrangThaiXoa`) VALUES
('TD00001', 'Trường THPT Lê Quý Đôn', 'Khu dân cư Phú Mỹ Hưng', 'Tuyến 1 - Quận 1 đến Quận 7', '0'),
('TD00002', 'Trường THCS Nguyễn Du', 'Khu chung cư Sunrise City', 'Tuyến 2 - Quận 3 đến Quận 7', '0'),
('TD00003', 'Trường Tiểu học Trần Đại Nghĩa', 'Khu đô thị Vinhomes', 'Tuyến 3 - Quận 1 đến Bình Thạnh', '0');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `vaitro`
--

CREATE TABLE `vaitro` (
  `MaVT` varchar(50) NOT NULL,
  `TenVT` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `vaitro`
--

INSERT INTO `vaitro` (`MaVT`, `TenVT`) VALUES
('AD', 'admin'),
('PH', 'parent'),
('TX', 'driver');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `vitrixe`
--

CREATE TABLE `vitrixe` (
  `MaVTXe` varchar(50) NOT NULL,
  `MaXB` varchar(50) DEFAULT NULL,
  `KinhDo` varchar(50) DEFAULT NULL,
  `ViDo` varchar(50) DEFAULT NULL,
  `TrangThaiXe` varchar(50) DEFAULT NULL,
  `TrangThaiXoa` varchar(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `xebuyt`
--

CREATE TABLE `xebuyt` (
  `MaXB` varchar(50) NOT NULL,
  `BienSo` varchar(50) DEFAULT NULL,
  `SucChua` varchar(50) DEFAULT NULL,
  `TrangThai` varchar(50) DEFAULT NULL,
  `TrangThaiXoa` varchar(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `xebuyt`
--

INSERT INTO `xebuyt` (`MaXB`, `BienSo`, `SucChua`, `TrangThai`, `TrangThaiXoa`) VALUES
('XB001', '51A-12345', '45', '0', '0'),
('XB002', '51B-67890', '40', '0', '0'),
('XB003', '51C-11111', '50', '0', '0'),
('XB004', '51D-22222', '45', '0', '0');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `canhbaosuco`
--
ALTER TABLE `canhbaosuco`
  ADD PRIMARY KEY (`MaCB`),
  ADD KEY `fk_canhbaosuco_lichtrinh` (`MaLT`),
  ADD KEY `fk_canhbaosuco_taixe` (`MaTX`);

--
-- Chỉ mục cho bảng `chitietlichtrinh`
--
ALTER TABLE `chitietlichtrinh`
  ADD PRIMARY KEY (`MaCTLT`),
  ADD KEY `fk_chitietlichtrinh_lichtrinh` (`MaLT`),
  ADD KEY `fk_chitietlichtrinh_tram` (`MaTram`);

--
-- Chỉ mục cho bảng `diemdanh`
--
ALTER TABLE `diemdanh`
  ADD PRIMARY KEY (`MaDD`),
  ADD KEY `fk_diemdanh_lichtrinh` (`MaLT`),
  ADD KEY `fk_diemdanh_hocsinh` (`MaHS`);

--
-- Chỉ mục cho bảng `hocsinh`
--
ALTER TABLE `hocsinh`
  ADD PRIMARY KEY (`MaHS`),
  ADD KEY `fk_hocsinh_phuhuynh` (`MaPH`),
  ADD KEY `fk_hocsinh_tram` (`MaTram`);

--
-- Chỉ mục cho bảng `lichtrinh`
--
ALTER TABLE `lichtrinh`
  ADD PRIMARY KEY (`MaLT`),
  ADD KEY `fk_lichtrinh_xebuyt` (`MaXB`),
  ADD KEY `fk_lichtrinh_tuyenduong` (`MaTD`),
  ADD KEY `fk_lichtrinh_taixe` (`MaTX`);

--
-- Chỉ mục cho bảng `phuhuynh`
--
ALTER TABLE `phuhuynh`
  ADD PRIMARY KEY (`MaPH`),
  ADD KEY `fk_phuhuynh_taikhoan` (`MaTK`);

--
-- Chỉ mục cho bảng `taikhoan`
--
ALTER TABLE `taikhoan`
  ADD PRIMARY KEY (`MaTK`),
  ADD KEY `fk_taikhoan_vaitro` (`MaVT`);

--
-- Chỉ mục cho bảng `taixe`
--
ALTER TABLE `taixe`
  ADD PRIMARY KEY (`MaTX`),
  ADD KEY `fk_taixe_taikhoan` (`MaTK`);

--
-- Chỉ mục cho bảng `thongbao`
--
ALTER TABLE `thongbao`
  ADD PRIMARY KEY (`MaTB`),
  ADD KEY `fk_thongbao_lichtrinh` (`MaLT`),
  ADD KEY `fk_thongbao_phuhuynh` (`MaPH`);

--
-- Chỉ mục cho bảng `tram`
--
ALTER TABLE `tram`
  ADD PRIMARY KEY (`MaTram`),
  ADD KEY `fk_tram_tuyenduong` (`MaTD`);

--
-- Chỉ mục cho bảng `tuyenduong`
--
ALTER TABLE `tuyenduong`
  ADD PRIMARY KEY (`MaTD`);

--
-- Chỉ mục cho bảng `vaitro`
--
ALTER TABLE `vaitro`
  ADD PRIMARY KEY (`MaVT`);

--
-- Chỉ mục cho bảng `vitrixe`
--
ALTER TABLE `vitrixe`
  ADD PRIMARY KEY (`MaVTXe`),
  ADD KEY `fk_vitrixe_xebuyt` (`MaXB`);

--
-- Chỉ mục cho bảng `xebuyt`
--
ALTER TABLE `xebuyt`
  ADD PRIMARY KEY (`MaXB`);

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `canhbaosuco`
--
ALTER TABLE `canhbaosuco`
  ADD CONSTRAINT `fk_canhbaosuco_lichtrinh` FOREIGN KEY (`MaLT`) REFERENCES `lichtrinh` (`MaLT`),
  ADD CONSTRAINT `fk_canhbaosuco_taixe` FOREIGN KEY (`MaTX`) REFERENCES `taixe` (`MaTX`);

--
-- Các ràng buộc cho bảng `chitietlichtrinh`
--
ALTER TABLE `chitietlichtrinh`
  ADD CONSTRAINT `fk_chitietlichtrinh_lichtrinh` FOREIGN KEY (`MaLT`) REFERENCES `lichtrinh` (`MaLT`),
  ADD CONSTRAINT `fk_chitietlichtrinh_tram` FOREIGN KEY (`MaTram`) REFERENCES `tram` (`MaTram`);

--
-- Các ràng buộc cho bảng `diemdanh`
--
ALTER TABLE `diemdanh`
  ADD CONSTRAINT `fk_diemdanh_hocsinh` FOREIGN KEY (`MaHS`) REFERENCES `hocsinh` (`MaHS`),
  ADD CONSTRAINT `fk_diemdanh_lichtrinh` FOREIGN KEY (`MaLT`) REFERENCES `lichtrinh` (`MaLT`);

--
-- Các ràng buộc cho bảng `hocsinh`
--
ALTER TABLE `hocsinh`
  ADD CONSTRAINT `fk_hocsinh_phuhuynh` FOREIGN KEY (`MaPH`) REFERENCES `phuhuynh` (`MaPH`),
  ADD CONSTRAINT `fk_hocsinh_tram` FOREIGN KEY (`MaTram`) REFERENCES `tram` (`MaTram`);

--
-- Các ràng buộc cho bảng `lichtrinh`
--
ALTER TABLE `lichtrinh`
  ADD CONSTRAINT `fk_lichtrinh_taixe` FOREIGN KEY (`MaTX`) REFERENCES `taixe` (`MaTX`),
  ADD CONSTRAINT `fk_lichtrinh_tuyenduong` FOREIGN KEY (`MaTD`) REFERENCES `tuyenduong` (`MaTD`),
  ADD CONSTRAINT `fk_lichtrinh_xebuyt` FOREIGN KEY (`MaXB`) REFERENCES `xebuyt` (`MaXB`);

--
-- Các ràng buộc cho bảng `phuhuynh`
--
ALTER TABLE `phuhuynh`
  ADD CONSTRAINT `fk_phuhuynh_taikhoan` FOREIGN KEY (`MaTK`) REFERENCES `taikhoan` (`MaTK`);

--
-- Các ràng buộc cho bảng `taikhoan`
--
ALTER TABLE `taikhoan`
  ADD CONSTRAINT `fk_taikhoan_vaitro` FOREIGN KEY (`MaVT`) REFERENCES `vaitro` (`MaVT`);

--
-- Các ràng buộc cho bảng `taixe`
--
ALTER TABLE `taixe`
  ADD CONSTRAINT `fk_taixe_taikhoan` FOREIGN KEY (`MaTK`) REFERENCES `taikhoan` (`MaTK`);

--
-- Các ràng buộc cho bảng `thongbao`
--
ALTER TABLE `thongbao`
  ADD CONSTRAINT `fk_thongbao_lichtrinh` FOREIGN KEY (`MaLT`) REFERENCES `lichtrinh` (`MaLT`),
  ADD CONSTRAINT `fk_thongbao_phuhuynh` FOREIGN KEY (`MaPH`) REFERENCES `phuhuynh` (`MaPH`);

--
-- Các ràng buộc cho bảng `tram`
--
ALTER TABLE `tram`
  ADD CONSTRAINT `fk_tram_tuyenduong` FOREIGN KEY (`MaTD`) REFERENCES `tuyenduong` (`MaTD`);

--
-- Các ràng buộc cho bảng `vitrixe`
--
ALTER TABLE `vitrixe`
  ADD CONSTRAINT `fk_vitrixe_xebuyt` FOREIGN KEY (`MaXB`) REFERENCES `xebuyt` (`MaXB`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
