# Hướng dẫn Socket Realtime cho Phụ Huynh

## Tính năng đã implement

### 1. NotificationPanel Component
- Hiển thị icon chuông thông báo ở góc phải header
- Đếm số thông báo chưa đọc (badge đỏ)
- Animation khi có thông báo mới (bounce + pulse)
- Dropdown panel hiển thị danh sách thông báo
- Browser notification (nếu được phép)
- Âm thanh thông báo (optional)

### 2. Socket.IO Realtime
- Tự động kết nối khi phụ huynh đăng nhập
- Join room theo MaPH: `parent-${parentId}`
- Lắng nghe event: `attendance-update`
- Tự động cập nhật danh sách thông báo
- Tự động tăng số lượng chưa đọc

### 3. Các trang đã tích hợp NotificationPanel
- ✅ ParentDashboard
- ✅ ParentMapView
- ✅ ParentTracking
- ✅ NotificationHistory

### 4. Tự động quản lý trạng thái lịch trình
- ✅ Tự động bắt đầu lịch trình khi đến giờ GioBatDau
- ✅ Tự động kết thúc khi tất cả trạm đã qua (TrangThaiQua = '1')
- ✅ Kiểm tra mỗi 60 giây
- ✅ Thông báo cho phụ huynh ở trạm đầu tiên khi lịch trình bắt đầu

### 5. Thông báo thông minh
- ✅ **Lịch trình bắt đầu**: Phụ huynh có con ở trạm đầu tiên nhận thông báo
- ✅ **Xe đến gần**: Khi xe qua trạm N, phụ huynh ở trạm N+1 nhận thông báo
- ✅ **Xe qua trạm**: Phụ huynh có con ở trạm nhận thông báo (đã lên/chưa lên)
- ✅ **Điểm danh**: Phụ huynh nhận thông báo khi con được điểm danh

## Cách test

### 1. Khởi động backend
```bash
cd backend
npm start
```

### 2. Khởi động frontend
```bash
cd frontend
npm run dev
```

### 3. Đăng nhập với tài khoản phụ huynh
- Username: `parent1` (hoặc tài khoản phụ huynh khác)
- Password: `123456`

### 4. Mở Console để xem logs
- Mở DevTools (F12)
- Tab Console
- Xem logs:
  - `🔌 Connected to socket`
  - `📢 Nhận thông báo mới: {...}`

### 5. Trigger thông báo
Có 2 cách:

#### Cách 1: Tài xế điểm danh học sinh
1. Mở tab khác, đăng nhập với tài khoản tài xế
2. Vào trang Driver Tracking
3. Chọn lịch trình đang chạy
4. Điểm danh học sinh (Đã đón/Chưa đón)
5. Quay lại tab phụ huynh → Thông báo xuất hiện ngay lập tức

#### Cách 2: Tài xế đánh dấu xe qua trạm
1. Tài xế vào Driver Tracking
2. Click "Đánh dấu đã qua" ở một trạm
3. Tất cả phụ huynh có con ở trạm đó sẽ nhận thông báo

### 6. Kiểm tra tính năng
- [ ] Icon chuông có badge đỏ hiển thị số thông báo chưa đọc
- [ ] Click vào chuông → Dropdown hiển thị danh sách
- [ ] Thông báo mới xuất hiện ở đầu danh sách
- [ ] Icon chuông bounce khi có thông báo mới
- [ ] Browser notification xuất hiện (nếu được phép)
- [ ] Click "Đánh dấu đã đọc" → Badge giảm
- [ ] Click "Đánh dấu tất cả" → Badge về 0
- [ ] Thông báo realtime hoạt động ở tất cả các trang

## Troubleshooting

### Socket không kết nối
1. Kiểm tra backend đang chạy: `http://localhost:5000`
2. Kiểm tra CORS trong `backend/server.js`
3. Xem console có lỗi không

### Không nhận được thông báo
1. Kiểm tra `parentId` có đúng không
2. Kiểm tra socket đã join room chưa
3. Kiểm tra backend có emit event không
4. Xem logs trong console

### Browser notification không hiện
1. Cho phép notification trong browser settings
2. Kiểm tra `Notification.permission` trong console

## Code structure

