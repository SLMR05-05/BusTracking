
- Theo dõi thông tin xe buýt (biển số, sức chứa, trạng thái)
- Lịch bảo trì và kiểm định
- Phân công tài xế và tuyến đường

###  Quản lý Tài xế
-thêm sửa xóa tài xế;

### Quản lý Học sinh
- thêm phụ huynh cho học sinh 
-chọn tuyến đường và điểm dừng

### Quản lý Tuyến đường
- Tạo và chỉnh sửa tuyến đường
- thêm điểm dừng cho tuyến đường
- xem danh sách học sinh thuộc tuyến đường

###  Theo dõi Thời gian thực
- dùng thẻ iframe nhúng web để test thử


###  Quản lý Lịch trình
-chỉ định tài xế, tuyến đường, thời gian bắt đầu và kết thúc

## Quy trình Sử dụng

### 1. Quy trình Thiết lập Ban đầu (Admin)

#### Bước 1: Quản lý Tài xế
1. Truy cập **Quản lý tài xế**
2. Thêm thông tin tài xế:
   - Họ tên, số điện thoại
   - Số giấy phép lái xe và hạn sử dụng
   - Địa chỉ và kinh nghiệm
3. Kiểm tra cảnh báo hết hạn giấy phép
4. Kích hoạt tài xế

#### Bước 2: Quản lý Xe buýt
1. Truy cập **Quản lý xe buýt**
2. Thêm thông tin xe:
   - Mã xe và biển số
   - Sức chứa và trạng thái
   - Lịch bảo trì
3. Phân công tài xế cho xe buýt

#### Bước 3: Tạo Tuyến đường
1. Truy cập **Quản lý tuyến đường**
2. Tạo tuyến đường mới:
   - Tên tuyến và mã tuyến
   - Điểm bắt đầu và kết thúc
   - Khoảng cách và thời gian ước tính
3. Thêm điểm dừng:
   - Tên và địa chỉ điểm dừng
   - Thời gian dự kiến
   - Sắp xếp thứ tự

#### Bước 4: Quản lý Phụ huynh
1. Truy cập **Quản lý phụ huynh**
2. Thêm thông tin phụ huynh:
   - Họ tên và thông tin liên hệ
   - Địa chỉ và nghề nghiệp
   - Tạo tài khoản đăng nhập

#### Bước 5: Đăng ký Học sinh
1. Truy cập **Quản lý học sinh**
2. Thêm thông tin học sinh:
   - Họ tên, lớp, mã học sinh
   - Chọn phụ huynh từ danh sách
   - Phân công xe buýt và tuyến đường
   - Chọn điểm dừng lên/xuống xe
3. Xác nhận thông tin và kích hoạt

### 2. Quy trình Lập Lịch trình (Admin)

#### Bước 1: Tạo Lịch trình
1. Truy cập **Quản lý lịch trình**
2. Chọn ngày và ca (sáng/chiều)
3. Phân công:
   - Tài xế cho từng xe buýt
   - Xe buýt cho từng tuyến đường
   - Kiểm tra xung đột tài nguyên

#### Bước 2: Xác nhận Lịch trình
1. Kiểm tra thông tin đầy đủ
2. Xác nhận không có xung đột
3. Kích hoạt lịch trình

### 3. Quy trình Hoạt động Hàng ngày

#### A. Tài xế
1. **Đăng nhập hệ thống**
   - Sử dụng tài khoản được cấp
   - Xem lịch trình ngày hôm nay

2. **Chuẩn bị Chuyến đi**
   - Kiểm tra thông tin xe buýt
   - Xem danh sách học sinh và điểm dừng
   - Kiểm tra tuyến đường

3. **Thực hiện Chuyến đi**
   - Bật GPS tracking
   - Cập nhật trạng thái tại mỗi điểm dừng
   - Xác nhận đón/trả học sinh

4. **Kết thúc Chuyến đi**
   - Cập nhật trạng thái hoàn thành
   - Báo cáo sự cố (nếu có)

#### B. Phụ huynh
1. **Đăng nhập hệ thống**
   - Truy cập trang phụ huynh
   - Xem thông tin con em

2. **Theo dõi Xe buýt**
   - Xem vị trí xe buýt thời gian thực
   - Kiểm tra thời gian dự kiến đến
   - Xem trạng thái hoạt động

3. **Xem Lịch sử**
   - Truy cập trang lịch sử
   - Lọc theo ngày, trạng thái
   - Xem thống kê tỷ lệ đúng giờ

4. **Liên hệ**
   - Gọi điện cho nhà trường
   - Liên hệ trực tiếp với tài xế

