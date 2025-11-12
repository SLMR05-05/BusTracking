import UserModel from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; // Thêm JWT để tạo token

const JWT_SECRET = "your_secret_key_here"; // Nên lưu trong .env

export const login = (req, res) => {
  // 1. Lấy username và password từ request body
  const { username, password } = req.body;

  // 2. Kiểm tra xem có username và password không
  if (!username || !password) {
    return res.status(400).json({ 
      message: "Thiếu tên đăng nhập hoặc mật khẩu" 
    });
  }

  // 3. Tìm user từ database theo username
  UserModel.findByUsername(username, (err, results) => {
    // Xử lý lỗi database
    if (err) {
      return res.status(500).json({ 
        message: "Lỗi truy vấn DB", 
        error: err 
      });
    }

    // Kiểm tra xem user có tồn tại không
    if (results.length === 0) {
      return res.status(401).json({ 
        message: "Không tìm thấy tài khoản" 
      });
    }

    const user = results[0];
 
    // 4. So sánh mật khẩu
    // Cách 1: Mật khẩu chưa mã hóa (KHÔNG AN TOÀN - chỉ dùng test)
    if (user.MatKhau !== password) {
      return res.status(401).json({ 
        message: "Sai mật khẩu" 
      });
    }

    // Cách 2: Mật khẩu đã mã hóa (AN TOÀN - nên dùng)
    // if (!bcrypt.compareSync(password, user.PasswordHash)) {
    //   return res.status(401).json({ 
    //     message: "Sai mật khẩu" 
    //   });
    // }

    // 5. Tạo JWT token
    const token = jwt.sign(
      { userId: user.UserId, role: user.Role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );
    console.log(user);
    // 6. Trả về thông tin user và token
    res.json({
      message: "Đăng nhập thành công",
      token: token,
      user: {
        id: user.MaTK,
        username: user.TenDangNhap,
        role: user.TenVT,
        status: user.TrangThaiXoa,
      },
    });
  });
};

// Hàm logout
export const logout = (req, res) => {
  res.json({ message: "Đã đăng xuất" });
};

// Hàm lấy thông tin user hiện tại
export const getCurrentUser = (req, res) => {
  const userId = req.user.userId; // Từ JWT middleware
  UserModel.findById(userId, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(results[0]);
  });
};
