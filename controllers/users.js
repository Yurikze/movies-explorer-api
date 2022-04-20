const User = require('../models/user');

module.exports.createUser = (req, res) => {
  const { email, password } = req.body;

  User.create({ email, password });
}