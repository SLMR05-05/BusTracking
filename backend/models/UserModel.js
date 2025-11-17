import db from "../config/db.js";

const UserModel = {
  findByUsername: (username, callback) => {
    const sql = `
    SELECT tk.*, vt.*
    FROM taikhoan tk
    INNER JOIN vaitro vt ON tk.MaVT = vt.MaVT
    WHERE tk.TenDangNhap = ? 
    `;
    db.query(sql, [username], callback);
  },
  findById: (userId, callback) => {
    const query = "SELECT * FROM taikhoan WHERE MaTK = ?";
    db.query(query,[userId],callback);
  },
  create: (userData, callback) => {
    const query = "INSERT INTO taikhoan SET ?";
    db.query(query,userData, callback);
  },
  update: (userId , userData, callback)=>{
    const query = "UPDATE taikhoan SET ? WHERE MaTK = ?";
    db.query(query, [userId,userData ], callback);
  }
};

export default UserModel;
