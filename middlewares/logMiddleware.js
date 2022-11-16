module.exports = (req, res, next) => {
    console.log('Se hizo una petición a ' + req.url);
    next();
}
