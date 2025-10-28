// Mock data cho hệ thống quản lý xe buýt
export const mockStudents = [
  {
    id: 1,
    name: 'Nguyễn Văn An',
    studentId: 'HS001',
    grade: '10A1',
    address: '123 Đường ABC, Quận 1',
    phone: '0123456789',
    parentName: 'Nguyễn Thị Lan',
    parentPhone: '0987654321',
    busId: 'BS-001',
    routeId: 'RT-001',
    pickupTime: '06:30',
    dropoffTime: '17:00',
    status: 'active'
  },
  {
    id: 2,
    name: 'Trần Thị Bình',
    studentId: 'HS002',
    grade: '9B2',
    address: '456 Đường XYZ, Quận 2',
    phone: '0123456788',
    parentName: 'Trần Văn Minh',
    parentPhone: '0987654322',
    busId: 'BS-002',
    routeId: 'RT-002',
    pickupTime: '06:45',
    dropoffTime: '17:15',
    status: 'active'
  },
  {
    id: 3,
    name: 'Lê Hoàng Nam',
    studentId: 'HS003',
    grade: '11C1',
    address: '789 Đường DEF, Quận 3',
    phone: '0123456787',
    parentName: 'Lê Thị Hoa',
    parentPhone: '0987654323',
    busId: 'BS-001',
    routeId: 'RT-001',
    pickupTime: '06:30',
    dropoffTime: '17:00',
    status: 'inactive'
  }
];

export const mockBuses = [
  {
    id: 1,
    busId: 'BS-001',
    licensePlate: '51A-12345',
    capacity: 50,
    driverId: 1,
    driverName: 'Trần Văn Tài',
    routeId: 'RT-001',
    routeName: 'Tuyến 1 - Quận 1',
    status: 'active',
    lastMaintenance: '2024-01-15',
    nextMaintenance: '2024-04-15'
  },
  {
    id: 2,
    busId: 'BS-002',
    licensePlate: '51B-67890',
    capacity: 45,
    driverId: 2,
    driverName: 'Nguyễn Văn Hùng',
    routeId: 'RT-002',
    routeName: 'Tuyến 2 - Quận 2',
    status: 'active',
    lastMaintenance: '2024-01-20',
    nextMaintenance: '2024-04-20'
  },
  {
    id: 3,
    busId: 'BS-003',
    licensePlate: '51C-11111',
    capacity: 50,
    driverId: 3,
    driverName: 'Phạm Thị Mai',
    routeId: 'RT-003',
    routeName: 'Tuyến 3 - Quận 3',
    status: 'maintenance',
    lastMaintenance: '2024-02-01',
    nextMaintenance: '2024-05-01'
  }
];

export const mockDrivers = [
  {
    id: 1,
    name: 'Trần Văn Tài',
    driverId: 'TX001',
    phone: '0123456789',
    licenseNumber: 'A123456789',
    licenseExpiry: '2025-12-31',
    busId: 'BS-001',
    routeId: 'RT-001',
    experience: '5 năm',
    status: 'active',
    address: '123 Đường ABC, Quận 1'
  },
  {
    id: 2,
    name: 'Nguyễn Văn Hùng',
    driverId: 'TX002',
    phone: '0123456788',
    licenseNumber: 'A987654321',
    licenseExpiry: '2025-10-15',
    busId: 'BS-002',
    routeId: 'RT-002',
    experience: '3 năm',
    status: 'active',
    address: '456 Đường XYZ, Quận 2'
  },
  {
    id: 3,
    name: 'Phạm Thị Mai',
    driverId: 'TX003',
    phone: '0123456787',
    licenseNumber: 'A555666777',
    licenseExpiry: '2025-08-20',
    busId: 'BS-003',
    routeId: 'RT-003',
    experience: '7 năm',
    status: 'inactive',
    address: '789 Đường DEF, Quận 3'
  }
];

export const mockRoutes = [
  {
    id: 1,
    routeId: 'RT-001',
    name: 'Tuyến 1 - Quận 1',
    startPoint: 'Trường THPT ABC',
    endPoint: 'Khu vực Quận 1',
    distance: '15 km',
    estimatedTime: '45 phút',
    stops: [
      { id: 1, name: 'Điểm dừng 1', address: '123 Đường ABC', time: '06:30' },
      { id: 2, name: 'Điểm dừng 2', address: '456 Đường DEF', time: '06:45' },
      { id: 3, name: 'Điểm dừng 3', address: '789 Đường GHI', time: '07:00' }
    ],
    status: 'active',
    busCount: 2,
    studentCount: 45
  },
  {
    id: 2,
    routeId: 'RT-002',
    name: 'Tuyến 2 - Quận 2',
    startPoint: 'Trường THPT XYZ',
    endPoint: 'Khu vực Quận 2',
    distance: '18 km',
    estimatedTime: '50 phút',
    stops: [
      { id: 4, name: 'Điểm dừng 4', address: '111 Đường JKL', time: '06:45' },
      { id: 5, name: 'Điểm dừng 5', address: '222 Đường MNO', time: '07:00' },
      { id: 6, name: 'Điểm dừng 6', address: '333 Đường PQR', time: '07:15' }
    ],
    status: 'active',
    busCount: 1,
    studentCount: 38
  }
];

