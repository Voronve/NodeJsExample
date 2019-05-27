import fs from 'fs';
import Client from '../models/Client';
import CourseMain from '../models/CourseMain.js';
import MasterAdult from '../models/MasterAdult';
import MasterKid from '../models/MasterKid';
import ClientBase from '../models/ClientBase';
import Service from '../models/Service';
import ServiceOrder from '../models/ServiceOrders';

import {
  checkIfCourceExist,
  createNewOrder,
  addClientToBase,
  connectClientToCourse,
  addServiceToClient,
  updateClientData
} from '../helpers';

exports.addClient = async (req, res) => {
  //Отримуємо необхідні дані
  try {
    const {
      name,
      email,
      phone,
      adress,
      courseType,
      courseId,
      picId,
      serviceName,
      serviceId,
      price,
      time,
      description,
    } = req.body;
    if (!name || !email || !phone) {
      res.status(400).send('Будь ласка, введіть всі дані');
      return;
    }
    //Перевіряємо, чи існує послуга
    if (courseType) {
      if (!(await checkIfCourceExist(courseType, courseId))) {
        res.status(400).send('Невірно введено тип або id курсу');
        return;
      }
    }
    //Створюємо нового клієнта
    const newClient = await new Client({
      name,
      email,
      phone,
    });
    if(!newClient){
      res.status(500).send(`Чомусь не вийшло створити клієнта: ${error}`);
      return;updateClientData
    }
    console.log('newClient', newClient);
    //Створюємо екземпляр замовлення
    if (serviceId) {
      if (!(await createNewOrder(req.body, newClient._id))) {
        res.status(500).send('Помилка при створенні замовлення');
        return;
      }
    }
    await newClient.save();
    //Додаємо контактні дані клієнта в базу для подальшого використання
    await addClientToBase(email, name, phone);
    console.log('Here!');
    //Прив'язуємо клієнта до курсу
    if (courseType) {
      console.log('Here!');
      let dataObj = { courseType, courseId };
      switch (courseType) {
        case 'Course':
          dataObj.time = time;
          dataObj.price = price;
          console.log('dataObj', dataObj);
          await connectClientToCourse(CourseMain, newClient._id, dataObj);
          break;
        case 'MasterAdult':
          dataObj.picId = picId;
          await connectClientToCourse(MasterAdult, newClient._id, dataObj);
          break;
        case 'MasterKid':
          await connectClientToCourse(MasterKid, newClient._id, dataObj);
          break;
      }
    } else {
      let dataObj = { serviceName, serviceId, price, description, adress};
      await addServiceToClient(newClient._id, dataObj);
    }
    const finalResponse = await Client.findById(newClient._id);
    console.log('---newClient!!!', finalResponse);
    res.status(200).send(finalResponse);
  } catch (err) {
    res.sendStatus(500);
  }
};

exports.getClientList = async (req, res) => {
  console.log('req.query', req.query);
  try {
    if (!req.query.courseType && !req.query.service) {
      const clients = await Client.find();
      res.status(200).send(clients);
    } else if (req.query.courseType) {
      const courseType = req.query.courseType;
      const clients = await Client.find({ 'course.0.courseType': courseType });
      res.status(200).send(clients);
    } else if (req.query.service) {
      await Client.find({ 'service.0.serviceId': { $exists: true } }).then(foundedClients => {
        res.status(200).send(foundedClients);
      });
    }
  } catch (err) {
    res.sendStatus(500);
  }
};

exports.getClient = async (req, res) => {
  const { id } = req.params;
  try {
    const client = await Client.findById(id);
    res.status(200).send(client);
  } catch (err) {
    res.sendStatus(500);
  }
};

exports.deleteClient = async (req, res) => {
  const { id } = req.params;
  const client = await Client.findById(id);
  console.log('client', client);
  try {
    if (client.course.length) {
      const course = client.course[0];
      const { courseType, courseId } = course;
      if (courseType == 'Course') {
        await CourseMain.findByIdAndUpdate(courseId, { $pull: { client: client._id } });
        await Client.findByIdAndRemove({ _id: id });
        res.status(200).send(await CourseMain.findById(courseId));
      }
      if (courseType == 'MasterAdult') {
        await MasterAdult.findByIdAndUpdate(courseId, { $pull: { client: client._id } });
        await Client.findByIdAndRemove({ _id: id });
        res.status(200).send(await MasterAdult.findById(courseId));
      }
      if (courseType == 'MasterKid') {
        await MasterKid.findByIdAndUpdate(courseId, { $pull: { client: client._id } });
        await Client.findByIdAndRemove({ _id: id });
        res.status(200).send(await MasterKid.findById(courseId));
      }
    } else {
      await ServiceOrder.findOneAndRemove({ clientId: id });
      await Client.findByIdAndRemove(id).then(removedClient => {
        res.status(200).send(removedClient);
      });
    }
  } catch (err) {
    res.sendStatus(500);
  }
};

exports.editClient = async (req, res) => {
  const { id } = req.params;
  console.log('id', id);
  //const { name, email, phone, adress, status } = req.body;
  let data = req.body;
  updateClientData.data = data;
  console.log('updateClientData', updateClientData.data);
  try {
    await Client.findById(id)
    .then(updateClientData)
    .then(foundedClient => {
      if(foundedClient){
        res.status(200).send(foundedClient);
      }
    });
  } catch (err) {
    res.sendStatus(500);
  }
};
