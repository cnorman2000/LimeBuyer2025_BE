const { fetchAllStores, fetchStoreById } = require("../models/stores.models");

const getAllStores = (request, response, next) => {
  return fetchAllStores()
    .then((stores) => {
      response.status(200).send({ stores });
    })
    .catch((err) => {
      next(err);
    });
};

const getStoreById = (request, response, next) => {
  const { store_id } = request.params;
  fetchStoreById(store_id)
    .then((store) => {
      response.status(200).send({ store });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getAllStores, getStoreById };
