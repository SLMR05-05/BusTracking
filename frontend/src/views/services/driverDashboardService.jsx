// src/services/driverDashboardService.js
import {
  mockDrivers,
  mockBuses,
  mockRoutes,
  mockSchedules,
  mockAttendance,
  mockIncidents,
  mockMessages,
  mockStats,
} from '../../data/mockData';

// Giả lập API fetch dashboard cho 1 tài xế
export const getDriverDashboard = (driverId) => {
  // Tài xế
  const driver = mockDrivers.find((d) => d.id === driverId);
  if (!driver) return null;

  // Xe đang điều khiển
  const bus = mockBuses.find((b) => b.busId === driver.busId);

  // Tuyến tương ứng
  const route = mockRoutes.find((r) => r.routeId === driver.routeId);

  // Lịch chạy trong ngày của tài xế
  const schedules = mockSchedules.filter((s) => s.driverId === driverId);

  // Điểm danh học sinh trong ca sáng
  const attendance = mockAttendance.filter(
    (a) => a.scheduleId === schedules[0]?.scheduleId
  );

  // Sự cố gần nhất của tài xế
  const incidents = mockIncidents.filter((i) => i.driverId === driverId);

  // Tin nhắn gần nhất
  const messages = mockMessages.filter(
    (m) => m.receiver === driver.name || m.sender === driver.name
  );

  // Trả về object tổng hợp
  return {
    driver,
    bus,
    route,
    schedules,
    attendance,
    incidents,
    messages,
    stats: mockStats,
  };
};
