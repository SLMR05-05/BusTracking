import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456789",
  database: "quanlyxebuyt",
});

db.connect(err => {
  if (err) console.error("Lỗi kết nối DB:", err);
  else console.log("Kết nối MySQL thành công!");
});

export default db;
