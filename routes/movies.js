const router = require('express').Router();

const { saveMovie, getMovies, removeMovie } = require('../controllers/movies');

router.post('/', saveMovie);

router.get('/', getMovies);

router.delete('/:movieId', removeMovie);

module.exports = router;
