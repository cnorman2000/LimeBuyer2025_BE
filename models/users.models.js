const db = require("../db/connection");

exports.selectUsers = () => {
  return db.query("SELECT * FROM users;").then(({ rows }) => {
    return rows;
  });
};

exports.selectUsersUByID = (uid) => {
  return db
    .query("SELECT * FROM users WHERE uid = $1", [uid])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "User not found",
        });
      }
      return rows[0];
    });
};

exports.selectReviewsByUID = (uid) => {
  return db
    .query(`SELECT * FROM reviews WHERE uid = $1`, [uid])
    .then((result) => result.rows);
};
