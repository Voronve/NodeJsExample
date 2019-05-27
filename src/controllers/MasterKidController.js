import fs from 'fs';
import MasterKid from '../models/MasterKid';
import Client from '../models/Client';
import { prepareIcon, unbindImages, deleteClientsFromCource } from '../helpers';

exports.getMasterList = async (req, res) => {
  try {
    const data = await MasterKid.find();
    res.status(200).send(data);
  } catch (err) {
    res.sendStatus(500);
  }
};

exports.addMaster = async (req, res) => {
  try {
    const {
      name, description, price, duration,
    } = req.body;
    const iconFile = req.files.icon;
    console.log(req.files.icon);
    if (!name || !duration || !price || !iconFile) {
      res.status(400).send('Будь ласка, введіть всі дані');
      return;
    }
    const icon = req.files.icon[0].path.split('public')[1];
    const course = new MasterKid({
      name,
      description,
      price,
      icon,
      duration,
    });
    course.save();
    res.status(200).send(course);
  } catch (err) {
    res.sendStatus(500);
  }
};

exports.getMaster = async (req, res) => {
  const { id } = req.query;
  try {
    const course = await MasterKid.findById(id);
    res.status(200).send(course);
  } catch (err) {
    if (err.name == 'CastError') {
      res.send('Майстерклассів не знайдено');
    } else {
      res.sendStatus(500);
    }
  }
};

exports.editMaster = async (req, res) => {
  try {
    const { id } = req.query;
    let {
      name, description, price, icon, duration,
    } = req.body;

    if (!name || !duration || !price) {
      res.status(400).send('Будь ласка введіть всі данні');
      return;
    }

    // Буває чомусь іконка дорівнює null тому потрібна ця перевірка
    if (!req.files.icon && !icon) {
      res.status(400).send('Відсутній файл іконки');
      return;
    }
    if (req.files.icon) {
      icon = await prepareIcon(id, req.files.icon, MasterKid);
    }
    await MasterKid.findByIdAndUpdate(id, {
      $set: {
        name, description, price, icon, duration,
      },
    });
    const master = await MasterKid.findById(id);
    res.status(200).send(master);
  } catch (err) {
    res.sendStatus(500);
  }
};

exports.deleteMaster = async (req, res) => {
  try {
    const { id } = req.query;
    await MasterKid.findByIdAndDelete(id)
      .then(unbindImages)
      .then(deleteClientsFromCource)
      .then((deletedMaster) => {
        res.status(200).send(deletedMaster);
      });
  } catch (err) {
    res.sendStatus(500);
  }
};
