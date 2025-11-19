# Cập nhật: Quản lý thứ tự trạm trong Tuyến đường

## Tổng quan thay đổi

Đã chuyển việc quản lý thứ tự trạm từ trang **Lịch trình** sang trang **Tuyến đường**:

### Trước đây:
- ❌ Khi tạo lịch trình, phải chọn từng trạm và sắp xếp thứ tự
- ❌ Mỗi lịch trình có thể có thứ tự trạm khác nhau
- ❌ Khó quản lý và dễ nhầm lẫn

### Bây giờ:
- ✅ Quản lý thứ tự trạm tập trung ở trang **Tuyến đường**
- ✅ Khi tạo lịch trình, chỉ cần chọn tuyến đường
- ✅ Tất cả trạm của tuyến sẽ tự động được thêm vào lịch trình
- ✅ Thứ tự trạm nhất quán cho tất cả lịch trình

---

## Các thay đổi chi tiết

### 1. Frontend - Schedule.jsx

#### Thay đổi logic chọn tuyến:
```javascript
// Tự động chọn tất cả trạm khi chọn tuyến
const handleRouteChange = async (routeId) => {
  setFormData({ ...formData, MaTD: routeId });
  
  if (!routeId) {
    setAvailableStops([]);
    setSelectedStops([]);
    return;
  }
  
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/routes/${routeId}/stops`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const stops = await response.json();
    setAvailableStops(stops);
    // Tự động chọn tất cả trạm (đã được sắp xếp theo ThuTu)
    setSelectedStops(stops);
  } catch (error) {
    console.error('Error fetching route stops:', error);
    setAvailableStops([]);
    setSelectedStops([]);
  }
};
```

#### Xóa hàm handleToggleStop:
- Không còn cần chọn/bỏ chọn trạm thủ công

#### Cập nhật UI:
- Hiển thị tất cả trạm của tuyến (không thể bỏ chọn)
- Thông báo rõ ràng: "Tất cả trạm sẽ được thêm vào lịch trình"
- Hiển thị số thứ tự trạm từ database

#### Cập nhật validation:
```javascript
if (!formData.MaTD) {
  alert('Vui lòng chọn tuyến đường!');
  return;
}

