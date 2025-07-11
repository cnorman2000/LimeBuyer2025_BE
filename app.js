
const { getAllReviews, getReviewsByStoreId, postReview } = require('./controllers/reviews.controller');
const express = require('express');
const {getEndPointsJSON} = require('./controllers/api.controller')
const {getAllStores, getStoreById} = require('./controllers/stores.controllers')

const app = express()
app.use(express.json());

app.get('/api/reviews', getAllReviews);
app.get('/api/reviews/:store_id', getReviewsByStoreId);
app.post('/api/reviews', postReview);
app.get('/api', getEndPointsJSON)
app.get('/api/stores', getAllStores)
app.get('/api/stores/:store_id', getStoreById)
const { getUsers, getUsersByID } = require("./controllers/users.controller");
app.get("/api/users", getUsers);
app.get("/api/users/:uid", getUsersByID);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ msg: "Server error custom" });
});

module.exports = app;

