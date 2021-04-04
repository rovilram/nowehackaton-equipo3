const csv = require('csvtojson');
require('dotenv').config();
const { jsonArr2DB } = require('../controllers/neaController');

const { importUsers } = require('../controllers/userController');

const { users } = require(process.env.JSON_FILE_USERS);

// convertimos el csv de datos NEA y lo pasamos a la base de datos
csv()
  .fromFile(process.env.CSV_FILE_NEAS)
  .then((jsonObj) => {
    jsonArr2DB(jsonObj);
  });
// metemos los usuarios del json en la base de datos
importUsers(users);
