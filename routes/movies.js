const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { isURL } = require('validator');
const { saveMovie, getMovies, removeMovie } = require('../controllers/movies');

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.number().required(),
      description: Joi.string().required(),
      image: Joi.string()
        .required()
        .custom((value, helper) => {
          if (isURL(value)) return value;
          return helper.message('Некорректные данные');
        }),
      trailerLink: Joi.string()
        .required()
        .custom((value, helper) => {
          if (isURL(value)) return value;
          return helper.message('Некорректные данные');
        }),
      thumbnail: Joi.string()
        .required()
        .custom((value, helper) => {
          if (isURL(value)) return value;
          return helper.message('Некорректные данные');
        }),
      owner: Joi.string().length(24).hex(),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  saveMovie,
);

router.get('/', getMovies);

router.delete(
  '/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().hex(),
    }),
  }),
  removeMovie,
);

module.exports = router;
