const { nanoid } = require('nanoid');
const Nea = require('../models/Nea');

exports.addNea = async (req, res) => {
  const idNea = nanoid();

  // eslint-disable-next-line object-curly-newline
  const { a, i, e, om, w, ma } = req.body;

  const fullName = req.body['full-name'];
  const newNea = new Nea({
    idNea,
    'full-name': fullName,
    a,
    e,
    i,
    om,
    w,
    ma,
  });
  try {
    const result = await newNea.save();
    res.status(200).send({
      OK: 1,
      message: 'Nea añadida',
      idNea: result.idNea,
    });
  } catch (error) {
    res.status(400).send({
      Ok: 0,
      status: 400,
      message: `ERROR, Nea NO añadida:, ${error}`,
    });
  }
};

exports.addNeas = async (req, res) => {
  const neaList = req.body;
  if (!Array.isArray(neaList)) {
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

    const neas = neaList.map((nea) => {
      // eslint-disable-next-line no-param-reassign
      nea.idNea = nanoid();
      return nea;
    });
    try {
      const dbResult = await Nea.insertMany(neas, options);
      res.status(200).send({
        Ok: 1,
        status: 200,
        message: 'Se insertaron TODOS los documentos',
        neasCreated: dbResult,
      });

      console.log('RESULT', dbResult);
    } catch (error) {
      res.status(400).send({
        Ok: 0,
        status: 400,
        message: 'ERROR, algunos documentos no se insertaron',
        neasCreated: error.insertedDocs,
      });
    }
  }
};
exports.getNeas = async (req, res) => {
  try {
    const result = await Nea.find({}, { _id: 0 });
    if (result) {
      if (result) {
        res.status(200).send({
          OK: 1,
          status: 200,
          message: 'todos los Neas obtenidos',
          nea: result,
        });
      } else {
        res.status(400).send({
          OK: 0,
          status: 400,
          message: 'No hay Neas en la base de datos',
        });
      }
    }
  } catch (error) {
    res.status(500).send({
      Ok: 0,
      status: 500,
      message: `ERROR, no se han podido obtener Neas: ${error}`,
    });
  }
};
exports.getNea = async (req, res) => {
  const idNea = req.params.id;
  try {
    const result = await Nea.findOne({ idNea }, { _id: 0 });
    if (result) {
      res.status(200).send({
        OK: 1,
        status: 200,
        message: `Nea ${idNea} obtenido`,
        nea: result,
      });
    } else {
      res.status(400).send({
        OK: 0,
        status: 400,
        message: `No existe el Nea con esta ID: ${idNea}`,
      });
    }
  } catch (error) {
    res.status(500).send({
      Ok: 0,
      status: 500,
      message: `ERROR, no se ha podido obtener Nea: ${error}`,
    });
  }
};
exports.updateNea = async (req, res) => {
  const idNea = req.params.id;
  // eslint-disable-next-line object-curly-newline
  const { a, b, e, i, om, w, ma } = req.body;
  const fullName = req.body['full-name'];

  const newNea = {};

  if (fullName) newNea.full_name = fullName;
  if (a) newNea.a = a;
  if (b) newNea.b = b;
  if (e) newNea.e = e;
  if (i) newNea.i = i;
  if (om) newNea.om = om;
  if (w) newNea.w = w;
  if (ma) newNea.ma = ma;

  const options = {
    new: true,
  };

  try {
    const result = await Nea.findOneAndUpdate({ idNea }, newNea, options);
    if (result) {
      res.status(200).send({
        OK: 1,
        status: 200,
        message: `Nea ${idNea} actualizada`,
        nea: result,
      });
    } else {
      res.status(400).send({
        OK: 0,
        status: 400,
        message: `No existe el Nea con esta ID: ${idNea}`,
      });
    }
  } catch (error) {
    res.status(500).send({
      Ok: 0,
      status: 500,
      message: `ERROR, no se ha podido obtener Nea: ${error}`,
    });
  }
};
exports.deleteNea = async (req, res) => {
  const idNea = req.params.id;
  try {
    const result = await Nea.findOneAndRemove({ idNea }).select({
      _id: 0,
    });
    if (result) {
      res.status(200).send({
        OK: 1,
        status: 200,
        message: `Nea ${idNea} eliminado`,
        nea: result,
      });
    } else {
      res.status(400).send({
        OK: 0,
        status: 400,
        message: `No existe el nea con esta ID: ${idNea}`,
      });
    }
  } catch (error) {
    res.status(500).send({
      Ok: 0,
      status: 500,
      message: `ERROR, no se ha podido encontrar Nea: ${error}`,
    });
  }
};

exports.jsonArr2DB = async (jsonObj) => {
  const neas = jsonObj.map((nea) => {
    nea.idNea = nanoid();
    return nea;
  });
  try {
    await Nea.insertMany(neas);
  } catch (error) {
    console.log(`Error en importación CSV: ${error}`);
  }
};
