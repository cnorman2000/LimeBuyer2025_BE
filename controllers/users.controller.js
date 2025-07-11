const {
  selectUsers,
  selectUsersByID,
  selectReviewsByUID,
} = require("../models/users.models");

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsersByID = (req, res, next) => {
  const uid = req.params.uid;
  selectUsersByID(uid)
    .then((user) => {
      res.status(200).send({ user: user });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviewsByUID = (req, res, next) => {
  const { uid } = req.params;
  selectReviewsByUID(uid)
    .then((reviews) => {
      console.log(reviews);
      res.status(200).send({ reviews: reviews });
    })
    .catch((err) => {
      next(err);
    });
};
