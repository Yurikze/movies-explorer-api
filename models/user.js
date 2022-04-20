const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    default: 'Dart',
    minlength: 2,
    maxlength: 30,
  },
});

module.exports = mongoose.model('user', userSchema);