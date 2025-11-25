// Socket.IO Manager - Quản lý realtime events
let io = null;

export const initSocket = (socketIO) => {
  io = socketIO;
  
  io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id);

    // Parent join room theo MaPH
    socket.on('join-parent-room', (parentId) => {
      socket.join(`parent-${parentId}`);
      console.log(` Parent ${parentId} joined room`);
    });

    // Admin join room
    socket.on('join-admin-room', () => {
      socket.join('admin-room');
      console.log('Admin joined room');
    });

    // Driver join room theo MaLT
    socket.on('join-schedule-room', (scheduleId) => {
      socket.join(`schedule-${scheduleId}`);
      console.log(`Driver joined schedule ${scheduleId} room`);
    });

    socket.on('disconnect', () => {
      console.log(' Client disconnected:', socket.id);
    });
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO chưa được khởi tạo!');
  }
  return io;
};

// Emit thông báo điểm danh cho phụ huynh
export const emitAttendanceNotification = (parentId, notification) => {
  if (io) {
    io.to(`parent-${parentId}`).emit('attendance-update', notification);
    console.log(`Sent attendance notification to parent ${parentId}`);
  }
};

// Emit cập nhật realtime cho admin
export const emitAdminUpdate = (data) => {
  if (io) {
    io.to('admin-room').emit('admin-update', data);
    console.log('Sent update to admin');
  }
};

// Emit cập nhật vị trí xe
export const emitBusLocation = (scheduleId, location) => {
  if (io) {
    io.to(`schedule-${scheduleId}`).emit('bus-location-update', location);
    console.log(` Sent location update for schedule ${scheduleId}`);
  }
}