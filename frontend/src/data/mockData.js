// Mock data cho hệ thống quản lý xe buýt
export const mockStudents = [
  {
    id: 1,
    name: 'Nguyễn Văn An',
    studentId: 'HS001',
    grade: '10A1',
    address: '123 Đường ABC, Quận 1',
    phone: '0123456789',
    parentId: 1,
    busId: 'BS-001',
    routeId: 'RT-001',
    pickupStopId: 1,
    dropoffStopId: 1,
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
    parentId: 2,
    busId: 'BS-002',
    routeId: 'RT-002',
    pickupStopId: 4,
    dropoffStopId: 4,
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
    parentId: 3,
    busId: 'BS-001',
    routeId: 'RT-001',
    pickupStopId: 2,
    dropoffStopId: 2,
    pickupTime: '06:30',
    dropoffTime: '17:00',
    status: 'inactive'
  },
  {
    id: 4,
    name: 'Phạm Thị Cúc',
    studentId: 'HS004',
    grade: '8A3',
    address: '321 Đường GHI, Quận 4',
    phone: '0123456786',
    parentId: 4,
    busId: '',
    routeId: '',
    pickupStopId: null,
    dropoffStopId: null,
    pickupTime: '',
    dropoffTime: '',
    status: 'active'
  },
  {
    id: 5,
    name: 'Hoàng Văn Dũng',
    studentId: 'HS005',
    grade: '12B1',
    address: '654 Đường JKL, Quận 5',
    phone: '0123456785',
    parentId: 5,
    busId: '',
    routeId: '',
    pickupStopId: null,
    dropoffStopId: null,
    pickupTime: '',
    dropoffTime: '',
    status: 'active'
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
  },
  {
    id: 4,
    busId: 'BS-004',
    licensePlate: '51D-22222',
    capacity: 40,
    driverId: null,
    driverName: '',
    routeId: '',
    routeName: '',
    status: 'active',
    lastMaintenance: '2024-01-25',
    nextMaintenance: '2024-04-25'
  },
  {
    id: 5,
    busId: 'BS-005',
    licensePlate: '51E-33333',
    capacity: 55,
    driverId: null,
    driverName: '',
    routeId: '',
    routeName: '',
    status: 'active',
    lastMaintenance: '2024-02-05',
    nextMaintenance: '2024-05-05'
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
  },
  {
    id: 4,
    name: 'Lê Văn Đức',
    driverId: 'TX004',
    phone: '0123456786',
    licenseNumber: 'A444555666',
    licenseExpiry: '2024-12-15',
    busId: '',
    routeId: '',
    experience: '2 năm',
    status: 'active',
    address: '321 Đường GHI, Quận 4'
  },
  {
    id: 5,
    name: 'Hoàng Thị Lan',
    driverId: 'TX005',
    phone: '0123456785',
    licenseNumber: 'A333444555',
    licenseExpiry: '2026-03-20',
    busId: '',
    routeId: '',
    experience: '4 năm',
    status: 'active',
    address: '654 Đường JKL, Quận 5'
  },
  {
    id: 6,
    name: 'Võ Minh Tuấn',
    driverId: 'TX006',
    phone: '0123456784',
    licenseNumber: 'A222333444',
    licenseExpiry: '2024-11-30',
    busId: '',
    routeId: '',
    experience: '6 năm',
    status: 'inactive',
    address: '987 Đường MNO, Quận 6'
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
  },
  {
    id: 3,
    routeId: 'RT-003',
    name: 'Tuyến 3 - Quận 3',
    startPoint: 'Trường THPT DEF',
    endPoint: 'Khu vực Quận 3',
    distance: '12 km',
    estimatedTime: '40 phút',
    stops: [
      { id: 7, name: 'Điểm dừng 7', address: '444 Đường STU', time: '06:40' },
      { id: 8, name: 'Điểm dừng 8', address: '555 Đường VWX', time: '06:55' },
      { id: 9, name: 'Điểm dừng 9', address: '666 Đường YZ', time: '07:10' }
    ],
    status: 'active',
    busCount: 1,
    studentCount: 32
  },
  {
    id: 4,
    routeId: 'RT-004',
    name: 'Tuyến 4 - Quận 4',
    startPoint: 'Trường THPT GHI',
    endPoint: 'Khu vực Quận 4',
    distance: '20 km',
    estimatedTime: '55 phút',
    stops: [
      { id: 10, name: 'Điểm dừng 10', address: '777 Đường ABC', time: '06:35' },
      { id: 11, name: 'Điểm dừng 11', address: '888 Đường DEF', time: '06:50' },
      { id: 12, name: 'Điểm dừng 12', address: '999 Đường GHI', time: '07:05' }
    ],
    status: 'active',
    busCount: 0,
    studentCount: 0
  }
];

