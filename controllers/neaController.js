const { nanoid } = require('nanoid');
const Nea = require('../models/Nea');
// añadimos la libreria de keplerjs
const {body2latlong} = require("keplerjs");


exports.addNea = async (req, res) => {
  const idNea = nanoid();

  // eslint-disable-next-line object-curly-newline
  const { a, i, e, om, w, ma } = req.body;

  // llamamos a la función de keplerjs para calcular la lat y long
  const position = body2latlong(req.body);
  //console.log(position);
  // guardamos las variables
  const latitude = position.lat;
  const longitude = position.long;

  const fullName = req.body['full_name'];
  const newNea = new Nea({
    idNea,
    'full_name': fullName,
    a,
    e,
    i,
    om,
    w,
    ma,
    'latitude': latitude,
    'longitude': longitude
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
  console.log(neaList);
  const newNeaList = [];
  //Recorremos la lista y generamos una nueva lista con los nuevos datos de los neas
  for (const nea of neaList){
    //console.log(nea);
    // para metros de cada nea
    const { a, i, e, om, w, ma } = nea;
    // calculamos la posición de cada nea
    const position = body2latlong(nea);
    // guardamos las variables
    const latitude = position.lat;
    const longitude = position.long;
    const fullName = nea['full_name'];
    const auxNea = new Nea({
      'full_name': fullName,
      a,
      e,
      i,
      om,
      w,
      ma,
      'latitude': latitude,
      'longitude': longitude
    });

    //console.log(auxNea);
    //añadimos cada nea en la nueva lista de neas
    newNeaList.push(auxNea);

  }
  //console.log(newNeaList);

  if (!Array.isArray(newNeaList)) {
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

    const neas = newNeaList.map((nea) => {
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
  const { a, e, i, om, w, ma} = req.body;
  const fullName = req.body['full-name'];

  const newDataNea = {};

  if (fullName) newDataNea.full_name = fullName;
  if (a) newDataNea.a = a;
  if (e) newDataNea.e = e;
  if (i) newDataNea.i = i;
  if (om) newDataNea.om = om;
  if (w) newDataNea.w = w;
  if (ma) newDataNea.ma = ma;

  const options = {
    new: true,
  };

  //console.log(newDataNea);

  const nea = await Nea.findOne({ idNea }, { _id: 0 });
  //console.log(nea);
  //variable que nos dira si calculamos o no
  let calcular = false;
  //si son iguales los datos no recalculamos
  if (nea.a != newDataNea.a)
  {
    calcular = true;
  }else if(nea.e != newDataNea.e)
  {
    calcular = true;
  }else if(nea.i != newDataNea.i)
  {
    calcular = true;
  }else if(nea.om != newDataNea.om)
  {
    calcular = true;
  }else if(nea.w != newDataNea.w)
  {
    calcular = true;
  }else if(nea.ma != newDataNea.ma)
  {
    calcular = true;
  }else{
    //console.log('No recalculamos');
  }
  
  if(calcular == true)
  { 
    // si algún dato ha cambiado recalculamos
    //console.log('Recalculamos long y lat');
    // llamamos a la función de keplerjs para calcular la lat y long
    const position = body2latlong(req.body);
    //console.log(position);
    // guardamos las variables
    const latitude = position.lat;
    const longitude = position.long;
    const newNea = new Nea({
      'idNea': idNea,
      'full_name': newDataNea.full_name,
      'a': newDataNea.a,
      'e': newDataNea.e,
      'i': newDataNea.i,
      'om': newDataNea.om,
      'w': newDataNea.w,
      'ma': newDataNea.ma,
      'latitude': latitude,
      'longitude': longitude
    });
    //aquí puedes ver el nuevo objeto
    console.log(newNea);

    try { 
      const result = await Nea.findOneAndUpdate({idNea}, newNea, options);
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
