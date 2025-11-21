# Cập nhật: Kiểu dữ liệu DATE và TIME cho bảng lichtrinh

## Tổng quan

Đã cập nhật kiểu dữ liệu của bảng `lichtrinh` để sử dụng kiểu dữ liệu chuẩn của MySQL:

### Trước:
```sql
NgayChay varchar(50)    -- Lưu dạng "dd-mm-yyyy"
GioBatDau varchar(50)   -- Lưu dạng "HH:MM"
GioKetThuc varchar(50)  -- Lưu dạng "HH:MM"
```

### Sau:
```sql
NgayChay DATE           -- Lưu dạng YYYY-MM-DD
GioBatDau TIME          -- Lưu dạng HH:MM:SS
GioKetThuc TIME         -- Lưu dạng HH:MM:SS
```

---

## Lợi ích

### 1. Hiệu suất
- ✅ Tìm kiếm và so sánh nhanh hơn
- ✅ Sắp xếp chính xác hơn
- ✅ Tiết kiệm dung lượng lưu trữ

### 2. Tính năng
- ✅ Sử dụng được các hàm DATE/TIME của MySQL
- ✅ Tính toán khoảng thời gian dễ dàng
- ✅ Validate tự động bởi database

### 3. Chuẩn hóa
- ✅ Tuân thủ chuẩn SQL
- ✅ Dễ tích hợp với các hệ thống khác
- ✅ Tránh lỗi format không nhất quán

---

## Các thay đổi chi tiết

### 1. Database Schema

#### database.sql
```sql
CREATE TABLE lichtrinh (
  MaLT varchar(50) NOT NULL,
  MaXB varchar(50),
  MaTD varchar(50),
  MaTX varchar(50),
  NgayChay DATE,          -- ✅ Đã đổi từ varchar(50)
  GioBatDau TIME,         -- ✅ Đã đổi từ varchar(50)
  GioKetThuc TIME,        -- ✅ Đã đổi từ varchar(50)
  TrangThai varchar(50),
  TrangThaiXoa varchar(1),
  PRIMARY KEY (MaLT)
);
```

---

### 2. Backend Changes

#### ScheduleController.js

**createSchedule():**
```javascript
const scheduleData = {
  MaLT: req.body.MaLT,
  MaXB: req.body.MaXB,
  MaTD: req.body.MaTD,
  MaTX: req.body.MaTX,
  NgayChay: req.body.NgayChay,      // Format: YYYY-MM-DD
  GioBatDau: req.body.GioBatDau,    // Format: HH:MM:SS
  GioKetThuc: req.body.GioKetThuc,  // Format: HH:MM:SS
  TrangThai: req.body.TrangThai || 'pending',
  TrangThaiXoa: '0'
};
```

**updateSchedule():**
```javascript
const scheduleData = {
  MaXB: req.body.MaXB,
  MaTD: req.body.MaTD,
  MaTX: req.body.MaTX,
  NgayChay: req.body.NgayChay,      // Format: YYYY-MM-DD
  GioBatDau: req.body.GioBatDau,    // Format: HH:MM:SS
  GioKetThuc: req.body.GioKetThuc,  // Format: HH:MM:SS
  TrangThai: req.body.TrangThai
};
```

---

### 3. Frontend Changes

#### Schedule.jsx

**Helper Functions (MỚI):**

```javascript
// Format date for display (dd/mm/yyyy)
const formatDateDisplay = (dateStr) => {
  if (!dateStr) return '';
  
  try {
    // dateStr is in YYYY-MM-DD format from database
    const date = new Date(dateStr + 'T00:00:00');
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('vi-VN');
    }
    return dateStr;
  } catch (error) {
    return dateStr;
  }
};

// Format time for display (HH:MM)
const formatTimeDisplay = (timeStr) => {
  if (!timeStr) return '';
  
  // timeStr is in HH:MM:SS format from database
  // Return only HH:MM
  return timeStr.substring(0, 5);
};

// Convert time input to HH:MM:SS format
const formatTimeForBackend = (timeStr) => {
  if (!timeStr) return '';
  
  // If already has seconds
  if (timeStr.length === 8) return timeStr;
  
  // Add :00 seconds
  return `${timeStr}:00`;
};
```

