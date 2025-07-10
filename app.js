const express = require('express');
const {getEndPointsJSON} = require('./controllers/api.controller')
const app = express()

app.get('/api', getEndPointsJSON)
app.get('/api/stores', )

module.exports = app