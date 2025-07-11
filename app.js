const { getAllReviews, getReviewsByStoreId, postReview } = require("./controllers/reviews.controller");
const { getUsers, getUsersByID, getReviewsByUID } = require("./controllers/users.controller");
const { getEndPointsJSON } = require("./controllers/api.controller");
const express = require("express");
const app = express();

const {getAllStores, getStoreById} = require('./controllers/stores.controllers')

app.use(express.json());

app.get('/api/reviews', getAllReviews);
app.get('/api/reviews/:store_id', getReviewsByStoreId);
app.post('/api/reviews', postReview);
app.get('/api', getEndPointsJSON)

app.get('/api/stores', getAllStores)
app.get('/api/stores/:store_id', getStoreById)

app.get("/api/users", getUsers);
app.get("/api/users/:uid", getUsersByID);
app.get("/api/users/:uid/reviews", getReviewsByUID);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ msg: "Server error custom" });
});

module.exports = app;
