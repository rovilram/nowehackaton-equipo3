const express = require('express');

const router = express.Router();
/* const {
  getQuestion,
  postQuestion,
  putQuestion,
  delQuestion,
  getAllQuestions,
} = require('../controllers/questionController'); */

const {
  addNea,
  getNeas,
  addNeas,
  getNea,
  updateNea,
  deleteNea,
} = require('../controllers/neaController');

router
  .route('/')

  .post(addNea)

  .get(getNeas);

router
  .route('/list')

  .post(addNeas);

router
  .route('/:id')

  .get(getNea)

  .patch(updateNea)

  .delete(deleteNea);

module.exports = router;
