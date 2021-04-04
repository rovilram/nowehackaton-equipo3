const mongoose = require('../database/mongoose');

const userSchema = new mongoose.Schema({
  idUser: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  hotspot_asteroids: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
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
