import jwt from "jsonwebtoken";

const JWT_SECRET = "your_secret_key_here";

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Lấy token từ header

  if (!token) {
    return res.status(401).json({ message: "Không có token" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Lưu thông tin user vào req
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
};