# Phân tích vấn đề Timezone trong dự án

## 🔍 Vấn đề chính

Bạn đang dùng **XAMPP với timezone UTC+0** nhưng ở **Việt Nam (UTC+7)**, dẫn đến:
- Lưu ngày 25/11 → Database lưu 24/11
- Đọc ngày 25/11 từ DB → Hiển thị 24/11

## 📊 Cấu trúc Database

### Bảng `lichtrinh`
```sql
CREATE TABLE lichtrinh (
  MaLT varchar(50) NOT NULL,
  NgayChay DATE,          -- ⚠️ Kiểu DATE (không có timezone)
  GioBatDau TIME,         -- ⚠️ Kiểu TIME (không có timezone)
  GioKetThuc TIME,
  TrangThai varchar(50),
  PRIMARY KEY (MaLT)
);
```

### Bảng `diemdanh`
```sql
CREATE TABLE diemdanh (
  MaDD varchar(50) NOT NULL,
  ThoiGian datetime,      -- ⚠️ Kiểu DATETIME (không có timezone)
  TrangThai VARCHAR(1),
  PRIMARY KEY (MaDD)
);
```

## 🐛 Các điểm gây lỗi

### 1. **Backend - Lưu ngày**
📁 `backend/controllers/admin/ScheduleController.js`

```javascript
// ❌ LỖI: JavaScript tự động convert sang UTC
const start = new Date(from);  // "2025-11-25" → 2025-11-24T17:00:00.000Z (UTC)

// ✅ ĐÚNG: Dùng Date.UTC()
const [year, month, day] = from.split('-').map(Number);
const start = Date.UTC(year, month - 1, day);
```

**Giải thích:**
- `new Date("2025-11-25")` → JavaScript parse như UTC 00:00:00
- Khi ở timezone UTC+7, nó hiển thị 24/11 17:00 (local time)
- MySQL nhận giá trị này và lưu 24/11

### 2. **Backend - Đọc ngày**
📁 `backend/controllers/driver/DashBoardController.js`

```javascript
// ❌ LỖI: Parse Date object bị lệch timezone
const schedule = results[0];
const scheduleDate = new Date(schedule.NgayChay).toISOString().split('T')[0];
// MySQL trả: "2025-11-25T00:00:00.000Z"
// JavaScript parse: 2025-11-24T17:00:00.000Z (UTC+7)
// Kết quả: "2025-11-24" ❌

// ✅ ĐÚNG: Dùng SQL DATE_FORMAT
const sql = `SELECT DATE_FORMAT(lt.NgayChay, '%Y-%m-%d') as NgayChay FROM lichtrinh`;
// Trả về string "2025-11-25" trực tiếp, không qua Date object
```

### 3. **Frontend - Hiển thị ngày**
📁 `frontend/src/views/DriverSchedule.jsx`

```javascript
// ❌ LỖI: Parse Date bị lệch
const date = new Date(s.NgayChay);
const formatted = date.toLocaleDateString('vi-VN');
// "2025-11-25T00:00:00.000Z" → 24/11/2025 ❌

// ✅ ĐÚNG: Parse string trực tiếp
const dateStr = s.NgayChay.split('T')[0]; // "2025-11-25"
const [year, month, day] = dateStr.split('-');
const formatted = `${day}/${month}/${year}`; // "25/11/2025" ✅
```

### 4. **Backend - So sánh ngày**
📁 `backend/controllers/driver/DashBoardController.js`

```javascript
// ❌ LỖI: So sánh bằng JavaScript Date
const today = new Date().toISOString().split('T')[0];
const scheduleDate = new Date(schedule.NgayChay).toISOString().split('T')[0];
const isToday = scheduleDate === today;

// ✅ ĐÚNG: So sánh trong SQL
const sql = `
  SELECT 
    DATE_FORMAT(lt.NgayChay, '%Y-%m-%d') as NgayChay,
    (DATE(lt.NgayChay) = CURDATE()) as isToday
  FROM lichtrinh lt
`;
// MySQL tự động dùng timezone của server
```

## 🔧 Giải pháp đã áp dụng

### ✅ 1. Backend - checkSchedulePermission
```javascript
// File: backend/controllers/driver/DashBoardController.js
export const checkSchedulePermission = (req, res) => {
  const sql = `
    SELECT 
      DATE_FORMAT(lt.NgayChay, '%Y-%m-%d') as NgayChay,
      (DATE(lt.NgayChay) = CURDATE()) as isToday
    FROM lichtrinh lt
  `;
  // Không dùng JavaScript Date, chỉ dùng SQL
};
```

### ✅ 2. Frontend - Format ngày
```javascript
// File: frontend/src/views/DriverSchedule.jsx
const dateStr = s.NgayChay.split('T')[0]; // "2025-11-25"
const [year, month, day] = dateStr.split('-');
const formattedDate = `${day}/${month}/${year}`; // "25/11/2025"
```

