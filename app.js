
const { getAllReviews, getReviewsByStoreId, postReview } = require('./controllers/reviews.controller');
const express = require('express');
const {getEndPointsJSON} = require('./controllers/api.controller')
const app = express()
app.use(express.json());
app.get('/api/reviews', getAllReviews);
app.get('/api/reviews/:store_id', getReviewsByStoreId);
app.post('/api/reviews', postReview);
app.get('/api', getEndPointsJSON)
app.get('/api/stores', )
const { getUsers, getUsersByID } = require("./Controllers/users.controller");
app.get("/api/users", getUsers);
app.get("/api/users/:uid", getUsersByID);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ msg: "Server error custom" });
});
module.exports = app;

