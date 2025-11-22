import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import http from "http";
import { Server } from "socket.io";
import userRoutes from "./routes/admin/UserRoutes.js";
import driverRoutes from "./routes/admin/DriverRoutes.js";
import studentRoutes from "./routes/admin/StudentRoutes.js";
import parentRoutes from "./routes/admin/ParentRoutes.js";
import busRoutes from "./routes/admin/BusRoutes.js";
import routeRoutes from "./routes/admin/RouteRoutes.js";
import scheduleRoutes from "./routes/admin/ScheduleRoutes.js";
import attendanceRoutes from "./routes/admin/AttendanceRoutes.js";
import notificationRoutes from "./routes/admin/NotificationRoutes.js";
import driverDashboardRoutes from "./routes/driver/DashBoardRoutes.js";
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/parents", parentRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/driver-dashboard", driverDashboardRoutes)
// Socket.IO connections
io.on("connection", (socket) => {
  console.log("🔗 Client connected:", socket.id);
  
  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// Server listen
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
