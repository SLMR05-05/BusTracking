-- 1. Người dùng
CREATE TABLE UserAccount (
    UserId INT AUTO_INCREMENT,
    Username VARCHAR(50) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    Role ENUM('Admin','Driver','Parent') NOT NULL,
    Email VARCHAR(100),
    Phone VARCHAR(20),
    TrangThai ENUM('Active','Inactive') DEFAULT 'Active'
);

-- 2. Trường học
CREATE TABLE TruongHoc (
    TruongId INT AUTO_INCREMENT,
    TenTruong VARCHAR(100) NOT NULL,
    DiaChi VARCHAR(200),
    SoDienThoai VARCHAR(20)
);

-- 3. Học sinh
CREATE TABLE HocSinh (
    HocSinhId INT AUTO_INCREMENT,
    HoTen VARCHAR(100) NOT NULL,
    NgaySinh DATE,
    Lop VARCHAR(20),
    TruongId INT,
    ParentId INT,
    SoDienThoaiPH VARCHAR(20),
    DiaChiNha VARCHAR(200)
);

-- 4. Xe buýt
CREATE TABLE XeBuyt (
    XeId INT AUTO_INCREMENT,
    BienSo VARCHAR(20) UNIQUE NOT NULL,
    DongXe VARCHAR(50),
    SoChoNgoi INT,
    TrangThai ENUM('HoatDong','BaoTri','NgungHoatDong') DEFAULT 'HoatDong'
);

-- 5. Tài xế
CREATE TABLE TaiXe (
    TaiXeId INT AUTO_INCREMENT,
    HoTen VARCHAR(100) NOT NULL,
    SoDienThoai VARCHAR(20),
    SoBangLai VARCHAR(30) UNIQUE NOT NULL,
    SoNamKinhNghiem INT
);

-- 6. Phụ xe
CREATE TABLE PhuXe (
    PhuXeId INT AUTO_INCREMENT,
    HoTen VARCHAR(100) NOT NULL,
    SoDienThoai VARCHAR(20)
);

-- 7. Tuyến đường
CREATE TABLE TuyenDuong (
    TuyenId INT AUTO_INCREMENT,
    TenTuyen VARCHAR(100),
    DiemBatDau VARCHAR(100),
    DiemKetThuc VARCHAR(100),
    QuangDuong DECIMAL(5,2),
    ThoiGianDuKien INT
);

-- 8. Trạm dừng
CREATE TABLE TramDung (
    TramId INT AUTO_INCREMENT,
    TenTram VARCHAR(100) NOT NULL,
    ViDo DECIMAL(10,6),
    KinhDo DECIMAL(10,6),
    DiaChi VARCHAR(200)
);

-- 9. Chi tiết tuyến
CREATE TABLE ChiTietTuyen (
    TuyenId INT,
    TramId INT,
    ThuTu INT
);

-- 10. Phân công học sinh
CREATE TABLE PhanCongHocSinh (
    HocSinhId INT,
    XeId INT,
    TramLenId INT,
    TramXuongId INT
);

-- 11. Lịch chạy
CREATE TABLE LichChay (
    LichId INT AUTO_INCREMENT,
    TuyenId INT,
    XeId INT,
    TaiXeId INT,
    PhuXeId INT,
    GioKhoiHanh DATETIME,
    GioDen DATETIME
);

-- 12. GPS tracking
CREATE TABLE TheoDoiGPS (
    GPSId INT AUTO_INCREMENT,
    XeId INT,
    ViDo DECIMAL(10,6),
    KinhDo DECIMAL(10,6),
    ThoiGian DATETIME
);

-- 13. Thông báo phụ huynh
CREATE TABLE ThongBaoPhuHuynh (
    ThongBaoId INT AUTO_INCREMENT,
    HocSinhId INT,
    LoaiThongBao ENUM('LenXe','XuongXe','DenTruong','VeNha'),
    NoiDung VARCHAR(255),
    ThoiGian DATETIME
);

-- 14. Điểm danh học sinh
CREATE TABLE DiemDanhHocSinh (
    DiemDanhId INT AUTO_INCREMENT,
    HocSinhId INT,
    LichId INT,
    TrangThai ENUM('LenXe','XuongXe','Vang'),
    ThoiGian DATETIME
);

-- 15. Sự cố
CREATE TABLE SuCo (
    SuCoId INT AUTO_INCREMENT,
    LichId INT,
    XeId INT,
    TaiXeId INT,
    LoaiSuCo VARCHAR(100),
    MoTa TEXT,
    ThoiGian DATETIME,
    TrangThai ENUM('Moi','DangXuLy','DaXuLy') DEFAULT 'Moi'
);