**Xóa các hàm cũ:**
- ❌ `parseDate()` - Không cần nữa
- ❌ `formatDateForBackend()` - Không cần convert dd-mm-yyyy

**Cập nhật handleSubmit():**
```javascript
const scheduleData = {
  MaLT: `LT${timestamp}${random}`,
  MaTD: formData.MaTD,
  MaTX: formData.MaTX,
  MaXB: formData.MaXB,
  NgayChay: date, // Already in YYYY-MM-DD format from date input
  GioBatDau: formatTimeForBackend(formData.GioBatDau), // Convert to HH:MM:SS
  GioKetThuc: formatTimeForBackend(formData.GioKetThuc), // Convert to HH:MM:SS
  TrangThai: 'pending'
};
```

**Cập nhật filter:**
```javascript
// TRƯỚC
.filter(s => s.TrangThaiXoa === '0' && (!searchDate || formatDateForBackend(searchDate) === s.NgayChay))

// SAU
.filter(s => s.TrangThaiXoa === '0' && (!searchDate || searchDate === s.NgayChay))
```

**Cập nhật sort:**
```javascript
// TRƯỚC
const dateA = parseDate(a.NgayChay);
const dateB = parseDate(b.NgayChay);
return new Date(dateA) - new Date(dateB);

// SAU
// NgayChay is already in YYYY-MM-DD format
return new Date(a.NgayChay) - new Date(b.NgayChay);
```

**Cập nhật UI hiển thị:**
```javascript
// Hiển thị thời gian
{formatTimeDisplay(schedule.GioBatDau)} - {formatTimeDisplay(schedule.GioKetThuc)}

// Hiển thị ngày
{formatDateDisplay(schedule.NgayChay)}
```

---

## Format dữ liệu

### Input từ Frontend:
```javascript
// Date input (type="date")
NgayChay: "2024-11-21"  // YYYY-MM-DD

// Time input (type="time")
GioBatDau: "07:00"      // HH:MM
GioKetThuc: "09:00"     // HH:MM
```

### Gửi đến Backend:
```javascript
{
  NgayChay: "2024-11-21",     // YYYY-MM-DD
  GioBatDau: "07:00:00",      // HH:MM:SS (đã thêm :00)
  GioKetThuc: "09:00:00"      // HH:MM:SS (đã thêm :00)
}
```

### Lưu trong Database:
```sql
NgayChay: DATE '2024-11-21'
GioBatDau: TIME '07:00:00'
GioKetThuc: TIME '09:00:00'
```

### Trả về Frontend:
```javascript
{
  NgayChay: "2024-11-21",     // YYYY-MM-DD
  GioBatDau: "07:00:00",      // HH:MM:SS
  GioKetThuc: "09:00:00"      // HH:MM:SS
}
```

### Hiển thị cho User:
```
Ngày: 21/11/2024        // dd/mm/yyyy
Giờ: 07:00 - 09:00      // HH:MM
```

---

## Migration Steps

### Bước 1: Backup Database
```bash
mysqldump -u root -p quanlyxebuyt > backup_before_datetime_update.sql
```

### Bước 2: Chạy Migration
```bash
mysql -u root -p quanlyxebuyt < migration-update-datetime-types.sql
```

**Lưu ý:** Migration này sẽ **TRUNCATE** bảng lichtrinh (xóa tất cả dữ liệu). Nếu muốn giữ dữ liệu cũ, cần uncomment phần restore trong migration script và đảm bảo format dữ liệu cũ đúng.

### Bước 3: Kiểm tra
```sql
-- Kiểm tra cấu trúc
DESCRIBE lichtrinh;

-- Kiểm tra dữ liệu (nếu có)
SELECT * FROM lichtrinh LIMIT 5;
```

