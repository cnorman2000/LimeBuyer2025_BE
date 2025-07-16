const db = require("../db/connection");

exports.fetchAllReviews = () => {
  return db
    .query(
      `SELECT reviews.*, users.username, users.avatar_url
        FROM reviews
        JOIN users ON reviews.uid = users.uid`
    )
    .then((result) => result.rows);
};

exports.fetchReviewsByStoreId = (storeId) => {
  return db
    .query(
      `
        SELECT reviews.*, users.username, users.avatar_url
        from reviews
        JOIN users ON reviews.uid = users.uid
        WHERE store_id = $1
        `,
      [storeId]
    )
    .then((result) => result.rows);
};

exports.insertReview = ({ fruit, body, rating, store_id, uid }) => {
  const query = `INSERT INTO reviews (fruit, body, rating, store_id, uid)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;`;
  const values = [fruit, body, rating, store_id, uid];
  return db.query(query, values).then((result) => result.rows[0]);
};

exports.patchReviewByID = (review_id, new_body, new_rating) => {
  return db
    .query(
      `UPDATE reviews SET body = $1, rating = $2 WHERE review_id = $3 RETURNING *`,
      [new_body, new_rating, review_id  ]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.deleteReviewByID = (review_id, uid) => {
 
  
  return db
    .query(`SELECT uid FROM reviews WHERE review_id = $1`, [review_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Review not found" });
      }
      if (String(rows[0].uid) !== String(uid)) {
        return Promise.reject({ status: 403, msg: "Forbidden" });
      }

      return db.query(`DELETE FROM reviews WHERE review_id = $1`, [review_id]);
    });
};

exports.findReviewByID = (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id])
    .then(({ rows }) => rows[0]);
};
