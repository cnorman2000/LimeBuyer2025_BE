
const express = require('express');
const {getEndPointsJSON} = require('./controllers/api.controller')
const app = express()

app.get('/api', getEndPointsJSON)
app.get('/api/stores', )
const { getUsers, getUsersByID } = require("./Controllers/users.controller");

app.use(express.json());
app.get("/api/users", getUsers);
app.get("/api/users/:uid", getUsersByID);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ msg: "Server error custom" });
});
module.exports = app;
