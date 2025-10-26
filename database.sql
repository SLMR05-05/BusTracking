-- 1. Người dùng
CREATE TABLE UserAccount (
    UserId INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    Role ENUM('Admin','Driver','Parent') NOT NULL,
    Email VARCHAR(100),
    Phone VARCHAR(20),
    TrangThai ENUM('Active','Inactive') DEFAULT 'Active'
) ENGINE=InnoDB;

-- 2. Trường học
CREATE TABLE TruongHoc (
    TruongId INT AUTO_INCREMENT PRIMARY KEY,
    TenTruong VARCHAR(100) NOT NULL,
    DiaChi VARCHAR(200),
    SoDienThoai VARCHAR(20)
) ENGINE=InnoDB;

-- 3. Học sinh
CREATE TABLE HocSinh (
    HocSinhId INT AUTO_INCREMENT PRIMARY KEY,
    HoTen VARCHAR(100) NOT NULL,
    NgaySinh DATE,
    Lop VARCHAR(20),
    TruongId INT,
    ParentId INT,
    SoDienThoaiPH VARCHAR(20),
    DiaChiNha VARCHAR(200),
    FOREIGN KEY (TruongId) REFERENCES TruongHoc(TruongId),
    FOREIGN KEY (ParentId) REFERENCES UserAccount(UserId)
) ENGINE=InnoDB;

-- 4. Xe buýt
CREATE TABLE XeBuyt (
    XeId INT AUTO_INCREMENT PRIMARY KEY,
    BienSo VARCHAR(20) UNIQUE NOT NULL,
    DongXe VARCHAR(50),
    SoChoNgoi INT,
    TrangThai ENUM('HoatDong','BaoTri','NgungHoatDong') DEFAULT 'HoatDong'
) ENGINE=InnoDB;

-- 5. Tài xế
CREATE TABLE TaiXe (
    TaiXeId INT AUTO_INCREMENT PRIMARY KEY,
    HoTen VARCHAR(100) NOT NULL,
    SoDienThoai VARCHAR(20),
    SoBangLai VARCHAR(30) UNIQUE NOT NULL,
    SoNamKinhNghiem INT
) ENGINE=InnoDB;

-- 6. Phụ xe
CREATE TABLE PhuXe (
    PhuXeId INT AUTO_INCREMENT PRIMARY KEY,
    HoTen VARCHAR(100) NOT NULL,
    SoDienThoai VARCHAR(20)
) ENGINE=InnoDB;

-- 7. Tuyến đường
CREATE TABLE TuyenDuong (
    TuyenId INT AUTO_INCREMENT PRIMARY KEY,
    TenTuyen VARCHAR(100),
    DiemBatDau VARCHAR(100),
    DiemKetThuc VARCHAR(100),
    QuangDuong DECIMAL(5,2),
    ThoiGianDuKien INT
) ENGINE=InnoDB;

-- 8. Trạm dừng
CREATE TABLE TramDung (
    TramId INT AUTO_INCREMENT PRIMARY KEY,
    TenTram VARCHAR(100) NOT NULL,
    ViDo DECIMAL(10,6),
    KinhDo DECIMAL(10,6),
    DiaChi VARCHAR(200)
) ENGINE=InnoDB;

-- 9. Chi tiết tuyến
CREATE TABLE ChiTietTuyen (
    TuyenId INT,
    TramId INT,
    ThuTu INT,
    PRIMARY KEY (TuyenId, TramId),
    FOREIGN KEY (TuyenId) REFERENCES TuyenDuong(TuyenId),
    FOREIGN KEY (TramId) REFERENCES TramDung(TramId)
) ENGINE=InnoDB;

-- 10. Phân công học sinh
CREATE TABLE PhanCongHocSinh (
    HocSinhId INT,
    XeId INT,
    TramLenId INT,
    TramXuongId INT,
    PRIMARY KEY (HocSinhId, XeId),
    FOREIGN KEY (HocSinhId) REFERENCES HocSinh(HocSinhId),
    FOREIGN KEY (XeId) REFERENCES XeBuyt(XeId),
    FOREIGN KEY (TramLenId) REFERENCES TramDung(TramId),
    FOREIGN KEY (TramXuongId) REFERENCES TramDung(TramId)
) ENGINE=InnoDB;

