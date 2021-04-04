/* eslint-disable camelcase */
const { nanoid } = require('nanoid');
const Client = require('../models/Client');
const { retrieveAsteroidsNearClient } = require('./neaController');

exports.addClient = async (req, res) => {
  const idClient = nanoid();
  const { name, lastname, age, latitude, longitude, price } = req.body;
  const hotspot_asteroids = await retrieveAsteroidsNearClient(
    latitude,
    longitude,
  );
  const newClient = new Client({
    idClient,
    name,
    lastname,
    age,
    latitude,
    longitude,
    hotspot_asteroids: hotspot_asteroids,
    price: computePrice(age, hotspot_asteroids),
  });
  try {
    const result = await newClient.save();
    res.status(200).send({
      OK: 1,
      message: 'usuario añadido',
      idClient: result.idClient,
    });
  } catch (error) {
    res.status(400).send({
      Ok: 0,
      status: 400,
      message: `ERROR, usuario NO añadido:, ${error}`,
    });
  }
};

exports.addClientList = async (req, res) => {
  const clientList = req.body;
  if (!Array.isArray(clientList)) {
    res.status(400).send({
      Ok: 0,
      status: 400,
      message: 'ERROR, se esperaba un array de objetos',
    });
  } else {
    const options = {
      ordered: false,
      rawResult: false,
    };

    const clients = clientList.map(async (client) => {
      const hotspot_asteroids = await retrieveAsteroidsNearClient(
        client.latitude,
        client.longitude,
      );
      const price = computePrice(client.age, newClient.hotspot_asteroids);
      const newClient = {
        idClient: nanoid(),
        name: client.name,
        lastname: client.lastname,
        age: client.age,
        latitude: client.latitude,
        longitude: client.longitude,
        hotspot_asteroids: hotspot_asteroids,
        price: price,
      };
      return newClient;
    });
    try {
      const dbResult = await Client.insertMany(clients, options);
      res.status(200).send({
        Ok: 1,
        status: 200,
        message: 'Se insertaron TODOS los documentos',
        clientCreated: dbResult,
      });

      console.log('RESULT', dbResult);
    } catch (error) {
      res.status(400).send({
        Ok: 0,
        status: 400,
        message: 'ERROR, algunos documentos no se insertaron',
        clientCreated: error.insertedDocs,
      });
    }
  }
};

exports.getClient = async (req, res) => {
  const idClient = req.params.id;
  try {
    const result = await Client.findOne({ idClient }, { _id: 0, password: 0 });
    if (result) {
      res.status(200).send({
        OK: 1,
        status: 200,
        message: `usuario ${idClient} obtenido`,
        client: result,
      });
    } else {
      res.status(400).send({
        OK: 0,
        status: 400,
        message: `No existe el usuario con esta ID: ${idClient}`,
      });
    }
  } catch (error) {
    res.status(500).send({
      Ok: 0,
      status: 500,
      message: `ERROR, no se ha podido obtener usuario: ${error}`,
    });
  }
};

exports.getClients = async (req, res) => {
  try {
    const result = await Client.find({}, { _id: 0, password: 0 });
    if (result) {
      if (result) {
        res.status(200).send({
          OK: 1,
          status: 200,
          message: 'todos los usuarios obtenidos',
          client: result,
        });
      } else {
        res.status(400).send({
          OK: 0,
          status: 400,
          message: 'No hay usuarios en la base de datos',
        });
      }
    }
  } catch (error) {
    res.status(500).send({
      Ok: 0,
      status: 500,
      message: `ERROR, no se han podido obtener usuarios: ${error}`,
    });
  }
};

exports.updateClient = async (req, res) => {
  const newClient = {};
  const idClient = req.params.id;
  const { name, lastname, age, latitude, longitude, price } = req.body;
  if (name) newClient.name = name;
  if (lastname) newClient.lastname = lastname;
  if (age) newClient.age = age;
  if (latitude) newClient.latitude = latitude;
  if (longitude) newClient.longitude = longitude;
  if (price) newClient.price = price;

  if (longitude || latitude || age) {
    //tenemos que volver a calcular los campos computePrice y hotspot_asteroids
    const result = await Client.findOne(
      { idClient },
      { latitude: 1, longitude: 1, age: 1 },
    );
    const newLat = latitude ? latitude : result.latitude;
    const newLong = longitude ? longitude : result.longitude;
    const newAge = age ? age : result.age;
    console.log(
      'ESTAMOS ACTUALIZANDO CLIENTE:',
      result,
      newLat,
      newLong,
      newAge,
    );

    newClient.hotspot_asteroids = await retrieveAsteroidsNearClient(
      newLat,
      newLong,
    );
    console.log(newClient.hotspot_asteroids);
    newClient.price = computePrice(newAge, newClient.hotspot_asteroids);
  }
  console.log(newClient.price);

  const options = {
    new: true,
  };

  try {
    const result = await Client.findOneAndUpdate(
      { idClient },
      newClient,
      options,
    );
    if (result) {
      res.status(200).send({
        OK: 1,
        status: 200,
        message: `Cliente ${idClient} actualizado`,
        client: result,
      });
    } else {
      res.status(400).send({
        OK: 0,
        status: 400,
        message: `No existe el cliente con esta ID: ${idClient}`,
      });
    }
  } catch (error) {
    res.status(500).send({
      Ok: 0,
      status: 500,
      message: `ERROR, no se ha podido obtener cliente: ${error}`,
    });
  }
};

exports.deleteClient = async (req, res) => {
  const idClient = req.params.id;
  try {
    const result = await Client.findOneAndRemove({ idClient }).select({
      _id: 0,
      password: 0,
    });
    console.log('RESULT', result);
    if (result) {
      res.status(200).send({
        OK: 1,
        status: 200,
        message: `Cliente ${idClient} eliminado`,
        client: result,
      });
    } else {
      res.status(400).send({
        OK: 0,
        status: 400,
        message: `No existe el cliente con esta ID: ${idClient}`,
      });
    }
  } catch (error) {
    res.status(500).send({
      Ok: 0,
      status: 500,
      message: `ERROR, no se ha podido encontrar cliente: ${error}`,
    });
  }
};

exports.jsonClients2DB = (jsonObj) => {
  console.info('Importando archivo Clientes');
  jsonObj.map(async (client) => {
    const CSVClient = {};
    CSVClient.idClient = nanoid();
    CSVClient.name = client.Name;
    CSVClient.lastname = client.Lastname;
    CSVClient.age = client.Age;
    CSVClient.latitude = client.Latitude;
    CSVClient.longitude = client.Longitude;
    CSVClient.hotspot_asteroids = await retrieveAsteroidsNearClient(
      client.Latitude,
      client.Longitude,
    );
    CSVClient.price = computePrice(client.Age, CSVClient.hotspot_asteroids);
    try {
      const newClient = new Client(CSVClient);
      await newClient.save();
    } catch (error) {
      console.error(`Error en importación CSV ${client.name}: ${error}`);
    }
  });
};

const computePrice = (age, hotspotAsteroids) => {
  const fixedPrice = 170;
  const variablePrice = (100 * age) / 35 + 10 * hotspotAsteroids;

  return fixedPrice + variablePrice;
};
