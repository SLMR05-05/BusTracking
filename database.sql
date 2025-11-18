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
  ThuTu varchar(50),
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
  NgayChay varchar(50),
  GioBatDau varchar(50),
  GioKetThuc varchar(50),
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
  NoiDung varchar(255),
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
  ADD CONSTRAINT fk_thongbao_phuhuynh FOREIGN KEY (MaPH) REFERENCES phuhuynh(MaPH);

ALTER TABLE tram
  ADD CONSTRAINT fk_tram_tuyenduong FOREIGN KEY (MaTD) REFERENCES tuyenduong(MaTD);

ALTER TABLE vitrixe
  ADD CONSTRAINT fk_vitrixe_xebuyt FOREIGN KEY (MaXB) REFERENCES xebuyt(MaXB);

ALTER TABLE lichtrinh
  ADD CONSTRAINT fk_lichtrinh_taixe FOREIGN KEY (MaTX) REFERENCES taixe(MaTX);

ALTER TABLE diemdanh
  ADD CONSTRAINT fk_diemdanh_lichtrinh FOREIGN KEY (MaLT) REFERENCES lichtrinh(MaLT),
  ADD CONSTRAINT fk_diemdanh_hocsinh FOREIGN KEY (MaHS) REFERENCES hocsinh(MaHS);
  


