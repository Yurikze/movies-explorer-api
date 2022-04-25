const { celebrate, Joi } = require('celebrate');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const auth = require('../middlewares/auth');
const { NotFoundError } = require('../Error/NotFoundError');
const { createUser, login, logout } = require('../controllers/users');

const appRouter = (app) => {
  app.post(
    '/signup',
    celebrate({
      body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().min(8),
        name: Joi.string().min(2).max(30),
      }),
    }),
    createUser
  );
  app.post(
    '/signin',
    celebrate({
      body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required(),
      }),
    }),
    login
  );
  app.post('/signout', logout);
  app.use('/users', auth, usersRouter);
  app.use('/movies', auth, moviesRouter);
  app.use('*', (req, res, next) => {
    next(new NotFoundError('Страница не найдена'));
  });
};

module.exports = { appRouter };
