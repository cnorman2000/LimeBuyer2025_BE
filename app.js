const express = require('express');
const app = express();
const { getAllReviews, getReviewsByStoreId, postReview } = require('./controllers/reviews.controller');
app.use(express.json());



app.get('/api/reviews', getAllReviews);
app.get('/api/reviews/:store_id', getReviewsByStoreId);
app.post('/api/reviews', postReview);


app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send({msg:'Server error custom'})
})

module.exports = app