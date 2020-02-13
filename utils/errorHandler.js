function errorHandler(error, status, message) {
    console.log(error);
    res.status(status).json({ errorMessage: message });
}

module.exports = errorHandler;