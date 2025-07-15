handlePostgresErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else if (err.code === "23503") {
    if (err.detail && err.detail.includes("stores")) {
      res.status(404).send({ msg: "Error - store not found" });
    }
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "Store must not be missing" });
  } else {
    next(err);
  }
};

handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

module.exports = {
  handlePostgresErrors,
  handleCustomErrors,
};
