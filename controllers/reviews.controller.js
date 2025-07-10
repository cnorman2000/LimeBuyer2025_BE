const { fetchAllReviews, fetchReviewsByStoreId, insertReview } = require('../models/reviews.model')

exports.getAllReviews = (req, res, next) => {
    fetchAllReviews()
        .then((reviews) => res.status(200).send({ reviews }))
        .catch((err) => {
            console.error('GET /api/reviews failed:', err);
            next(err)
    })
}

exports.getReviewsByStoreId = (req, res, next) => {
    const { store_id } = req.params;
    fetchReviewsByStoreId(store_id)
        .then((reviews) => res.status(200).send({ reviews }))
    .catch(next)
}

exports.postReview = (req, res, next) => {
    const { fruit, body, rating, store_id, uid } = req.body;
    insertReview({ fruit, body, rating, store_id, uid })
        .then((newReview) => {
            res.status(201).send({ review: newReview })
        })
        .catch(next);
}