### Bước 4: Restart Backend
```bash
cd backend
npm start
```

### Bước 5: Test Frontend
1. Tạo lịch trình mới
2. Kiểm tra ngày giờ hiển thị đúng
3. Kiểm tra filter theo ngày
4. Kiểm tra sort theo ngày

---

## Testing Checklist

### Database:
- [ ] Cột NgayChay có kiểu DATE
- [ ] Cột GioBatDau có kiểu TIME
- [ ] Cột GioKetThuc có kiểu TIME
- [ ] Insert dữ liệu mới thành công
- [ ] Query theo ngày hoạt động đúng

### Backend:
- [ ] API tạo lịch trình nhận đúng format
- [ ] API trả về đúng format
- [ ] Validation hoạt động
- [ ] Không có lỗi khi save/update

### Frontend:
- [ ] Input date hiển thị đúng
- [ ] Input time hiển thị đúng
- [ ] Tạo lịch trình thành công
- [ ] Ngày hiển thị dạng dd/mm/yyyy
- [ ] Giờ hiển thị dạng HH:MM
- [ ] Filter theo ngày hoạt động
- [ ] Sort theo ngày hoạt động
- [ ] Chi tiết lịch trình hiển thị đúng

---

## Ví dụ sử dụng MySQL Functions

Với kiểu dữ liệu mới, có thể sử dụng các hàm MySQL:

```sql
-- Lấy lịch trình trong tuần này
SELECT * FROM lichtrinh 
WHERE YEARWEEK(NgayChay) = YEARWEEK(NOW());

-- Lấy lịch trình trong tháng này
SELECT * FROM lichtrinh 
WHERE YEAR(NgayChay) = YEAR(NOW()) 
  AND MONTH(NgayChay) = MONTH(NOW());

-- Tính thời gian chạy
SELECT 
  MaLT,
  TIMEDIFF(GioKetThuc, GioBatDau) as ThoiGianChay
FROM lichtrinh;

-- Lấy lịch trình bắt đầu sau 7:00
SELECT * FROM lichtrinh 
WHERE GioBatDau > '07:00:00';

-- Lấy lịch trình trong khoảng thời gian
SELECT * FROM lichtrinh 
WHERE NgayChay BETWEEN '2024-11-01' AND '2024-11-30';
```

---

## Rollback

Nếu cần rollback:

```sql
-- Restore từ backup
mysql -u root -p quanlyxebuyt < backup_before_datetime_update.sql

-- Hoặc đổi lại kiểu dữ liệu
ALTER TABLE lichtrinh 
  MODIFY COLUMN NgayChay varchar(50),
  MODIFY COLUMN GioBatDau varchar(50),
  MODIFY COLUMN GioKetThuc varchar(50);
```

---

## Files đã thay đổi

### Modified:
1. `database.sql` - Cập nhật schema
2. `backend/controllers/ScheduleController.js` - Thêm comment format
3. `frontend/src/views/admin/Schedule.jsx` - Cập nhật helper functions và logic

### New:
4. `migration-update-datetime-types.sql` - Migration script
5. `UPDATE_DATETIME_TYPES.md` - Tài liệu này

---

## Lưu ý quan trọng

### 1. Timezone
- MySQL lưu DATE và TIME không có timezone
- Frontend nên sử dụng local timezone của user
- Cẩn thận khi so sánh với `NOW()` hoặc `CURDATE()`

### 2. Validation
- Frontend: HTML5 input validation tự động
- Backend: MySQL tự động validate format
- Nên thêm validation bổ sung nếu cần

### 3. API Response
- MySQL trả về DATE dạng "YYYY-MM-DD"
- MySQL trả về TIME dạng "HH:MM:SS"
- Frontend cần format lại để hiển thị

### 4. Compatibility
- Đảm bảo tất cả client đều cập nhật code mới
- Test kỹ trước khi deploy production
- Có kế hoạch rollback nếu cần

---

## Tác giả
- Ngày cập nhật: 2024
- Version: 3.0.0
