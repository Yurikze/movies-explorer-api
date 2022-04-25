const { NotValidError } = require('../Error/NotValidError');
const { NotFoundError } = require('../Error/NotFoundError');
const { ForbiddenError } = require('../Error/ForbiddenError');
const Movie = require('../models/movie');

module.exports.saveMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new NotValidError('Некорректные данные'));
      }
      next(error);
    });
};

module.exports.getMovies = (req, res) => {
  Movie.find({}).then((movies) => res.send(movies));
};

module.exports.removeMovie = (req, res, next) => {
  Movie.findById(req.params.movieId).then((movie) => {
    if (!movie) {
      throw new NotFoundError('Фильм не найден');
    }
    if (movie.owner._id.toString() !== req.user._id.toString()) {
      throw new ForbiddenError('Вы не можете удалить чужой фильм');
    }
    return movie
      .remove()
      .then(() => {
        res.status(200).send({ message: 'Movie removed from favourite' });
      })
      .catch(next);
  });
};
