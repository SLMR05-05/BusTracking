# Backend - Smart School Bus System

## Cấu trúc thư mục

```
backend/
├── config/
│   └── db.js                    # Kết nối MySQL
├── models/                      # Tương tác database
│   ├── UserModel.js
│   ├── DriverModel.js
│   ├── StudentModel.js
│   ├── ParentModel.js
│   ├── BusModel.js
│   ├── RouteModel.js
│   ├── ScheduleModel.js
│   ├── AttendanceModel.js
│   └── NotificationModel.js
├── controllers/                 # Xử lý logic
│   ├── UserController.js
│   ├── DriverController.js
│   ├── StudentController.js
│   ├── ParentController.js
│   ├── BusController.js
│   ├── RouteController.js
│   ├── ScheduleController.js
│   ├── AttendanceController.js
│   └── NotificationController.js
├── routes/                      # Định nghĩa API endpoints
│   ├── UserRoutes.js
│   ├── DriverRoutes.js
│   ├── StudentRoutes.js
│   ├── ParentRoutes.js
│   ├── BusRoutes.js
│   ├── RouteRoutes.js
│   ├── ScheduleRoutes.js
│   ├── AttendanceRoutes.js
│   └── NotificationRoutes.js
├── middleware/
│   └── authMiddleware.js        # Xác thực JWT
├── server.js                    # Entry point
├── package.json
└── API_DOCUMENTATION.md         # Tài liệu API
```

## Cài đặt

```bash
cd backend
npm install
```

## Cấu hình Database

Chỉnh sửa `config/db.js`:
```javascript
host: "localhost",
user: "root",
password: "your_password",
database: "quanlyxebuyt"
```

## Chạy server

```bash
# Development
npm run dev

# Production
npm start
```

Server chạy tại: `http://localhost:5000`

## API Endpoints

### Users
- POST `/api/users/login` - Đăng nhập
- GET `/api/users/me` - Lấy thông tin user

### Drivers
- GET `/api/drivers` - Lấy tất cả tài xế
- POST `/api/drivers` - Tạo tài xế
- PUT `/api/drivers/:id` - Cập nhật tài xế
- DELETE `/api/drivers/:id` - Xóa tài xế

### Students
- GET `/api/students` - Lấy tất cả học sinh
- POST `/api/students` - Tạo học sinh
- PUT `/api/students/:id` - Cập nhật học sinh
- DELETE `/api/students/:id` - Xóa học sinh

### Parents
- GET `/api/parents` - Lấy tất cả phụ huynh
- GET `/api/parents/:id/children` - Lấy con của phụ huynh

### Buses
- GET `/api/buses` - Lấy tất cả xe buýt
- GET `/api/buses/:id/location` - Lấy vị trí xe
- POST `/api/buses/:id/location` - Cập nhật vị trí xe

### Routes
- GET `/api/routes` - Lấy tất cả tuyến đường
- GET `/api/routes/:id/stops` - Lấy điểm dừng
- POST `/api/routes/:id/stops` - Thêm điểm dừng

### Schedules
- GET `/api/schedules` - Lấy tất cả lịch trình
- GET `/api/schedules/by-date?date=2024-01-01` - Lấy theo ngày
- POST `/api/schedules` - Tạo lịch trình

### Attendance
- GET `/api/attendance/schedule/:scheduleId` - Điểm danh theo lịch trình
- PUT `/api/attendance/:id/status` - Cập nhật trạng thái

### Notifications
- GET `/api/notifications/parent/:parentId` - Thông báo của phụ huynh
- POST `/api/notifications` - Tạo thông báo

Xem chi tiết: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## Socket.IO

Server hỗ trợ Socket.IO cho real-time tracking:
```javascript
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});
```

## Dependencies

- **express**: Web framework
- **mysql2**: Database driver
- **jsonwebtoken**: Authentication
- **bcryptjs**: Password hashing
- **socket.io**: Real-time communication
- **cors**: Cross-origin requests
- **body-parser**: Parse request body
