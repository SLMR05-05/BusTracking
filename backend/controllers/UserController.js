import UserModel from "../models/UserModel.js";
import bcrypt from "bcryptjs"; // nếu mày có hash mật khẩu, còn nếu chưa thì bỏ qua

export const login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "Thiếu tên đăng nhập hoặc mật khẩu" });

  UserModel.findByUsername(username, (err, results) => {
    if (err) return res.status(500).json({ message: "Lỗi truy vấn DB", error: err });
    if (results.length === 0)
      return res.status(401).json({ message: "Không tìm thấy tài khoản" });

    const user = results[0];

    // ⚠️ Nếu mật khẩu chưa mã hóa (PasswordHash lưu plain text)
    if (user.PasswordHash !== password) {
      return res.status(401).json({ message: "Sai mật khẩu" });
    }

    // ✅ Nếu dùng hash thì dùng dòng này:
    // if (!bcrypt.compareSync(password, user.PasswordHash)) {
    //   return res.status(401).json({ message: "Sai mật khẩu" });
    // }

    res.json({
      message: "Đăng nhập thành công",
      user: {
        id: user.UserId,
        username: user.Username,
        role: user.Role,
        email: user.Email,
        phone: user.Phone,
        status: user.TrangThai,
      },
    });
  });
};
