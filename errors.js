handlePostgresErrors = (err, req, res, next) => {
    if (err.code === '22P02') {
        response.status(400).send({msg: 'Bad request'})
    } else {
        next(err)
    }
}

handleCustomErrors = (err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({msg: err.msg})
    } else {
        next(err)
    }
}

module.exports = {
    handlePostgresErrors, handleCustomErrors
}