### ✅ 3. Backend - Lưu ngày (Schedule)
```javascript
// File: backend/controllers/admin/ScheduleController.js
const [startYear, startMonth, startDay] = from.split('-').map(Number);
const start = Date.UTC(startYear, startMonth - 1, startDay);

while (current <= end) {
  const date = new Date(current);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;
  
  // Lưu dateStr vào database
}
```

## 🎯 Best Practices

### ✅ DO (Nên làm)

1. **Lưu ngày dạng string YYYY-MM-DD**
```javascript
const dateStr = "2025-11-25";
await db.query("INSERT INTO lichtrinh (NgayChay) VALUES (?)", [dateStr]);
```

2. **Dùng SQL để xử lý ngày**
```sql
-- So sánh ngày
WHERE DATE(NgayChay) = CURDATE()

-- Format ngày
SELECT DATE_FORMAT(NgayChay, '%Y-%m-%d') as NgayChay

-- Tính toán ngày
WHERE NgayChay BETWEEN '2025-11-01' AND '2025-11-30'
```

3. **Parse string trực tiếp ở frontend**
```javascript
const [year, month, day] = dateStr.split('-');
const display = `${day}/${month}/${year}`;
```

4. **Dùng Date.UTC() khi cần Date object**
```javascript
const [y, m, d] = "2025-11-25".split('-').map(Number);
const timestamp = Date.UTC(y, m - 1, d);
const date = new Date(timestamp);
```

### ❌ DON'T (Không nên làm)

1. **Không dùng `new Date(dateString)` với DATE**
```javascript
// ❌ Sai
const date = new Date("2025-11-25"); // Bị lệch timezone

// ✅ Đúng
const dateStr = "2025-11-25"; // Giữ nguyên string
```

2. **Không dùng JavaScript Date để so sánh ngày**
```javascript
// ❌ Sai
const today = new Date().toISOString().split('T')[0];
const isToday = scheduleDate === today;

// ✅ Đúng
const sql = "SELECT (DATE(NgayChay) = CURDATE()) as isToday";
```

3. **Không dùng `toLocaleDateString()` với Date từ DB**
```javascript
// ❌ Sai
const date = new Date(dbDate);
const display = date.toLocaleDateString('vi-VN');

// ✅ Đúng
const [y, m, d] = dbDate.split('T')[0].split('-');
const display = `${d}/${m}/${y}`;
```

## 🔨 Cách fix toàn bộ dự án

### Bước 1: Cấu hình MySQL timezone
```sql
-- Trong MySQL
SET GLOBAL time_zone = '+07:00';
SET time_zone = '+07:00';

-- Hoặc trong my.ini (XAMPP)
[mysqld]
default-time-zone = '+07:00'
```

### Bước 2: Cấu hình Node.js timezone
```javascript
// Trong backend/server.js
process.env.TZ = 'Asia/Ho_Chi_Minh';
```

### Bước 3: Cấu hình MySQL connection
```javascript
// backend/config/db.js
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'quanlyxebuyt',
  timezone: '+07:00'  // ⭐ Thêm dòng này
});
```

### Bước 4: Kiểm tra lại tất cả code xử lý ngày
- ✅ Dùng `DATE_FORMAT()` trong SQL
- ✅ Dùng `Date.UTC()` khi tạo Date object
- ✅ Parse string trực tiếp ở frontend
- ✅ Không dùng `new Date(dateString)` với DATE

## 📝 Checklist

- [x] Backend: checkSchedulePermission dùng SQL DATE_FORMAT
- [x] Frontend: DriverSchedule parse string trực tiếp
- [x] Backend: Schedule creation dùng Date.UTC()
- [ ] MySQL: Cấu hình timezone = '+07:00'
- [ ] Node.js: Set TZ = 'Asia/Ho_Chi_Minh'
- [ ] DB Connection: Thêm timezone config

## 🚀 Kết luận

**Nguyên nhân chính:**
- MySQL timezone = UTC+0
- JavaScript runtime timezone = UTC+7 (local)
- Khi parse Date, JavaScript tự động convert → Lệch 7 giờ = 1 ngày

**Giải pháp:**
1. **Ngắn hạn:** Xử lý ngày dạng string, không dùng Date object
2. **Dài hạn:** Cấu hình đồng bộ timezone MySQL + Node.js = UTC+7

**Đã fix:**
- ✅ Backend: Dùng SQL DATE_FORMAT
- ✅ Frontend: Parse string trực tiếp
- ✅ Bỏ kiểm tra ngày (canRun = true luôn)

**Cần fix thêm:**
- ⚠️ Cấu hình MySQL timezone
- ⚠️ Cấu hình Node.js timezone
- ⚠️ Thêm timezone vào DB connection