```
frontend/src/
├── components/
│   └── parent/
│       └── NotificationPanel.jsx  ← Component chính
├── views/
│   └── parent/
│       ├── ParentDashboard.jsx    ← Có NotificationPanel
│       ├── ParentMapView.jsx      ← Có NotificationPanel
│       ├── ParentTracking.jsx     ← Có NotificationPanel
│       └── NotificationHistory.jsx ← Có NotificationPanel + Socket

backend/
├── socket/
│   └── socketManager.js           ← Socket.IO manager
├── services/
│   └── notificationService.js     ← Emit notifications
```

## API Endpoints

- `GET /api/parent-notifications/parent/:parentId` - Lấy danh sách thông báo
- `GET /api/parent-notifications/parent/:parentId/unread-count` - Đếm chưa đọc
- `PUT /api/parent-notifications/:notificationId/read` - Đánh dấu đã đọc
- `PUT /api/parent-notifications/parent/:parentId/read-all` - Đánh dấu tất cả

## Socket Events

### Client emit:
- `join-parent-room` - Join room theo parentId

### Server emit:
- `attendance-update` - Thông báo điểm danh mới
- `stop-status-update` - Cập nhật trạng thái trạm

## Các loại thông báo

### 1. `schedule_started` 🚌
- **Khi nào**: Lịch trình bắt đầu (đến giờ GioBatDau)
- **Ai nhận**: Phụ huynh có con ở trạm đầu tiên
- **Nội dung**: "Xe buýt [Tên tuyến] đã bắt đầu chuyến đi. Sẽ đến [Trạm] sớm nhất."
- **Icon**: 🚌 (màu xanh)

### 2. `approaching_stop` ⚠️
- **Khi nào**: Xe vừa qua trạm N (TrangThaiQua = '1')
- **Ai nhận**: Phụ huynh có con ở trạm N+1 (trạm tiếp theo)
- **Nội dung**: "Xe buýt đang đến gần [Trạm]! Vui lòng chuẩn bị."
- **Icon**: ⚠️ (màu vàng)

### 3. `stop_passed_success` ✅
- **Khi nào**: Xe qua trạm và học sinh đã lên xe
- **Ai nhận**: Phụ huynh của học sinh đó
- **Nội dung**: "Xe đã qua [Trạm]. Con [Tên] đã lên xe."
- **Icon**: ✅ (màu xanh lá)

### 4. `stop_passed_missed` ❌
- **Khi nào**: Xe qua trạm nhưng học sinh chưa lên xe
- **Ai nhận**: Phụ huynh của học sinh đó
- **Nội dung**: "Xe đã qua [Trạm]. Con [Tên] CHƯA lên xe!"
- **Icon**: ❌ (màu đỏ)

### 5. `attendance` ✅
- **Khi nào**: Tài xế điểm danh học sinh
- **Ai nhận**: Phụ huynh của học sinh đó
- **Nội dung**: "Con [Tên] đã được đón tại [Trạm]"
- **Icon**: ✅ (màu xanh lá)

## Logic hoạt động

### Khi lịch trình bắt đầu:
1. Server kiểm tra mỗi 60 giây
2. Nếu `NOW() >= GioBatDau` và `TrangThai != 'running'`
3. Cập nhật `TrangThai = 'running'`
4. Gửi thông báo `schedule_started` cho phụ huynh ở trạm đầu tiên

### Khi tài xế đánh dấu trạm đã qua:
1. Cập nhật `chitietlichtrinh.TrangThaiQua = '1'`
2. Gửi thông báo `stop_passed_success/missed` cho phụ huynh ở trạm này
3. Gửi thông báo `approaching_stop` cho phụ huynh ở trạm tiếp theo
4. Kiểm tra nếu tất cả trạm đã qua → Cập nhật `TrangThai = 'completed'`

### Khi tài xế điểm danh:
1. Cập nhật `diemdanh.TrangThai = '2'` (đã đón) hoặc '0' (chưa đón)
2. Gửi thông báo `attendance` cho phụ huynh

## Notes

- Socket tự động reconnect khi mất kết nối
- Thông báo được lưu vào database trước khi emit
- Mỗi phụ huynh có room riêng: `parent-${MaPH}`
- Notification panel tự động refresh khi có thông báo mới
- Auto-check lịch trình chạy mỗi 60 giây
- Lịch trình tự động bắt đầu khi đến giờ
- Lịch trình tự động kết thúc khi tất cả trạm đã qua
