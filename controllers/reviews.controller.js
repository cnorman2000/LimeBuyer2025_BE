const { fetchAllReviews, fetchReviewsByStoreId, insertReview } = require('../models/reviews.model')
const { findOrCreateUserByFirebaseUid } = require('../models/users.models')

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
  const firebaseUid = req.firebaseUid;
    const { fruit, body, rating, store_id } = req.body;
    console.log('received UID:', firebaseUid)
    console.log('body',req.body)

  if (!firebaseUid) {
    return res.status(401).json({ error: "unauthorised" });
  }

  findOrCreateUserByFirebaseUid(firebaseUid)
    .then(() => insertReview({ fruit, body, rating, store_id, uid: firebaseUid }))
    .then((newReview) => {
      res.status(201).send({ review: newReview });
    })
      .catch((err) => {
          console.error("post reviews error:", err);
          next(err)
    });
};