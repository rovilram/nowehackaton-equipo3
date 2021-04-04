const express = require('express');

const router = express.Router();
const {
  addClient,
  addClientList,
  getClient,
  getClients,
  updateClient,
  deleteClient,
} = require('../controllers/clientController');

router
  .route('/')

  .post(addClient)

  .get(getClients);

router
  .route('/:id')

  .get(getClient)

  .patch(updateClient)

  .delete(deleteClient);

router
  .route('/list')

  .post(addClientList);

module.exports = router;
