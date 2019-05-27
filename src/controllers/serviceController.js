import fs from 'fs';
import Service from '../models/Service';
import { prepareIcon } from '../helpers';

exports.getServiceList = async (req, res) => {
  await Service.find().then(servList => {
    if (servList.length) {
      res.status(200).send(servList);
    } else {
      res.status(400).send('Сервісів не знайдено');
    }
  });
};

exports.addService = async (req, res) => {
  console.log(req.body);
  console.log('іконка', req.files);
  let iconFile = req.files.icon;
  let {name, description, price} = req.body;
  if (!name || !iconFile) {
    res.status(400).send('Будь ласка, введіть всі дані');
    return;
  }
  const icon = req.files.icon[0].path.split('public')[1];
  if(price){ price = price.split(' ').join('').split(','); }
  const service = new Service({name, icon, description, price});
  service.save();
  res.status(200).send(service);
};

exports.getService = async (req, res) => {
  const id = req.query.id;

  await Service.findById(id).then(foundServ => {
    if (!foundServ) {
      res.status(400).send('Такого сервісу не існує');
      return;
    } else {
      res.status(200).send(foundServ);
    }
  });
};

exports.editService = async (req, res) => {
  const id = req.query.id;
  let { name, description, price } = req.body;
  
  let icon = null;
  if(req.body.icon){
    icon = req.body.icon;
  }else if(req.files.icon){
    icon = await prepareIcon(id, req.files.icon, Service);
  }else{
    res.status(400).send('Відсутнє зображення іконки');
    return;
  }
  if(!name || !icon){
    res.status(400).send('Будь ласка, введіть всі дані');
    return;
  }
  if(price){price = price.split(' ').join('').split(',');}
  await Service.findByIdAndUpdate(id, { $set: { name, description, icon, price } }, {new: true})
  .then(updatedServ => {
    res.status(200).send(updatedServ);
    return;
  })
  .catch(err => {
    console.log(err);
    res.send(new Error('Вибачте, виникла непередбачувана ситуація'));
    return;
  });
};

exports.deleteService = async (req, res) => {
  const id = req.query.id;
  await Service.findByIdAndDelete(id)
    .then(deletedServ => {
      res.status(200).send(deletedServ);
      return;
    })
    .catch(err => {
      console.log(err);
      res.send(new Error('Вибачте, виникла непередбачувана ситуація'));
      return;
    });
};
