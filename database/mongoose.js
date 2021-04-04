// Aquí configuración de conexión a la base de datos
const mongoose = require('mongoose');
require('dotenv').config();

const DB = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  name: process.env.DB_NAME,
};
const DB_URI = `mongodb://${DB.host}:${DB.port}/${DB.name}`;

//  conectamos a la base de datos una sola vez y esa misma conexión se reutilizará
mongoose
  .connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    // eslint-disable-next-line no-console
    console.info('Connected to DB!', DB_URI);
  })
  // eslint-disable-next-line no-console
  .catch((err) => console.error('DB conection error:', err));

//  desconecta la base de datos cuando salimos de node con ctrl+c
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    // eslint-disable-next-line no-console
    console.info('> mongoose succesfully disconnected!');
    process.exit(0);
  });
});

module.exports = mongoose;