-- 16. Tin nhắn
CREATE TABLE TinNhan (
    TinNhanId INT AUTO_INCREMENT,
    NguoiGuiId INT,
    NguoiNhanId INT,
    NoiDung TEXT,
    ThoiGian DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 17. Báo cáo
CREATE TABLE BaoCao (
    BaoCaoId INT AUTO_INCREMENT,
    LoaiBaoCao VARCHAR(100),
    ThoiGianBatDau DATETIME,
    ThoiGianKetThuc DATETIME,
    FileURL VARCHAR(255),
    TaoBoiId INT
);


-- Khóa chính
ALTER TABLE UserAccount ADD PRIMARY KEY (UserId);
ALTER TABLE TruongHoc ADD PRIMARY KEY (TruongId);
ALTER TABLE HocSinh ADD PRIMARY KEY (HocSinhId);
ALTER TABLE XeBuyt ADD PRIMARY KEY (XeId);
ALTER TABLE TaiXe ADD PRIMARY KEY (TaiXeId);
ALTER TABLE PhuXe ADD PRIMARY KEY (PhuXeId);
ALTER TABLE TuyenDuong ADD PRIMARY KEY (TuyenId);
ALTER TABLE TramDung ADD PRIMARY KEY (TramId);
ALTER TABLE ChiTietTuyen ADD PRIMARY KEY (TuyenId, TramId);
ALTER TABLE PhanCongHocSinh ADD PRIMARY KEY (HocSinhId, XeId);
ALTER TABLE LichChay ADD PRIMARY KEY (LichId);
ALTER TABLE TheoDoiGPS ADD PRIMARY KEY (GPSId);
ALTER TABLE ThongBaoPhuHuynh ADD PRIMARY KEY (ThongBaoId);
ALTER TABLE DiemDanhHocSinh ADD PRIMARY KEY (DiemDanhId);
ALTER TABLE SuCo ADD PRIMARY KEY (SuCoId);
ALTER TABLE TinNhan ADD PRIMARY KEY (TinNhanId);
ALTER TABLE BaoCao ADD PRIMARY KEY (BaoCaoId);

-- Khóa ngoại
ALTER TABLE HocSinh ADD CONSTRAINT fk_hocsinh_truong FOREIGN KEY (TruongId) REFERENCES TruongHoc(TruongId);
ALTER TABLE HocSinh ADD CONSTRAINT fk_hocsinh_parent FOREIGN KEY (ParentId) REFERENCES UserAccount(UserId);

ALTER TABLE ChiTietTuyen ADD CONSTRAINT fk_chitiettuyen_tuyen FOREIGN KEY (TuyenId) REFERENCES TuyenDuong(TuyenId);
ALTER TABLE ChiTietTuyen ADD CONSTRAINT fk_chitiettuyen_tram FOREIGN KEY (TramId) REFERENCES TramDung(TramId);

ALTER TABLE PhanCongHocSinh ADD CONSTRAINT fk_pchs_hocsinh FOREIGN KEY (HocSinhId) REFERENCES HocSinh(HocSinhId);
ALTER TABLE PhanCongHocSinh ADD CONSTRAINT fk_pchs_xe FOREIGN KEY (XeId) REFERENCES XeBuyt(XeId);
ALTER TABLE PhanCongHocSinh ADD CONSTRAINT fk_pchs_tramlen FOREIGN KEY (TramLenId) REFERENCES TramDung(TramId);
ALTER TABLE PhanCongHocSinh ADD CONSTRAINT fk_pchs_tramxuong FOREIGN KEY (TramXuongId) REFERENCES TramDung(TramId);

ALTER TABLE LichChay ADD CONSTRAINT fk_lich_tuyen FOREIGN KEY (TuyenId) REFERENCES TuyenDuong(TuyenId);
ALTER TABLE LichChay ADD CONSTRAINT fk_lich_xe FOREIGN KEY (XeId) REFERENCES XeBuyt(XeId);
ALTER TABLE LichChay ADD CONSTRAINT fk_lich_taixe FOREIGN KEY (TaiXeId) REFERENCES TaiXe(TaiXeId);
ALTER TABLE LichChay ADD CONSTRAINT fk_lich_phuxe FOREIGN KEY (PhuXeId) REFERENCES PhuXe(PhuXeId);

ALTER TABLE TheoDoiGPS ADD CONSTRAINT fk_gps_xe FOREIGN KEY (XeId) REFERENCES XeBuyt(XeId);

ALTER TABLE ThongBaoPhuHuynh ADD CONSTRAINT fk_tb_hocsinh FOREIGN KEY (HocSinhId) REFERENCES HocSinh(HocSinhId);

ALTER TABLE DiemDanhHocSinh ADD CONSTRAINT fk_dd_hocsinh FOREIGN KEY (HocSinhId) REFERENCES HocSinh(HocSinhId);
ALTER TABLE DiemDanhHocSinh ADD CONSTRAINT fk_dd_lich FOREIGN KEY (LichId) REFERENCES LichChay(LichId);

ALTER TABLE SuCo ADD CONSTRAINT fk_suco_lich FOREIGN KEY (LichId) REFERENCES LichChay(LichId);
ALTER TABLE SuCo ADD CONSTRAINT fk_suco_xe FOREIGN KEY (XeId) REFERENCES XeBuyt(XeId);
ALTER TABLE SuCo ADD CONSTRAINT fk_suco_taixe FOREIGN KEY (TaiXeId) REFERENCES TaiXe(TaiXeId);

ALTER TABLE TinNhan ADD CONSTRAINT fk_msg_sender FOREIGN KEY (NguoiGuiId) REFERENCES UserAccount(UserId);
ALTER TABLE TinNhan ADD CONSTRAINT fk_msg_receiver FOREIGN KEY (NguoiNhanId) REFERENCES UserAccount(UserId);

ALTER TABLE BaoCao ADD CONSTRAINT fk_baocao_user FOREIGN KEY (TaoBoiId) REFERENCES UserAccount(UserId);
