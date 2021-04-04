const mongoose = require('../database/mongoose');

const clientSchema = new mongoose.Schema({
  idClient: {
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
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
