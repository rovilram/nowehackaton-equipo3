const mongoose = require('../database/mongoose');

const userSchema = new mongoose.Schema({
  idUser: {
    type: String,
    unique: true,
    required: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  secretKey: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
