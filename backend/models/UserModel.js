import db from "../config/db.js";

const UserModel = {
  findByUsername: (username, callback) => {
    const sql = "SELECT * FROM useraccount WHERE Username = ?";
    db.query(sql, [username], callback);
  },
};

export default UserModel;
