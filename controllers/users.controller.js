const { request } = require("../app");
const {
  selectUsers,
  selectUsersByUID,
  selectReviewsByUID,
  createNewUser,
  changeUsername,
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

exports.patchUsername = (req, res, next) => {
  const { uid } = req.params;
  const newUsername = req.body;
  console.log(uid);
  console.log(newUsername);
  changeUsername(uid, newUsername)
    .then((updatedUsername) => {
      res.status(200).send({ username: updatedUsername });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchAvatar = (req, res, next) => {
  const { uid } = req.params;
  const newAvatar = req.body;
  console.log(uid);
  console.log(newAvatar);
  changeUsername(uid, newAvatar)
    .then((updatedAvatar) => {
      res.status(200).send({ username: updatedAvatar });
    })
    .catch((err) => {
      next(err);
    });
};
