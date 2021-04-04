/* eslint-disable camelcase */
const { nanoid } = require('nanoid');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const Client = require('../models/Client');

exports.addClient = async (req, res) => {
  const idClient = nanoid();
  const {
    name,
    lastname,
    age,
    latitude,
    longitude,
    hotspot_asteroids,
    price,
  } = req.body;

  const newClient = new Client({
    idClient,
    name,
    lastname,
    age,
    latitude,
    longitude,
    hotspot_asteroids,
    price,
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

    const clients = clientList.map((client) => {
      const newClient = {
        idClient: nanoid(),
        clientName: client.clientName,
        password: md5(client.password),
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
    console.log('RESULT', result);
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
  let newClient = {};
  const idClient = req.params.id;
  const { clientName, password } = req.body;
  if (clientName && password) {
    newClient = {
      clientName,
      password: md5(password),
    };
  } else if (clientName) {
    newClient = {
      clientName,
    };
  } else if (password) {
    newClient = {
      password: md5(password),
    };
  }

  const options = {
    new: true,
  };

  try {
    const result = await Client.findOneAndUpdate(
      { idClient },
      newClient,
      options,
    );
    console.log('RESULT', result);
    if (result) {
      res.status(200).send({
        OK: 1,
        status: 200,
        message: `usuario ${idClient} actualizado`,
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
        message: `usuario ${idClient} eliminado`,
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
      message: `ERROR, no se ha podido encontrar usuario: ${error}`,
    });
  }
};

exports.login = async (req, res) => {
  const { client } = req.body;
  const { password } = req.body;

  const response = await Client.findOne({ client, password: md5(password) });

  if (response) {
    const payload = { client };
    const options = { expiresIn: '10m' };
    const token = jwt.sign(payload, response.secretKey, options);
    res.send({
      OK: 1,
      message: 'Usuario autorizado',
      token,
    });
  } else {
    res.status(401).send({
      OK: 0,
      error: 401,
      message: 'usuario/contraseña no válidos',
    });
  }
};

exports.logout = async (req, res) => {
  const { authorization } = req.headers;

  const token = authorization.split(' ')[1];

  const { client } = jwt.decode(token);

  const response = await Client.findOne({ client });

  if (response) {
    const { secretKey } = response;

    try {
      jwt.verify(token, secretKey);
      try {
        const newSecret = nanoid();
        await Client.updateOne({ client }, { secretKey: newSecret });
        res.send({
          OK: 1,
          message: 'Client Disconnected',
        });
      } catch (error) {
        res.status(500).send({
          OK: 0,
          error: 500,
          message: error.message,
        });
      }
    } catch (error) {
      res.status(401).send({
        OK: 0,
        error: 401,
        message: error.message,
      });
    }
  }
};

// middleware!!!
exports.authClient = async (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization) {
    const token = authorization.split(' ')[1];

    const payload = jwt.decode(token);

    if (!payload) {
      res.status(401).send({
        OK: 0,
        status: 401,
        message: 'Invalid token',
      });
    } else {
      const { client } = payload;

      const response = await Client.findOne({ client });

      if (response) {
        const { secretKey } = response;

        try {
          jwt.verify(token, secretKey);
          next();
        } catch (error) {
          res.status(401).send({
            OK: 0,
            error: 401,
            message: error.message,
          });
        }
      } else {
        res.status(401).send({
          OK: 0,
          error: 401,
          message: 'Client unknown / invalid Token',
        });
      }
    }
  } else {
    res.status(401).send({
      OK: 0,
      error: 401,
      message: 'Token required',
    });
  }
};

exports.importClients = (clients) => {
  try {
    Client.insertMany(clients);
    clients.map(async (client) => {
      client.idClient = nanoid();
      client.secretKey = nanoid();
      const newClient = new Client(client);
      const result = await newClient.save();
      if (result) {
        console.log(
          `Usuario ${result.clientName} importado. Contraseña predeterminada Aa#00000`,
        );
      }
    });
  } catch (error) {
    console.log(`Error al importar los datos de usuario: ${error}`);
  }
};
