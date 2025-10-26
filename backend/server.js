import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import userRoutes from "./routes/UserRoutes.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Gắn route user
app.use("/api/users", userRoutes);

app.listen(5000, () => {
  console.log("Server đang chạy ở http://localhost:5000");
});
