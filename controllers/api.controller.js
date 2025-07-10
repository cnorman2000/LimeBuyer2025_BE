const endpointsJson = require('../endpoints.json');

const getEndPointsJSON = (request, response) => {
    response.status(200).send({endpoints: endpointsJson})
}

module.exports = {getEndPointsJSON}