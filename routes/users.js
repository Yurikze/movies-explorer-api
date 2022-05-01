const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getMe, updateMe } = require('../controllers/users');

router.get('/me', getMe);
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
    }),
  }),
  updateMe,
);

module.exports = router;
