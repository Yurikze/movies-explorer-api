const Movie = require('../models/movie');

module.exports.saveMovie = (req, res) => {
  const {
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
  } = req.body;

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
  });
};

module.exports.getMovies = (req, res) => {
  Movie.find({}).then((movies) => res.send(movies));
};

module.exports.removeMovie = (req, res) => {
  Movie.findById(req.params.movieId)
  .then(movie => {
    return movie.remove()
      .then(() => {
        res.status(200).send({ message: 'Movie removed from favourite'})
      })
  })
}