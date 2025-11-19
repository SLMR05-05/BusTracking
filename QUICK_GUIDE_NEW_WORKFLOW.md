# Hướng dẫn nhanh: Workflow mới

## 🎯 Thay đổi chính

**TRƯỚC:** Tạo lịch trình → Chọn từng trạm → Sắp xếp thứ tự

**BÂY GIỜ:** Quản lý trạm ở Tuyến đường → Tạo lịch trình → Chọn tuyến (tự động có trạm)

---

## 📋 Workflow mới (3 bước)

### Bước 1: Quản lý Tuyến đường
```
Trang "Tuyến đường" → Click "Quản lý trạm" → Sắp xếp thứ tự bằng nút ↑↓
```

### Bước 2: Tạo Lịch trình
```
Trang "Lịch trình" → "Tạo lịch trình" → Chọn tuyến → Chọn ngày/giờ → Tạo
```

### Bước 3: Hoàn tất
```
Tất cả trạm của tuyến đã được thêm vào lịch trình với đúng thứ tự!
```

---

## 🚀 Demo nhanh

### 1. Sắp xếp thứ tự trạm (Trang Tuyến đường)

1. Vào **Tuyến đường**
2. Tìm tuyến "Tuyến 1 - Quận 1 đến Quận 7"
3. Click **"Quản lý trạm"**
4. Thấy danh sách:
   ```
   1. Trường THPT Lê Quý Đôn
   2. Chợ Bến Thành
   3. Công viên 23/9
   4. Phú Mỹ Hưng
   ```
5. Muốn đổi thứ tự? Click nút ↑ hoặc ↓
6. Đóng modal → Thứ tự đã được lưu!

### 2. Tạo lịch trình (Trang Lịch trình)

1. Vào **Lịch trình**
2. Click **"Tạo lịch trình"**
3. Chọn **Tuyến đường**: "Tuyến 1 - Quận 1 đến Quận 7"
4. → Tất cả 4 trạm tự động hiển thị (không cần chọn!)
5. Chọn **Ngày**: 20/11/2024
6. Chọn **Giờ**: 07:00 - 09:00
7. Chọn **Tài xế** và **Xe buýt**
8. Click **"Tạo lịch trình"**
9. ✅ Xong! Lịch trình đã có 4 trạm theo đúng thứ tự

---

## ✨ Tính năng mới

### Trang Tuyến đường:
- ✅ Nút **"Quản lý trạm"** cho mỗi tuyến
- ✅ Modal hiển thị trạm với số thứ tự
- ✅ Nút **↑** di chuyển trạm lên
- ✅ Nút **↓** di chuyển trạm xuống
- ✅ Tự động disable nút khi ở đầu/cuối

### Trang Lịch trình:
- ✅ Chọn tuyến → Tự động có tất cả trạm
- ✅ Không cần chọn/bỏ chọn trạm thủ công
- ✅ Thông báo rõ ràng: "Tất cả trạm sẽ được thêm vào lịch trình"
- ✅ Hiển thị số thứ tự trạm

---

## 🎨 Giao diện

### Modal "Quản lý trạm":
```
┌─────────────────────────────────────────┐
│ Quản lý trạm - Tuyến 1                  │
│ 4 trạm trên tuyến này                   │
├─────────────────────────────────────────┤
│ ⓵ Trường THPT Lê Quý Đôn          ↑ ↓  │
│   123 Nguyễn Văn Cừ, Q.5               │
├─────────────────────────────────────────┤
│ ⓶ Chợ Bến Thành                   ↑ ↓  │
│   45 Lê Lợi, Q.1                       │
├─────────────────────────────────────────┤
│ ⓷ Công viên 23/9                  ↑ ↓  │
│   89 Võ Thị Sáu, Q.3                   │
├─────────────────────────────────────────┤
│ ⓸ Phú Mỹ Hưng                     ↑ ↓  │
│   200 Nguyễn Văn Linh, Q.7             │
└─────────────────────────────────────────┘
```

### Form tạo lịch trình:
```
┌─────────────────────────────────────────┐
│ Tạo lịch trình mới                      │
├─────────────────────────────────────────┤
│ Tuyến đường: [Tuyến 1 - Q1 đến Q7  ▼]  │
│ Tài xế:      [Nguyễn Văn Tài       ▼]  │
│ Xe buýt:     [XB00001 - 51A-12345  ▼]  │
│ Giờ bắt đầu: [07:00]                    │
│ Giờ kết thúc:[09:00]                    │
├─────────────────────────────────────────┤
│ Danh sách trạm của tuyến                │
│ Tuyến này có 4 trạm. Tất cả trạm sẽ     │
│ được thêm vào lịch trình.               │
│                                         │
│ ⓵ Trường THPT Lê Quý Đôn               │
│ ⓶ Chợ Bến Thành                        │
│ ⓷ Công viên 23/9                       │
│ ⓸ Phú Mỹ Hưng                          │
└─────────────────────────────────────────┘
```

---

## ⚠️ Lưu ý quan trọng

### 1. Thứ tự trạm ảnh hưởng tất cả lịch trình
Khi bạn thay đổi thứ tự trạm trong "Quản lý trạm":
- ✅ Lịch trình mới sẽ dùng thứ tự mới
- ✅ Lịch trình cũ cũng sẽ hiển thị theo thứ tự mới
- ⚠️ Cẩn thận khi thay đổi!

### 2. Thêm trạm mới
Khi thêm trạm mới vào tuyến (trang Trạm dừng):
- Trạm mới sẽ có `ThuTu = 0` (mặc định)
- Vào "Quản lý trạm" để sắp xếp lại

### 3. Tuyến chưa có trạm
Nếu tuyến chưa có trạm:
- Không thể tạo lịch trình
- Thông báo: "Tuyến này chưa có trạm. Vui lòng thêm trạm..."

---

## 🐛 Troubleshooting

### Không thấy nút "Quản lý trạm"?
→ Refresh trang hoặc xóa cache browser

### Thứ tự trạm không đổi?
→ Kiểm tra console (F12) xem có lỗi API không

### Tạo lịch trình báo lỗi "chưa có trạm"?
→ Vào trang Tuyến đường → Quản lý trạm → Kiểm tra có trạm không

### Trạm hiển thị sai thứ tự?
→ Vào Quản lý trạm → Sắp xếp lại → Refresh trang Lịch trình

---

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra console browser (F12)
2. Kiểm tra backend có chạy không
3. Đảm bảo đã chạy migration ThuTu
4. Xem file `UPDATE_ROUTES_MANAGEMENT.md` để biết chi tiết

---

## 🎉 Kết luận

Workflow mới giúp:
- ⚡ Tạo lịch trình nhanh hơn
- 🎯 Quản lý tập trung hơn
- ✅ Nhất quán hơn
- 😊 Dễ sử dụng hơn

**Chúc bạn sử dụng hiệu quả!** 🚀