export const mockTracking = [
  {
    id: 1,
    busId: 'BS-001',
    driverName: 'Trần Văn Tài',
    routeName: 'Tuyến 1 - Quận 1',
    currentLocation: 'Điểm dừng 2',
    status: 'on_route',
    nextStop: 'Điểm dừng 3',
    estimatedArrival: '07:05',
    studentsOnBoard: 25,
    lastUpdate: '2024-01-20 07:00:00'
  },
  {
    id: 2,
    busId: 'BS-002',
    driverName: 'Nguyễn Văn Hùng',
    routeName: 'Tuyến 2 - Quận 2',
    currentLocation: 'Điểm dừng 5',
    status: 'picking_up',
    nextStop: 'Điểm dừng 6',
    estimatedArrival: '07:20',
    studentsOnBoard: 18,
    lastUpdate: '2024-01-20 07:15:00'
  }
];
// 6. Lịch chạy (Schedule)
export const mockSchedules = [
  {
    id: 1,
    scheduleId: 'SCH001',
    busId: 'BS-001',
    driverId: 1,
    routeId: 'RT-001',
     routeName: "Tuyến A - Quận 1",
    shift: 'Ca sáng',
    startTime: '2024-01-20T06:30:00',
    endTime: '2024-01-20T07:15:00',
    studentCount: 24,
    status: 'completed', // completed | upcoming | in_progress
     stops: [
      { id: 1, name: "Trạm 1 - Bến Thành", eta: "06:30", students: 8, status: "Đã đến" },
      { id: 2, name: "Trạm 2 - Nhà Thờ Đức Bà", eta: "06:45", students: 10, status: "Đã đến" },
      { id: 3, name: "Trường DEF", eta: "07:15", students: 6, status: "Đã đến" },
    ],
  },
  {
    id: 2,
    scheduleId: 'SCH002',
    busId: 'BS-001',
    driverId: 1,
    routeId: 'RT-001',
     routeName: "Tuyến A - Quận 1",
    shift: 'Ca chiều',
    startTime: '2024-01-20T16:00:00',
    endTime: '2024-01-20T16:45:00',
    studentCount: 24,
    status: 'upcoming',
    stops: [
      { id: 1, name: "Trường DEF", eta: "16:00", students: 24, status: "Chưa đến" },
      { id: 2, name: "Trạm 3 - Công Viên Tao Đàn", eta: "16:15", students: 6, status: "Chưa đến" },
      { id: 3, name: "Trạm 2 - Nhà Thờ Đức Bà", eta: "16:25", students: 10, status: "Chưa đến" },
      { id: 4, name: "Trạm 1 - Bến Thành", eta: "16:35", students: 8, status: "Chưa đến" },
    ],
  }
];

// 7. Điểm danh học sinh (Attendance)
export const mockAttendance = [
  {
    id: 1,
    scheduleId: 'SCH001',
    studentId: 'HS001',
    status: 'LenXe', // LenXe | XuongXe | Vang
    time: '2024-01-20T06:35:00'
  },
  {
    id: 2,
    scheduleId: 'SCH001',
    studentId: 'HS002',
    status: 'LenXe',
    time: '2024-01-20T06:40:00'
  },
  {
    id: 3,
    scheduleId: 'SCH001',
    studentId: 'HS003',
    status: 'Vang',
    time: null
  }
];

// 8. Sự cố (Incidents)
export const mockIncidents = [
  {
    id: 1,
    incidentId: 'INC001',
    busId: 'BS-001',
    driverId: 1,
    routeId: 'RT-001',
    type: 'Hư hỏng lốp xe',
    description: 'Phát hiện lốp xe bị xì hơi khi đến trạm 2.',
    time: '2024-01-19T06:45:00',
    status: 'Đã xử lý'
  },
  {
    id: 2,
    incidentId: 'INC002',
    busId: 'BS-002',
    driverId: 2,
    routeId: 'RT-002',
    type: 'Trễ giờ khởi hành',
    description: 'Tài xế đến muộn do kẹt xe khu vực Nguyễn Văn Linh.',
    time: '2024-01-20T06:35:00',
    status: 'Mới'
  }
];

// 9. Tin nhắn (Messages)
export const mockMessages = [
  {
    id: 1,
    sender: 'Admin',
    receiver: 'Trần Văn Tài',
    content: 'Anh Tài, nhớ kiểm tra lốp trước khi xuất phát nhé!',
    timestamp: '2024-01-19T18:00:00'
  },
  {
    id: 2,
    sender: 'Trần Văn Tài',
    receiver: 'Admin',
    content: 'Đã kiểm tra xong xe, mọi thứ ổn định.',
    timestamp: '2024-01-19T18:15:00'
  },
  {
    id: 3,
    sender: 'Phụ huynh Nguyễn Thị Lan',
    receiver: 'Trần Văn Tài',
    content: 'Nhờ bác tài cho bé An xuống trạm sớm 5 phút chiều nay nhé.',
    timestamp: '2024-01-20T10:00:00'
  }
];

// 10. Thống kê tổng quan (Stats)
export const mockStats = {
  todayTrips: 2,
  studentsTransported: 24,
  onTimeRate: '100%',
  distanceTraveled: '31 km',
  completedTrips: 10,
  totalIncidents: 2,
  lastUpdated: '2024-01-20T18:00:00'
};
