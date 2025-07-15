const {
  fetchAllReviews,
  fetchReviewsByStoreId,
  insertReview,
  patchReviewByID,
  deleteReviewByID,
} = require("../models/reviews.model");
const { findOrCreateUserByFirebaseUid } = require("../models/users.models");
const { fetchStoreById } = require("../models/stores.models");

exports.getAllReviews = (req, res, next) => {
  fetchAllReviews()
    .then((reviews) => res.status(200).send({ reviews }))
    .catch((err) => {
      console.error("GET /api/reviews failed:", err);
      next(err);
    });
};

exports.getReviewsByStoreId = (req, res, next) => {
  const { store_id } = req.params;
  fetchStoreById(store_id)
    .then(() => {
      return fetchReviewsByStoreId(store_id);
    })
    .then((reviews) => res.status(200).send({ reviews }))
    .catch(next);
};

exports.postReview = (req, res, next) => {
  const firebaseUid = req.firebaseUid;
  console.log(req.firebaseUid);
  const { fruit, body, rating, store_id } = req.body;

  if (!firebaseUid) {
    return res.status(401).json({ error: "unauthorised" });
  }
  if (firebaseUid && (!body || body.trim() === "")) {
    return next({
      status: 400,
      msg: "Bad request - user must leave a comment",
    });
  }
  if ((firebaseUid && !fruit) || fruit.trim() === "") {
    return next({
      status: 400,
      msg: "Bad request - fruit selection must be specified in order to leave a comment",
    });
  }
  if (firebaseUid && !rating) {
    return next({
      status: 400,
      msg: "Bad request - rating must be added in order to post review",
    });
  }
  findOrCreateUserByFirebaseUid(firebaseUid)
    .then(() =>
      insertReview({ fruit, body, rating, store_id, uid: firebaseUid })
    )
    .then((newReview) => {
      res.status(201).send({ review: newReview });
    })
    .catch((err) => {
      console.error("post reviews error:", err);
      next(err);
    });
};

exports.patchReviewsByID = (req, res, next) => {
  const newReview = req.body;

  const { review_id } = req.params;

  const new_rating = newReview.rating;
  const new_body = newReview.body;

  if (typeof new_rating !== "number") {
    return next({ status: 400, msg: "Rating must be a number" });
  }
  if (new_rating > 5 || new_rating < 0) {
    return next({ status: 400, msg: "Invalid rating" });
  }
  patchReviewByID(review_id, new_body, new_rating)
    .then((updatedReview) => {
      res.status(200).send({ review: updatedReview });
    })
    .catch((err) => {
      next(err);
    });
};

exports.removeReviewByID = (req, res, next) => {
  const { review_id } = req.params;
  const numID = Number(review_id);
  if (!Number.isInteger(numID)) {
    return Promise.reject({ status: 400, msg: "Invalid review_id" });
  }
  deleteReviewByID(review_id)
    .then(() => {
      res.status(200).send();
    })
    .catch((err) => {
      next(err);
    });
};
