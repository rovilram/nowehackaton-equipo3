const express = require('express');

const router = express.Router();
const {
  addUser,
  addUserList,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

router
  .route('/')

  .post(addUser)

  .get(getUsers);

router
  .route('/:id')

  .get(getUser)

  .patch(updateUser)

  .delete(deleteUser);

router
  .route('/list')

  .post(addUserList);

module.exports = router;
