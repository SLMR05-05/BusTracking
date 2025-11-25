# Flow Tracking Tài Xế - Driver Tracking Flow

## Tổng quan
Tài xế có thể theo dõi và thực hiện lịch trình với flow: Bắt đầu → Đến trạm → Điểm danh → Tiếp tục → Hoàn thành

## Flow chi tiết

### 1️⃣ Chưa bắt đầu (Initial State)
**Hiển thị:**
- Bản đồ với overlay tối
- Nút lớn "🚀 Bắt đầu chạy" (animate pulse)
- Danh sách trạm bên phải (chưa active)

**Điều kiện:**
- `hasStarted = false`
- `canRun = true` (đúng ngày HOẶC đã có điểm danh)

**Action:**
- Click "Bắt đầu chạy" → `hasStarted = true` → Chuyển sang trạm đầu tiên

---

### 2️⃣ Đang di chuyển đến trạm (En Route)
**Hiển thị:**
- Bản đồ hiển thị tuyến đường
- Danh sách trạm:
  - Trạm đã qua: ✓ màu xanh, badge "Hoàn thành"
  - Trạm hiện tại: 🔵 màu xanh dương, badge "Đang đến", animate pulse
  - Trạm sắp tới: ○ màu xám
- Nút "✓ Đã đến trạm" ở góc bản đồ

**Điều kiện:**
- `hasStarted = true`
- `isAtStop = false`

**Action:**
- Click "Đã đến trạm" → `isAtStop = true` → Chuyển sang màn hình điểm danh

---

### 3️⃣ Đã đến trạm - Điểm danh (At Stop - Attendance)
**Hiển thị:**
- Header xanh dương: Tên trạm + "X/Y đã lên xe"
- Danh sách học sinh của trạm:
  - Chưa hoàn thành: Nền trắng, avatar xám
  - Hoàn thành: Nền xanh nhạt, avatar xanh, ✓
- Nút "➜ Tiếp tục hành trình" ở dưới
- Cảnh báo nếu còn học sinh chưa hoàn thành

**Điều kiện:**
- `isAtStop = true`

**Action:**
- Click học sinh → Toggle trạng thái '0' ↔ '2'
- API cập nhật điểm danh
- Tự động cập nhật trạng thái lịch trình

---

### 4️⃣ Tiếp tục hành trình (Continue Route)
**Action:**
- Click "Tiếp tục hành trình"
- Cập nhật trạm hiện tại = completed (TrangThaiQua = '1')
- Nếu còn trạm:
  - `currentStopIndex++`
  - `isAtStop = false`
  - Quay lại bước 2️⃣
- Nếu hết trạm:
  - Alert "🎉 Hoàn thành toàn bộ lộ trình!"
  - `isAtStop = false`

---

### 5️⃣ Hoàn thành (Completed)
**Hiển thị:**
- Tất cả trạm có ✓ xanh
- Thông báo hoàn thành
- Có thể xem lại danh sách trạm

---

## Trạng thái dữ liệu

### State Management
```javascript
const [hasStarted, setHasStarted] = useState(false);  // Đã bắt đầu chạy chưa
const [isAtStop, setIsAtStop] = useState(false);      // Đang ở trạm không
const [currentStopIndex, setCurrentStopIndex] = useState(0); // Trạm hiện tại
const [canRun, setCanRun] = useState(false);          // Có quyền chạy không
```

### Database Updates
1. **Điểm danh học sinh:**
   - Table: `diemdanh`
   - Field: `TrangThai` = '0' hoặc '2'
   - Trigger: Tự động cập nhật `lichtrinh.TrangThai`

2. **Hoàn thành trạm:**
   - Table: `chitietlichtrinh`
   - Field: `TrangThaiQua` = '1'

3. **Trạng thái lịch trình:**
   - Table: `lichtrinh`
   - Field: `TrangThai` = 'pending' hoặc 'completed'
   - Tự động tính: Tất cả điểm danh = '2' → 'completed'

---

## UI Components

### Nút "Bắt đầu chạy"
```jsx
<button className="bg-green-600 text-white px-8 py-4 rounded-xl animate-pulse">
  🚀 Bắt đầu chạy
</button>
```

### Danh sách trạm
- Timeline vertical với line connector
- Icon: ✓ (completed), 🔵 (current), ○ (pending)
- Badge: "Hoàn thành", "Đang đến"

### Danh sách học sinh
- Card với avatar tròn
- Click để toggle
- Màu: Xám (pending) → Xanh (completed)

### Nút "Tiếp tục hành trình"
```jsx
<button className="w-full bg-blue-600 text-white p-3 rounded-lg">
  ➜ Tiếp tục hành trình
</button>
```

---

## Testing Scenarios

### ✅ Test 1: Bắt đầu chạy
1. Login tài xế
2. Vào tracking
3. Thấy nút "Bắt đầu chạy"
4. Click → Chuyển sang trạm đầu tiên

### ✅ Test 2: Điểm danh
1. Click "Đã đến trạm"
2. Thấy danh sách học sinh
3. Click học sinh → Chuyển màu xanh
4. Click lại → Chuyển về xám

### ✅ Test 3: Tiếp tục
1. Điểm danh xong
2. Click "Tiếp tục hành trình"
3. Trạm hiện tại → ✓ xanh
4. Chuyển sang trạm kế tiếp

### ✅ Test 4: Hoàn thành
1. Đến trạm cuối
2. Điểm danh xong
3. Click "Tiếp tục"
4. Thấy thông báo hoàn thành

### ✅ Test 5: Quyền chạy
1. Lịch không đúng ngày → Không thấy nút "Bắt đầu"
2. Lịch đúng ngày → Thấy nút "Bắt đầu"
3. Lịch đã bắt đầu (có điểm danh) → Thấy nút "Bắt đầu"

---

## Lưu ý kỹ thuật

1. **Kiểm tra quyền:** Mọi action đều check `canRun` trước
2. **Tự động cập nhật:** Sau mỗi điểm danh, backend tự động cập nhật trạng thái lịch trình
3. **Responsive:** UI hoạt động tốt trên mobile và desktop
4. **Feedback:** Vibration khi đến trạm (nếu device hỗ trợ)
5. **Error handling:** Alert rõ ràng khi có lỗi

---

## Files liên quan

- `frontend/src/views/driver/DriverTracking.jsx` - Main component
- `backend/controllers/driver/DashBoardController.js` - API logic
- `backend/routes/driver/DashBoardRoutes.js` - Routes
- `frontend/src/components/RouteMap.jsx` - Map component
