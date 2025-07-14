const {
  getAllReviews,
  getReviewsByStoreId,
  postReview,
  patchReviewsByID,
  removeReviewByID,
} = require("./controllers/reviews.controller");
const {
  getUsers,
  getUsersByUID,
  getReviewsByUID,
} = require("./controllers/users.controller");
const { getEndPointsJSON } = require("./controllers/api.controller");
const express = require("express");
const app = express();

const { handleCustomErrors, handlePostgresErrors } = require('./errors')
const firebaseAuth = require('./middleware/firebaseAuth')
const cors = require('cors');

app.use(cors());

const {
  getAllStores,
  getStoreById,
} = require("./controllers/stores.controllers");

app.use(express.json());


app.get("/api/reviews", getAllReviews);
app.get("/api/reviews/:store_id", getReviewsByStoreId);
app.post("/api/reviews", firebaseAuth, postReview);
app.patch("/api/reviews/:review_id", patchReviewsByID);
app.delete("/api/reviews/:review_id", removeReviewByID);
app.get("/api", getEndPointsJSON);


app.get("/api/stores", getAllStores);
app.get("/api/stores/:store_id", getStoreById);

app.get("/api/users", getUsers);
app.get("/api/users/:uid", getUsersByUID);
app.get("/api/users/:uid/reviews", getReviewsByUID);

app.use((req, res) => {
  res.status(404).send({ msg: "Error - path not found" });
});

app.use(handleCustomErrors);
app.use(handlePostgresErrors);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ msg: "Server error custom" });
});

module.exports = app;
