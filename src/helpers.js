import fs from 'fs';
import multer from 'multer';
import MasterAdult from './models/MasterAdult';
import MasterDesc from './models/MasterDescription';
import MasterKid from './models/MasterKid';
import CourceMain from './models/CourseMain';
import Client from './models/Client';
import ServiceOrder from './models/ServiceOrders';
import ClientBase from './models/ClientBase';

const jwt = require('jsonwebtoken');

module.exports.checkTimeData = function(time, responce) {
  for (let i = 0; i < time.length; i++) {
    if (!time[i].day || !time[i].hours) {
      responce.send('Пожалуйста, введите полную дату');
      break;
    }
  }
};

module.exports.unbindImages = async function(deletedMaster) {
  console.log('deletedMaster1', deletedMaster);
  if (deletedMaster.icon) {
    fs.unlink(`public${deletedMaster.icon}`, err => {
      if (err) console.log(err);
    });
  }
  if (deletedMaster.desc) {
    deletedMaster.desc.forEach(picture => {
      fs.unlink(`public${picture.image}`, err => {
        if (err) console.log(err);
      });
    });
  }
  return deletedMaster;
};

module.exports.deleteClientsFromCource = async function(deletedMaster) {
  console.log('deletedMaster2', deletedMaster);
  const clientsId = deletedMaster.client;
  console.log(clientsId.length);
  if (clientsId.length) {
    await clientsId.forEach(clientId => {
      console.log(clientId);
      Client.findByIdAndRemove(clientId, (err, removedClient) => {
        console.log(removedClient);
      });
    });
  }
  return deletedMaster;
};

module.exports.authJWT = async function(req, res, next) {
  if (!req.cookies.jwt) {
    res.status(401).send('Не задано jwt токен');
    return;
  }
  await jwt.verify(req.cookies.jwt, 'top_secret', (err, decoded) => {
    if (!decoded) res.status(500).send('Не вірний токен');
  });
  next();
};

// masterAdult helper functions:

// Ця надскладна функція дозволяє завантажувати на сервер більше 1 картинки за раз
module.exports.LoadManyImages = async function(images, descs, masterId) {
  for (const keyImg in images) {
    const ImgIndex = keyImg.split('img')[1];
    for (const keyDesc in descs) {
      const DescIndex = keyDesc.split('imgDesc')[1];
      if (ImgIndex && ImgIndex == DescIndex) {
        const image = images[keyImg][0].path.split('public')[1];
        const imgDesc = descs[keyDesc];

        const masterDesc = await new MasterDesc({ imgDesc, image });

        await MasterAdult.findByIdAndUpdate(
          masterId,
          { $push: { desc: masterDesc } },
          { new: true },
        );
      }
      continue;
    }
  }
};

// End of masterAdult helper functions

// Client helpers
module.exports.checkIfCourceExist = async function(courseType, courseId) {
  let data;
  switch (courseType) {
    case 'Course':
      await CourceMain.findById(courseId).then(
        course => {
          data = course;
        },
        error => {
          data = null;
        },
      );
      break;
    case 'MasterAdult':
      await MasterAdult.findById(courseId).then(
        course => {
          data = course;
        },
        error => {
          data = null;
        },
      );
      break;
    case 'MasterKid':
      await MasterKid.findById(courseId).then(
        course => {
          data = course;
        },
        error => {
          data = null;
        },
      );
      break;
    default:
      data = null;
  }
  return data;
};

// Створення екземпляра замовлення
module.exports.createNewOrder = async function(reqData, clientId) {
  let newOrder = await new ServiceOrder({
    clientId,
    name: reqData.name,
    email: reqData.email,
    phone: reqData.phone,
    adress: reqData.adress,
    courseType: reqData.courseType,
    courseId: reqData.courseId,
    serviceName: reqData.serviceName,
    serviceId: reqData.serviceId,
    price: reqData.price,
    description: reqData.description,
  });
  if (newOrder) {
    await newOrder.save();
    return newOrder;
  } else {
    return false;
  }
};

//Додаємо контактні дані клієнта в базу для подальшого використання
module.exports.addClientToBase = async function(email, name, phone) {
  await ClientBase.findOne({ email })
    .then(foundedClient => {
      console.log('foundedClient', foundedClient);
      if (!foundedClient) {
        const newClientSave = new ClientBase({
          name,
          email,
          phone,
        });
        console.log('New client saved', newClientSave);
        newClientSave.save();
      } else {
        console.log('Oops...sims this user has already been registered');
      }
    })
    .catch(e => console.log('somth err', e));
};

// Записуємо айді клієнта у відповідний курс
module.exports.connectClientToCourse = async function(CourseModel, clientId, dataObj) {
  let courseName = null;
  const { courseType, courseId, time, price, picId } = dataObj;
  await CourseModel.findByIdAndUpdate(courseId, { $push: { client: clientId } }).then(
    foundedCource => {
      courseName = foundedCource.name;
      console.log('foundedCource', foundedCource);
    },
  );
  await Client.findByIdAndUpdate(clientId, {
    $push: { course: { courseType, courseName, courseId, time, price, picId } },
  });
};

//Добавляем услугу в модель клиента
module.exports.addServiceToClient = async function(clientId, dataObj){
  console.log('ELSE HERE!!!');
  let date = `${new Date().getDate()}.${new Date().getMonth()}.${new Date().getFullYear()}`;
  await Client.findByIdAndUpdate(clientId, {
    $push: {
      service: {
        serviceName: dataObj.serviceName,
        serviceId: dataObj.serviceId,
        price: dataObj.price,
        description: dataObj.description,
        adress: dataObj.adress,
        status: 'в обробці',
        time: date,
      },
    },
  });
}

// End of client helpers

// В цій функції в якості третього параметру ми передаєм саму модель
//mongoDB і витягаємо дані безпосередньо з неї
module.exports.prepareIcon = async function(masterId, iconFile, model) {
  const icon = iconFile[0].path.split('public')[1];
  const Cource = await model.findById(masterId);
  fs.unlink(`public${Cource.icon}`, err => {
    if (err) console.log(err);
  });
  return icon;
};

module.exports.updateClientData = async function updateClientData(client){
  console.log('foundedClient', client);
  console.log('ClientData', updateClientData.data);
  //Ми передали дані в перемінній data як властивість об'єкта updateClientData
  const{name, email, phone, adress, status} = updateClientData.data
  client.name = name;
  client.email = email;
  client.phone = phone;
  if (client.service.length !== 0) {
    client.service[0].adress = adress;
    console.log('here1', client.service[0]);
    client.service[0].status = status;
    console.log('here2', client.service[0].status);
  }
  await client.save();
  console.log('here3', client);
  return client;
}
//module.exports.updateClientData;

// Реалізація мультера (для завантаження картинок у сховище)

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/enrollment');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
  },
});

module.exports.upload = multer({ storage }).fields([
  { name: 'icon', maxCount: 1 },
  { name: 'img', maxCount: 8 },
]);

// Закінчення реалізації мультера
