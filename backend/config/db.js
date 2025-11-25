import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "quanlyxebuyt",
  timezone: "+07:00"  // Cấu hình timezone Việt Nam (UTC+7)
});

db.connect(err => {
  if (err) console.error("Lỗi kết nối DB:", err);
  else console.log("Kết nối MySQL thành công!");
});

export default db;
