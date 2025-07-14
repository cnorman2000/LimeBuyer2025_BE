const { fetchAllReviews, fetchReviewsByStoreId, insertReview } = require('../models/reviews.model')
const {fetchStoreById} = require('../models/stores.models')

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
fetchStoreById(store_id)
    .then(() => {return fetchReviewsByStoreId(store_id)})
        .then((reviews) => res.status(200).send({ reviews }))
    .catch(next)
}

exports.postReview = (req, res, next) => {
    const { fruit, body, rating, store_id, uid } = req.body;

    if (!uid) {
        return next({
      status: 400,
      msg: "Bad request - user must be logged in to comment",
    })
    } 
    if (!body) {
        return next({
            status: 400, msg: "Bad request - user must leave a comment"
        })
    }
    if (!fruit) {
        return next({
            status: 400, msg: "Bad request - fruit selection must be specified in order to leave a comment"
        })
    }
    if (!rating) {
        return next({
            status: 400, msg: "Bad request - rating must be added in order to post review"
        })
    }
    insertReview({ fruit, body, rating, store_id, uid })
        .then((newReview) => {
            res.status(201).send({ review: newReview })
        })
        .catch(next);
}