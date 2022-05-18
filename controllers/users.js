const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NotFoundError } = require('../Error/NotFoundError');
const { NotValidError } = require('../Error/NotValidError');
const { ConflictError } = require('../Error/ConflictError');

module.exports.createUser = async (req, res, next) => {
  const { email, password, name } = req.body;
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashPassword, name });
    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      { expiresIn: '7d' },
    );
    res
      .cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      })
      .status(200)
      .send({
        _id: user._id,
        email: user.email,
        name: user.name,
      });
  } catch (err) {
    if (err.name === 'MongoServerError' && err.code === 11000) {
      next(new ConflictError('Такой Email существует'));
    }
    if (err.name === 'ValidationError') {
      next(new NotValidError('Некорректые данные'));
    } else {
      next(err);
    }
  }
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        })
        .send({
          _id: user._id,
          email: user.email,
          name: user.name,
        });
    })
    .catch(next);
};

module.exports.logout = (req, res) => {
  res
    .cookie('jwt', 'jwt.token.revoked', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: -1,
    })
    .send({
      message: 'Сессия завершена',
    });
};

module.exports.getMe = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('Пользователь с id не найден');
    }
    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
};

module.exports.updateMe = async (req, res, next) => {
  const userId = req.user._id;
  const { name, email } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true },
    );
    if (!user) {
      throw new NotFoundError('Пользователь с id не найден');
    }
    res.status(200).send(user);
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new NotValidError('Некорректные данные'));
    }
    if (error.code === 11000) {
      next(new ConflictError('Такой email существует'));
    } else {
      next(error);
    }
  }
};
