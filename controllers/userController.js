const { nanoid } = require('nanoid');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const isValidPassword = (password) => {
  // Minimo 8 caracteres, 1 minúscula, 1 mayúscula, 1 número y 1 caracter especial(@#$%&)
  const validLong = password.length > 7;
  const validMin = /[a-z]+/.test(password);
  const validMay = /[A-Z]+/.test(password);
  const validNum = /[0-9]+/.test(password);
  const validSpecial = /[@#$%&]+/.test(password);
  if (!validLong) {
    return { OK: false, message: 'password must be at least 8 characters' };
  }
  if (!validMin) {
    return {
      OK: false,
      message: 'password must be at least 1 lowecase character',
    };
  }
  if (!validMay) {
    return {
      OK: false,
      message: 'password must be at least 1 uppercase character',
    };
  }
  if (!validNum) {
    return { OK: false, message: 'password must be at least 1 number' };
  }
  if (!validSpecial) {
    return {
      OK: false,
      message: 'password must be at least 1 special character (@#$%&)',
    };
  }
  return { OK: true };
};

exports.addUser = async (req, res) => {
  const idUser = nanoid();
  const secretKey = nanoid();
  const { userName, password } = req.body;
  if (!userName || !password) {
    res.status(400).send({
      Ok: 0,
      status: 400,
      message: 'ERROR, userName y password no pueden estar vacios',
    });
  }
  const isValidPass = isValidPassword(password);
  if (!isValidPass.OK) {
    res.status(400).send({
      Ok: 0,
      status: 400,
      message: isValidPass.message,
    });
  }
  const newUser = new User({
    idUser,
    userName,
    password: md5(password),
    secretKey,
  });
  try {
    const result = await newUser.save();
    res.status(200).send({
      OK: 1,
      message: 'usuario añadido',
      idUser: result.idUser,
    });
  } catch (error) {
    res.status(400).send({
      Ok: 0,
      status: 400,
      message: `ERROR, usuario NO añadido:, ${error}`,
    });
  }
};

exports.addUserList = async (req, res) => {
  const userList = req.body;
  if (!Array.isArray(userList)) {
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

    const users = userList.map((user) => {
      const newUser = {
        idUser: nanoid(),
        userName: user.userName,
        password: md5(user.password),
      };
      return newUser;
    });
    try {
      const dbResult = await User.insertMany(users, options);
      res.status(200).send({
        Ok: 1,
        status: 200,
        message: 'Se insertaron TODOS los documentos',
        userCreated: dbResult,
      });

      console.log('RESULT', dbResult);
    } catch (error) {
      res.status(400).send({
        Ok: 0,
        status: 400,
        message: 'ERROR, algunos documentos no se insertaron',
        userCreated: error.insertedDocs,
      });
    }
  }
};

exports.getUser = async (req, res) => {
  const idUser = req.params.id;
  try {
    const result = await User.findOne({ idUser }, { _id: 0, password: 0 });
    console.log('RESULT', result);
    if (result) {
      res.status(200).send({
        OK: 1,
        status: 200,
        message: `usuario ${idUser} obtenido`,
        user: result,
      });
    } else {
      res.status(400).send({
        OK: 0,
        status: 400,
        message: `No existe el usuario con esta ID: ${idUser}`,
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

exports.getUsers = async (req, res) => {
  try {
    const result = await User.find({}, { _id: 0, password: 0 });
    if (result) {
      if (result) {
        res.status(200).send({
          OK: 1,
          status: 200,
          message: 'todos los usuarios obtenidos',
          user: result,
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

exports.updateUser = async (req, res) => {
  let newUser = {};
  const idUser = req.params.id;
  const { userName, password } = req.body;
  if (userName && password) {
    newUser = {
      userName,
      password: md5(password),
    };
  } else if (userName) {
    newUser = {
      userName,
    };
  } else if (password) {
    newUser = {
      password: md5(password),
    };
  }

  const options = {
    new: true,
  };

  try {
    const result = await User.findOneAndUpdate({ idUser }, newUser, options);
    console.log('RESULT', result);
    if (result) {
      res.status(200).send({
        OK: 1,
        status: 200,
        message: `usuario ${idUser} actualizado`,
        user: result,
      });
    } else {
      res.status(400).send({
        OK: 0,
        status: 400,
        message: `No existe el usuario con esta ID: ${idUser}`,
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

exports.deleteUser = async (req, res) => {
  const idUser = req.params.id;
  try {
    const result = await User.findOneAndRemove({ idUser }).select({
      _id: 0,
      password: 0,
    });
    console.log('RESULT', result);
    if (result) {
      res.status(200).send({
        OK: 1,
        status: 200,
        message: `usuario ${idUser} eliminado`,
        user: result,
      });
    } else {
      res.status(400).send({
        OK: 0,
        status: 400,
        message: `No existe el usuario con esta ID: ${idUser}`,
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
  const { user } = req.body;
  const { password } = req.body;

  const response = await User.findOne({ user, password: md5(password) });

  if (response) {
    const payload = { user };
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

  const { user } = jwt.decode(token);

  const response = await User.findOne({ user });

  if (response) {
    const { secretKey } = response;

    try {
      jwt.verify(token, secretKey);
      try {
        const newSecret = nanoid();
        await User.updateOne({ user }, { secretKey: newSecret });
        res.send({
          OK: 1,
          message: 'User Disconnected',
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
exports.authUser = async (req, res, next) => {
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
      const { user } = payload;

      const response = await User.findOne({ user });

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
          message: 'User unknown / invalid Token',
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

exports.importUsers = (users) => {
  try {
    User.insertMany(users);
    users.map(async (user) => {
      user.idUser = nanoid();
      user.secretKey = nanoid();
      const newUser = new User(user);
      const result = await newUser.save();
      if (result) {
        console.log(
          `Usuario ${result.userName} importado. Contraseña predeterminada Aa#00000`,
        );
      }
    });
  } catch (error) {
    console.log(`Error al importar los datos de usuario: ${error}`);
  }
};
