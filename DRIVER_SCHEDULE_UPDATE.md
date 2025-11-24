# Cập nhật: Danh sách lịch trình tài xế

## Tổng quan
Đã thay đổi trang lịch trình của tài xế thành danh sách các lịch trình. Khi tài xế bấm vào một lịch trình, hệ thống sẽ hiển thị trang theo dõi xe cho lịch trình đó.

## Các thay đổi chính

### Frontend

1. **Trang mới: DriverScheduleList** (`frontend/src/views/driver/DriverScheduleList.jsx`)
   - Hiển thị danh sách tất cả lịch trình của tài xế
   - Mỗi lịch trình hiển thị: tên tuyến đường, biển số xe, thời gian, loại lịch trình
   - Click vào lịch trình để chuyển đến trang theo dõi xe

2. **Cập nhật DriverTracking** (`frontend/src/views/driver/DriverTracking.jsx`)
   - Nhận `scheduleId` từ URL params
   - Hỗ trợ 2 chế độ:
     - Có `scheduleId`: Hiển thị lịch trình cụ thể
     - Không có `scheduleId`: Hiển thị lịch trình hôm nay (logic cũ)

3. **Cập nhật Routes** (`frontend/src/App.jsx`)
   - Thêm route `/driver-schedules` cho danh sách lịch trình
   - Thêm route `/driver-tracking/:scheduleId` cho theo dõi lịch trình cụ thể

4. **Cập nhật Sidebar** (`frontend/src/components/Sidebar.jsx`)
   - Thêm menu "Danh sách lịch trình" cho tài xế

### Backend

1. **Model** (`backend/models/driver/DashBoardModel.js`)
   - Thêm phương thức `updateStopStatus()` để cập nhật trạng thái trạm đã qua

2. **Controller** (`backend/controllers/driver/DashBoardController.js`)
   - Thêm `updateStopStatus()` để xử lý cập nhật trạng thái trạm

3. **Routes** (`backend/routes/driver/DashBoardRoutes.js`)
   - Thêm route `PUT /api/driver-dashboard/stops/:detailId/status`

## Cách sử dụng

1. Tài xế đăng nhập vào hệ thống
2. Chọn menu "Danh sách lịch trình" trên sidebar
3. Xem danh sách tất cả lịch trình được phân công
4. Click vào lịch trình muốn theo dõi
5. Hệ thống chuyển đến trang theo dõi xe với lịch trình đã chọn

## API Endpoints

### Lấy danh sách lịch trình
```
GET /api/driver-dashboard/schedules
Headers: Authorization: Bearer <token>
```

### Lấy chi tiết lịch trình
```
GET /api/driver-dashboard/schedules/:scheduleId
Headers: Authorization: Bearer <token>
```

### Cập nhật trạng thái trạm
```
PUT /api/driver-dashboard/stops/:detailId/status
Headers: Authorization: Bearer <token>
Body: { "status": "1" }
```