#### C. Admin
1. **Giám sát Tổng quan**
   - Theo dõi dashboard tổng quan
   - Kiểm tra các chỉ số KPI
   - Xem báo cáo hoạt động

2. **Theo dõi Thời gian thực**
   - Giám sát tất cả xe buýt
   - Xử lý cảnh báo và sự cố
   - Hỗ trợ tài xế khi cần

3. **Quản lý Hàng ngày**
   - Cập nhật thông tin thay đổi
   - Xử lý yêu cầu từ phụ huynh
   - Điều chỉnh lịch trình khi cần

## Quy trình Xử lý Sự cố

### 1. Xe buýt Chậm trễ
1. **Tài xế**: Cập nhật trạng thái "Delayed"
2. **Hệ thống**: Tự động thông báo cho phụ huynh
3. **Admin**: Theo dõi và hỗ trợ nếu cần

### 2. Xe buýt Hỏng hóc
1. **Tài xế**: Báo cáo sự cố qua hệ thống
2. **Admin**: Điều xe dự phòng
3. **Hệ thống**: Thông báo thay đổi cho phụ huynh

### 3. Học sinh Vắng mặt
1. **Phụ huynh**: Thông báo trước qua hệ thống
2. **Tài xế**: Xác nhận không đón học sinh
3. **Hệ thống**: Cập nhật trạng thái

## Cấu trúc Hệ thống

### Frontend (React)
```
src/
├── components/          # Các component dùng chung
├── views/              # Các trang chính
│   ├── Overview.jsx    # Dashboard admin
│   ├── Drivers.jsx     # Quản lý tài xế
│   ├── Students.jsx    # Quản lý học sinh
│   ├── Routes.jsx      # Quản lý tuyến đường
│   ├── Tracking.jsx    # Theo dõi thời gian thực
│   ├── Schedule.jsx    # Quản lý lịch trình
│   ├── ParentDashboard.jsx    # Dashboard phụ huynh
│   ├── ParentHistory.jsx      # Lịch sử phụ huynh
│   └── DriverDashboard.jsx    # Dashboard tài xế
├── contexts/           # Context API
└── data/              # Dữ liệu mẫu
```

### Phân quyền Người dùng

#### Admin
- Toàn quyền quản lý hệ thống
- Xem tất cả báo cáo và thống kê
- Cấu hình hệ thống

#### Tài xế
- Xem lịch trình cá nhân
- Cập nhật trạng thái chuyến đi
- Báo cáo sự cố

#### Phụ huynh
- Xem thông tin con em
- Theo dõi xe buýt
- Xem lịch sử chuyến đi

## Công nghệ Sử dụng

### Frontend
- **React 18**: Framework chính
- **React Router**: Điều hướng
- **Tailwind CSS**: Styling
- **Lucide React**: Icons
- **Context API**: Quản lý state

### Tính năng Nổi bật
- **Responsive Design**: Tương thích mọi thiết bị
- **Real-time Tracking**: Cập nhật GPS mỗi 3 giây
- **Role-based Access**: Phân quyền theo vai trò
- **Interactive Maps**: Tích hợp Google Maps
- **Smart Notifications**: Thông báo thông minh

## Hướng dẫn Cài đặt

### Yêu cầu Hệ thống
- Node.js 16+
- npm hoặc yarn
- Trình duyệt hiện đại

### Cài đặt
```bash
# Clone repository
git clone [repository-url]

# Cài đặt dependencies
cd frontend
npm install

# Chạy development server
npm run dev

# Truy cập http://localhost:3004
```

### Tài khoản Mặc định
```
Admin:
- Username: admin
- Password: admin123

Tài xế:
- Username: driver
- Password: driver123

Phụ huynh:
- Username: parent
- Password: parent123
```

## Roadmap Phát triển

### Phiên bản 1.1
- [ ] Tích hợp SMS/Email notifications
- [ ] Báo cáo chi tiết và xuất Excel
- [ ] API cho mobile app
- [ ] Tối ưu hóa tuyến đường tự động

### Phiên bản 1.2
- [ ] Machine Learning dự đoán tắc đường
- [ ] Tích hợp thanh toán online
- [ ] Hệ thống đánh giá dịch vụ
- [ ] Multi-language support

### Phiên bản 2.0
- [ ] Mobile app cho iOS/Android
- [ ] IoT integration với xe buýt
- [ ] Advanced analytics dashboard
- [ ] Cloud deployment

## Hỗ trợ

Để được hỗ trợ kỹ thuật hoặc báo cáo lỗi, vui lòng liên hệ:
- Email: support@ssb.edu.vn
- Phone: 1900-XXX-XXX
- Documentation: [Link to docs]

## Giấy phép
Bản quyền © 2024 Smart School Bus System. Tất cả quyền được bảo lưu.