export const mockParents = [
  {
    id: 1,
    parentId: 'PH001',
    name: 'Nguyễn Thị Lan',
    phone: '0987654321',
    email: 'lan.nguyen@email.com',
    address: '123 Đường ABC, Quận 1',
    occupation: 'Giáo viên',
    status: 'active'
  },
  {
    id: 2,
    parentId: 'PH002',
    name: 'Trần Văn Minh',
    phone: '0987654322',
    email: 'minh.tran@email.com',
    address: '456 Đường XYZ, Quận 2',
    occupation: 'Kỹ sư',
    status: 'active'
  },
  {
    id: 3,
    parentId: 'PH003',
    name: 'Lê Thị Hoa',
    phone: '0987654323',
    email: 'hoa.le@email.com',
    address: '789 Đường DEF, Quận 3',
    occupation: 'Bác sĩ',
    status: 'active'
  },
  {
    id: 4,
    parentId: 'PH004',
    name: 'Phạm Văn Đức',
    phone: '0987654324',
    email: 'duc.pham@email.com',
    address: '321 Đường GHI, Quận 4',
    occupation: 'Kinh doanh',
    status: 'active'
  },
  {
    id: 5,
    parentId: 'PH005',
    name: 'Hoàng Thị Mai',
    phone: '0987654325',
    email: 'mai.hoang@email.com',
    address: '654 Đường JKL, Quận 5',
    occupation: 'Nhân viên văn phòng',
    status: 'active'
  },
  {
    id: 6,
    parentId: 'PH006',
    name: 'Võ Minh Tuấn',
    phone: '0987654326',
    email: 'tuan.vo@email.com',
    address: '987 Đường MNO, Quận 6',
    occupation: 'Công nhân',
    status: 'inactive'
  }
];

export const mockTracking = [
  {
    id: 1,
    busId: 'BS-001',
    driverName: 'Trần Văn Tài',
    routeName: 'Tuyến 1 - Quận 1',
    currentLocation: 'Điểm dừng 2 - Đường Nguyễn Huệ',
    status: 'on_route',
    nextStop: 'Điểm dừng 3 - Chợ Bến Thành',
    estimatedArrival: '07:05',
    studentsOnBoard: 25,
    lastUpdate: '2024-01-20 07:00:00',
    coordinates: { lat: 10.8231, lng: 106.6297 },
    speed: 35, // km/h
    direction: 'Đông Bắc'
  },
  {
    id: 2,
    busId: 'BS-002',
    driverName: 'Nguyễn Văn Hùng',
    routeName: 'Tuyến 2 - Quận 2',
    currentLocation: 'Điểm dừng 5 - Đường Hai Bà Trưng',
    status: 'picking_up',
    nextStop: 'Điểm dừng 6 - Công viên Tao Đàn',
    estimatedArrival: '07:20',
    studentsOnBoard: 18,
    lastUpdate: '2024-01-20 07:15:00',
    coordinates: { lat: 10.7769, lng: 106.7009 },
    speed: 0, // km/h (đang dừng)
    direction: 'Tây Nam'
  },
  {
    id: 3,
    busId: 'BS-003',
    driverName: 'Phạm Thị Mai',
    routeName: 'Tuyến 3 - Quận 3',
    currentLocation: 'Điểm dừng 8 - Đường Cách Mạng Tháng 8',
    status: 'delayed',
    nextStop: 'Điểm dừng 9 - Trường THPT Lê Quý Đôn',
    estimatedArrival: '07:25',
    studentsOnBoard: 32,
    lastUpdate: '2024-01-20 07:12:00',
    coordinates: { lat: 10.7829, lng: 106.6557 },
    speed: 15, // km/h (chậm do tắc đường)
    direction: 'Bắc'
  }
];
