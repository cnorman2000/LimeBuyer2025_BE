const { request } = require("../app");
const {
  selectUsers,
  selectUsersByUID,
  selectReviewsByUID,
  createNewUser,
  changeUser,
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

exports.getUsersByUID = (req, res, next) => {
  const uid = req.params.uid;
  const alphanumericRegex = /^[a-zA-Z0-9]+$/;
  if (!alphanumericRegex.test(uid)) {
    return next({ status: 400, msg: "Error - bad request: invalid uid" });
  }
  selectUsersByUID(uid)
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

exports.postNewUser = (req, res, next) => {
  const { uid, username } = req.body;

  createNewUser(uid, username)
    .then((newUser) => {
      console.log(newUser);
      res.status(201).send({ user: newUser });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchUser = (req, res, next) => {
  const { uid } = req.params;

  const newUserInfo = req.body;

  const newUsername = newUserInfo.username;
  const newAvatar = newUserInfo.avatar_url;

  changeUser(uid, newUsername, newAvatar)
    .then((updatedUser) => {
      res.status(200).send({ user: updatedUser });
    })
    .catch((err) => {
      next(err);
    });
};
