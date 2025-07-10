const db = require('../db/connection')

exports.fetchAllReviews = () => {
    return db.query(`SELECT reviews.*, users.username, users.avatar_url
        FROM reviews
        JOIN users ON reviews.uid = users.uid`
    )
        .then((result) => result.rows)
};

exports.fetchReviewsByStoreId = (storeId) => {
    return db.query(`
        SELECT reviews.*, users.username, users.avatar_url
        from reviews
        JOIN users ON reviews.uid = users.uid
        WHERE store_id = $1
        `, [storeId])
    .then((result)=>result.rows)
}

exports.insertReview = ({ fruit, body, rating, store_id, uid }) => {
    const query = `INSERT INTO reviews (fruit, body, rating, store_id, uid)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;`
    const values = [fruit, body, rating, store_id, uid];
    return db.query(query, values).then((result)=> result.rows[0])
}