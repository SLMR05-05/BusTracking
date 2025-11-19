import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import http from "http";
import { Server } from "socket.io";
import userRoutes from "./routes/UserRoutes.js";
import driverRoutes from "./routes/DriverRoutes.js";
import studentRoutes from "./routes/StudentRoutes.js";
import parentRoutes from "./routes/ParentRoutes.js";
import busRoutes from "./routes/BusRoutes.js";
import routeRoutes from "./routes/RouteRoutes.js";
import scheduleRoutes from "./routes/ScheduleRoutes.js";
import attendanceRoutes from "./routes/AttendanceRoutes.js";
import notificationRoutes from "./routes/NotificationRoutes.js";

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

// Socket.IO connections
io.on("connection", (socket) => {
  console.log(" Client connected:", socket.id);
  
  socket.on("disconnect", () => {
    console.log(" Client disconnected:", socket.id);
  });
});

// Server listen
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
