# API Documentation - Smart School Bus System

Base URL: `http://localhost:5000/api`

## Authentication
Tất cả API (trừ login) cần gửi token trong header:
```
Authorization: Bearer <token>
```

---

## 1. Users API (`/api/users`)

### POST /login
Đăng nhập
```json
Request: { "username": "admin", "password": "admin123" }
Response: { "token": "...", "user": {...} }
```

### POST /logout
Đăng xuất

### GET /me
Lấy thông tin user hiện tại

---

## 2. Drivers API (`/api/drivers`)

### GET /
Lấy tất cả tài xế

### GET /:id
Lấy tài xế theo ID

### POST /
Tạo tài xế mới
```json
{
  "MaTX": "TX001",
  "TenTX": "Nguyễn Văn A",
  "SoCCCD": "001234567890",
  "BLX": "B2",
  "DiaChi": "Hà Nội",
  "SDT": "0912345678"
}
```

### PUT /:id
Cập nhật tài xế

### DELETE /:id
Xóa tài xế (soft delete)

### GET /:id/schedule?date=2024-01-01
Lấy lịch trình của tài xế theo ngày

---

## 3. Students API (`/api/students`)

### GET /
Lấy tất cả học sinh

### GET /:id
Lấy học sinh theo ID

### POST /
Tạo học sinh mới
```json
{
  "MaHS": "HS001",
  "MaPH": "PH001",
  "MaTram": "T001",
  "TenHS": "Trần Văn B",
  "Lop": "10A1",
  "DiaChi": "Hà Nội"
}
```

### PUT /:id
Cập nhật học sinh

### DELETE /:id
Xóa học sinh

### GET /route/:routeId
Lấy học sinh theo tuyến đường

---

## 4. Parents API (`/api/parents`)

### GET /
Lấy tất cả phụ huynh

### GET /:id
Lấy phụ huynh theo ID

### POST /
Tạo phụ huynh mới
```json
{
  "MaPH": "PH001",
  "TenPH": "Nguyễn Thị C",
  "SDT": "0987654321",
  "DiaChi": "Hà Nội"
}
```

### PUT /:id
Cập nhật phụ huynh

### DELETE /:id
Xóa phụ huynh

### GET /:id/children
Lấy danh sách con của phụ huynh

---

## 5. Buses API (`/api/buses`)

### GET /
Lấy tất cả xe buýt

### GET /:id
Lấy xe buýt theo ID

### POST /
Tạo xe buýt mới
```json
{
  "MaXB": "XB001",
  "BienSo": "29A-12345",
  "SucChua": "45",
  "TrangThai": "available"
}
```

### PUT /:id
Cập nhật xe buýt

### DELETE /:id
Xóa xe buýt

### GET /:id/location
Lấy vị trí xe buýt

### POST /:id/location
Cập nhật vị trí xe buýt
```json
{
  "MaVTXe": "VT001",
  "KinhDo": "105.8342",
  "ViDo": "21.0278",
  "TrangThaiXe": "running"
}
```

---

## 6. Routes API (`/api/routes`)

### GET /
Lấy tất cả tuyến đường

### GET /:id
Lấy tuyến đường theo ID

### POST /
Tạo tuyến đường mới
```json
{
  "MaTD": "TD001",
  "BatDau": "Trường ABC",
  "KetThuc": "Khu đô thị XYZ",
  "TenTuyenDuong": "Tuyến 1"
}
```

### PUT /:id
Cập nhật tuyến đường

### DELETE /:id
Xóa tuyến đường

### GET /:id/stops
Lấy điểm dừng của tuyến đường

### POST /:id/stops
Thêm điểm dừng
```json
{
  "MaTram": "T001",
  "TenTram": "Điểm dừng 1",
  "DiaChi": "123 Đường ABC",
  "KinhDo": "105.8342",
  "ViDo": "21.0278"
}
```

### PUT /:id/stops/:stopId
Cập nhật điểm dừng

### DELETE /:id/stops/:stopId
Xóa điểm dừng

---

## 7. Schedules API (`/api/schedules`)

### GET /
Lấy tất cả lịch trình

### GET /by-date?date=2024-01-01
Lấy lịch trình theo ngày

### GET /:id
Lấy lịch trình theo ID

### POST /
Tạo lịch trình mới
```json
{
  "MaLT": "LT001",
  "MaXB": "XB001",
  "MaTD": "TD001",
  "MaTX": "TX001",
  "NgayChay": "2024-01-01",
  "GioBatDau": "07:00",
  "GioKetThuc": "08:30",
  "TrangThai": "pending"
}
```

### PUT /:id
Cập nhật lịch trình

### DELETE /:id
Xóa lịch trình

### GET /:id/details
Lấy chi tiết lịch trình (điểm dừng)

### POST /:id/details
Thêm điểm dừng vào lịch trình
```json
{
  "MaCTLT": "CTLT001",
  "MaTram": "T001",
  "ThuTu": "1"
}
```

### PUT /details/:detailId/status
Cập nhật trạng thái điểm dừng
```json
{
  "status": "1"
}
```

---

## 8. Attendance API (`/api/attendance`)

### GET /schedule/:scheduleId
Lấy điểm danh theo lịch trình

### POST /
Tạo điểm danh
```json
{
  "MaDD": "DD001",
  "MaLT": "LT001",
  "MaHS": "HS001",
  "TrangThai": "0"
}
```

### PUT /:id/status
Cập nhật trạng thái điểm danh
```json
{
  "status": "1"
}
```
Trạng thái: 0=chưa đón, 1=đã đón, 2=đã trả

### GET /student/:studentId/history
Lấy lịch sử điểm danh của học sinh

---

## 9. Notifications API (`/api/notifications`)

### GET /parent/:parentId
Lấy thông báo của phụ huynh

### POST /
Tạo thông báo
```json
{
  "MaTB": "TB001",
  "MaLT": "LT001",
  "MaPH": "PH001",
  "NoiDung": "Xe buýt đang trên đường đến"
}
```

### DELETE /:id
Xóa thông báo

---

## Status Codes

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Server Error
