const csv = require('csvtojson');
require('dotenv').config();

const { importUsers } = require('../controllers/userController');
const { jsonClients2DB } = require('../controllers/clientController');
const { jsonNeas2DB } = require('../controllers/neaController');

const { users } = require(process.env.JSON_FILE_USERS);

// convertimos el csv de datos NEA y lo pasamos a la base de datos
csv()
  .fromFile(process.env.CSV_FILE_NEAS)
  .then((neas) => {
    jsonNeas2DB(neas);
  });

// convertimos el csv de datos clientes y lo pasamos a la base de datos
csv()
  .fromFile(process.env.CSV_FILE_CLIENTS)
  .then((clients) => {
    jsonClients2DB(clients);
  });

// metemos los usuarios del json en la base de datos
importUsers(users);