if (availableStops.length === 0) {
  alert('Tuyến đường này chưa có trạm! Vui lòng thêm trạm trong trang "Tuyến đường".');
  return;
}
```

---

### 2. Frontend - Routes.jsx (MỚI)

Tạo trang quản lý tuyến đường hoàn toàn mới với các tính năng:

#### Tính năng chính:
1. **Xem danh sách tuyến đường**
2. **Thêm/Sửa/Xóa tuyến đường**
3. **Quản lý trạm của tuyến** (Modal mới)
4. **Sắp xếp thứ tự trạm** (Nút mũi tên lên/xuống)

#### Modal "Quản lý trạm":
```javascript
const handleMoveStation = async (stationId, direction) => {
  const currentIndex = stations.findIndex(s => s.MaTram === stationId);
  if (currentIndex === -1) return;

  const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
  if (newIndex < 0 || newIndex >= stations.length) return;

  // Swap ThuTu values
  const newStations = [...stations];
  const temp = newStations[currentIndex].ThuTu;
  newStations[currentIndex].ThuTu = newStations[newIndex].ThuTu;
  newStations[newIndex].ThuTu = temp;

  // Update in database
  await Promise.all([
    fetch(`${API_URL}/routes/stops/${newStations[currentIndex].MaTram}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ ThuTu: newStations[currentIndex].ThuTu })
    }),
    fetch(`${API_URL}/routes/stops/${newStations[newIndex].MaTram}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ ThuTu: newStations[newIndex].ThuTu })
    })
  ]);

  // Re-sort and update state
  newStations.sort((a, b) => a.ThuTu - b.ThuTu);
  setStations(newStations);
};
```

#### UI Features:
- Nút "Quản lý trạm" cho mỗi tuyến
- Modal hiển thị danh sách trạm với số thứ tự
- Nút mũi tên lên/xuống để thay đổi thứ tự
- Disable nút khi ở đầu/cuối danh sách
- Thông báo rõ ràng về tác động của việc sắp xếp

---

## Workflow mới

### Bước 1: Quản lý Tuyến đường
1. Vào trang **Tuyến đường**
2. Tạo tuyến đường mới (nếu chưa có)
3. Click "Quản lý trạm" cho tuyến đường
4. Sắp xếp thứ tự trạm bằng nút mũi tên
5. Thứ tự này sẽ được lưu vào database

### Bước 2: Tạo Lịch trình
1. Vào trang **Lịch trình**
2. Click "Tạo lịch trình"
3. Chọn tuyến đường
4. Tất cả trạm của tuyến sẽ tự động được chọn (theo đúng thứ tự)
5. Chọn ngày, giờ, tài xế, xe buýt
6. Tạo lịch trình

---

## Lợi ích

### 1. Tính nhất quán
- Tất cả lịch trình của cùng tuyến có cùng thứ tự trạm
- Không có sự nhầm lẫn về thứ tự

### 2. Dễ quản lý
- Chỉ cần sắp xếp thứ tự một lần ở trang Tuyến đường
- Thay đổi thứ tự ở một nơi, áp dụng cho tất cả lịch trình

### 3. Đơn giản hóa
- Tạo lịch trình nhanh hơn (không cần chọn từng trạm)
- Giảm thiểu lỗi do người dùng

### 4. Trực quan
- UI rõ ràng với nút mũi tên
- Số thứ tự hiển thị trực quan
- Thông báo và hướng dẫn rõ ràng

---

## Files đã thay đổi

### Modified:
1. `frontend/src/views/admin/Schedule.jsx`
   - Tự động chọn tất cả trạm khi chọn tuyến
   - Xóa logic chọn/bỏ chọn trạm thủ công
   - Cập nhật UI và validation

### New:
2. `frontend/src/views/admin/Routes.jsx` (thay thế hoàn toàn)
   - Kết nối với API thực
   - Thêm modal "Quản lý trạm"
   - Thêm tính năng sắp xếp thứ tự trạm

### Backup:
3. `frontend/src/views/admin/Routes_OLD_BACKUP.jsx`
   - Backup của file Routes.jsx cũ (dùng mock data)

---

## Testing Checklist

### Trang Tuyến đường:
- [ ] Xem danh sách tuyến đường
- [ ] Thêm tuyến đường mới
- [ ] Sửa tuyến đường
- [ ] Xóa tuyến đường
- [ ] Click "Quản lý trạm" mở modal
- [ ] Xem danh sách trạm với số thứ tự
- [ ] Di chuyển trạm lên (nút mũi tên lên)
- [ ] Di chuyển trạm xuống (nút mũi tên xuống)
- [ ] Nút disable khi ở đầu/cuối danh sách
- [ ] Thứ tự được lưu vào database

### Trang Lịch trình:
- [ ] Chọn tuyến đường
- [ ] Tất cả trạm tự động được chọn
- [ ] Thứ tự trạm đúng (theo ThuTu)
- [ ] Không thể bỏ chọn trạm
- [ ] Tạo lịch trình thành công
- [ ] Chi tiết lịch trình hiển thị đúng thứ tự
- [ ] Bản đồ hiển thị đúng số thứ tự

---

## Lưu ý quan trọng

### 1. Thêm trạm mới
Khi thêm trạm mới vào tuyến đường (trong trang Trạm dừng), cần:
- Chỉ định `ThuTu` phù hợp
- Hoặc sau đó vào "Quản lý trạm" để sắp xếp lại

### 2. Lịch trình đã tạo
- Lịch trình đã tạo trước đó sẽ tự động sử dụng thứ tự mới
- Không cần tạo lại lịch trình

### 3. Thay đổi thứ tự
- Khi thay đổi thứ tự trạm, tất cả lịch trình (cũ và mới) sẽ bị ảnh hưởng
- Nên thông báo cho người dùng trước khi thay đổi

---

## API Endpoints sử dụng

### Routes:
- `GET /api/routes` - Lấy danh sách tuyến đường
- `POST /api/routes` - Tạo tuyến đường mới
- `PUT /api/routes/:id` - Cập nhật tuyến đường
- `DELETE /api/routes/:id` - Xóa tuyến đường
- `GET /api/routes/:id/stops` - Lấy danh sách trạm của tuyến

### Stations:
- `PUT /api/routes/stops/:stopId` - Cập nhật thông tin trạm (bao gồm ThuTu)

### Schedules:
- `GET /api/schedules/:id/details` - Lấy chi tiết lịch trình (trạm đã sắp xếp)

---

## Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra console browser (F12)
2. Kiểm tra log backend
3. Đảm bảo đã chạy migration ThuTu
4. Kiểm tra các trạm đã có giá trị ThuTu

## Tác giả
- Ngày cập nhật: 2024
- Version: 2.0.0
