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

exports.findOrCreateUserByFirebaseUid = (
  firebaseUid,
  preferredUsername = null
) => {
  return db
    .query(`SELECT * from users WHERE uid = $1`, [firebaseUid])
    .then(({ rows }) => {
      if (rows.length > 0) {
        return rows[0];
      } else {
        const newUsername =
          preferredUsername || `user-${firebaseUid.slice(0, 6)}`;
        const defaultAvatar =
          "https://api.dicebear.com/9.x/thumbs/svg?seed=Eden";

        return db
          .query(
            `INSERT INTO users (uid, username, avatar_url) VALUES ($1, $2, $3) RETURNING *`,
            [firebaseUid, newUsername, defaultAvatar]
          )
          .then(({ rows }) => rows[0]);
      }
    })
    .catch((err) => {
      if (err.code === "23505") {
        return Promise.reject({ status: 403, msg: "Username already in use" });
      }
    });
};

exports.createNewUser = (uid, username) => {
  const placeholder = "https://api.dicebear.com/9.x/thumbs/svg?seed=Eden";

  return db
    .query(
      `INSERT INTO users (uid, username, avatar_url) VALUES($1, $2, $3) RETURNING *`,
      [uid, username, placeholder]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.changeUser = (uid, newUsername, newAvatar) => {
  return db
    .query(
      `UPDATE users SET username = $1, avatar_url = $2 WHERE uid = $3 RETURNING *`,
      [newUsername, newAvatar, uid]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

