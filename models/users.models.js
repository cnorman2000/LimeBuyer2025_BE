const db = require("../db/connection");

exports.selectUsers = () => {
  return db.query("SELECT * FROM users;").then(({ rows }) => {
    return rows;
  });
};

exports.selectUsersByUID = (uid) => {
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

exports.findOrCreateUserByFirebaseUid = (firebaseUid) => {
  return db
    .query(`SELECT * from users WHERE uid = $1`, [firebaseUid])
    .then(({ rows }) => {
      if (rows.length > 0) {
        return rows[0];
      } else {
        return db
          .query(
            `INSERT INTO users (uid, username) VALUES ($1, $2) RETURNING *`,
            [firebaseUid, `test-user-${firebaseUid.slice(0, 6)}`]
          )
          .then(({ rows }) => rows[0]);
      }
    });
};

exports.createNewUser = (uid, username) => {
  const placeholder =
    "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg";

  return db
    .query(
      `INSERT INTO users (uid, username, avatar_url) VALUES($1, $2, $3) RETURNING *`,
      [uid, username, placeholder]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