-- 11. Lịch chạy
CREATE TABLE LichChay (
    LichId INT AUTO_INCREMENT PRIMARY KEY,
    TuyenId INT,
    XeId INT,
    TaiXeId INT,
    PhuXeId INT,
    GioKhoiHanh DATETIME,
    GioDen DATETIME,
    FOREIGN KEY (TuyenId) REFERENCES TuyenDuong(TuyenId),
    FOREIGN KEY (XeId) REFERENCES XeBuyt(XeId),
    FOREIGN KEY (TaiXeId) REFERENCES TaiXe(TaiXeId),
    FOREIGN KEY (PhuXeId) REFERENCES PhuXe(PhuXeId)
) ENGINE=InnoDB;

-- 12. GPS tracking
CREATE TABLE TheoDoiGPS (
    GPSId INT AUTO_INCREMENT PRIMARY KEY,
    XeId INT,
    ViDo DECIMAL(10,6),
    KinhDo DECIMAL(10,6),
    ThoiGian DATETIME,
    FOREIGN KEY (XeId) REFERENCES XeBuyt(XeId)
) ENGINE=InnoDB;

-- 13. Thông báo phụ huynh
CREATE TABLE ThongBaoPhuHuynh (
    ThongBaoId INT AUTO_INCREMENT PRIMARY KEY,
    HocSinhId INT,
    LoaiThongBao ENUM('LenXe','XuongXe','DenTruong','VeNha'),
    NoiDung VARCHAR(255),
    ThoiGian DATETIME,
    FOREIGN KEY (HocSinhId) REFERENCES HocSinh(HocSinhId)
) ENGINE=InnoDB;

-- 14. Điểm danh học sinh
CREATE TABLE DiemDanhHocSinh (
    DiemDanhId INT AUTO_INCREMENT PRIMARY KEY,
    HocSinhId INT,
    LichId INT,
    TrangThai ENUM('LenXe','XuongXe','Vang'),
    ThoiGian DATETIME,
    FOREIGN KEY (HocSinhId) REFERENCES HocSinh(HocSinhId),
    FOREIGN KEY (LichId) REFERENCES LichChay(LichId)
) ENGINE=InnoDB;

-- 15. Sự cố
CREATE TABLE SuCo (
    SuCoId INT AUTO_INCREMENT PRIMARY KEY,
    LichId INT,
    XeId INT,
    TaiXeId INT,
    LoaiSuCo VARCHAR(100),
    MoTa TEXT,
    ThoiGian DATETIME,
    TrangThai ENUM('Moi','DangXuLy','DaXuLy') DEFAULT 'Moi',
    FOREIGN KEY (LichId) REFERENCES LichChay(LichId),
    FOREIGN KEY (XeId) REFERENCES XeBuyt(XeId),
    FOREIGN KEY (TaiXeId) REFERENCES TaiXe(TaiXeId)
) ENGINE=InnoDB;

-- 16. Tin nhắn
CREATE TABLE TinNhan (
    TinNhanId INT AUTO_INCREMENT PRIMARY KEY,
    NguoiGuiId INT,
    NguoiNhanId INT,
    NoiDung TEXT,
    ThoiGian DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (NguoiGuiId) REFERENCES UserAccount(UserId),
    FOREIGN KEY (NguoiNhanId) REFERENCES UserAccount(UserId)
) ENGINE=InnoDB;

-- 17. Báo cáo
CREATE TABLE BaoCao (
    BaoCaoId INT AUTO_INCREMENT PRIMARY KEY,
    LoaiBaoCao VARCHAR(100),
    ThoiGianBatDau DATETIME,
    ThoiGianKetThuc DATETIME,
    FileURL VARCHAR(255),
    TaoBoiId INT,
    FOREIGN KEY (TaoBoiId) REFERENCES UserAccount(UserId)
) ENGINE=InnoDB;
