import fs from 'fs';
import MasterAdult from '../models/MasterAdult';
import MasterDesc from '../models/MasterDescription';
import Client from '../models/Client';
import {
  LoadManyImages,
  prepareIcon,
  unbindImages,
  deleteClientsFromCource,
} from '../helpers';

exports.getMasterList = async (req, res) => {
  try {
    const data = await MasterAdult.find();
    res.status(200).send(data);
  } catch (err) {
    res.sendStatus(500);
  }
};

exports.addMaster = async (req, res) => {
  console.log('req.body', req.body);
  try {
    const { name, imgDesc1, info } = req.body;
    const iconFile = req.files.icon;
    const imageFile = req.files.img1;
    console.log('icon', iconFile);
    console.log('image', imageFile);
    if (!name || !imgDesc1 || !info || !iconFile || !imageFile) {
      res.send('Будь ласка, введіть всі дані');
      return;
    }

    const iconLink = iconFile[0].path.split('public')[1];

    const masterClass = await new MasterAdult({ name, info, icon: iconLink });
    await masterClass.save();
    await LoadManyImages(req.files, req.body, masterClass._id);

    res.status(200).send(await MasterAdult.findById(masterClass._id));
  } catch (err) {
    res.sendStatus(500);
  }
};

exports.getMaster = async (req, res) => {
  const { id } = req.query;
  try {
    const course = await MasterAdult.findById(id);
    res.status(200).send(course);
  } catch (err) {
    if (err.name == 'CastError') {
      res.status(200).send('Майстерклассів не знайдено');
    } else {
      res.sendStatus(500);
    }
  }
};

exports.editMaster = async (req, res) => {
  try {
    const { id } = req.query;
    let { name, info, icon } = req.body;
    if (!name || !info) {
      res.status(400).send('Будь ласка введіть всі данні');
      return;
    }
    // Буває чомусь іконка дорівнює null тому потрібна ця перевірка
    if (!req.files.icon && !icon) {
      res.status(400).send('Відсутній файл іконки');
      return;
    }
    if (req.files.icon) {
      icon = await prepareIcon(id, req.files.icon, MasterAdult);
    }
    await MasterAdult.findByIdAndUpdate(id, {
      $set: { name, info, icon },
    });
    await LoadManyImages(req.files, req.body, id);
    res.status(200).send(await MasterAdult.findOne({ _id: id }));
  } catch (err) {
    res.sendStatus(500);
  }
};

exports.deleteMaster = async (req, res) => {
  try {
    const { id } = req.query;
    await MasterAdult.findByIdAndDelete(id)
      .then(unbindImages)
      .then(deleteClientsFromCource)
      .then((deletedMaster) => {
        res.status(200).send(deletedMaster);
      });
  } catch (err) {
    res.sendStatus(500);
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { masterId, pictureId } = req.query;
    await MasterAdult.findById(masterId, (err, masterclass) => {
      masterclass.desc.forEach((picture) => {
        if (picture._id == pictureId) {
          fs.unlink(`public${picture.image}`, (err) => {
            if (err) console.log(err);
          });
        }
      });
      masterclass.desc.forEach((elem) => {
        if (elem._id == pictureId) {
          masterclass.desc.splice(masterclass.desc.indexOf(elem), 1);
        }
      });
      masterclass.save();
      res.status(200).send(masterclass);
    });
  } catch (err) {
    res.sendStatus(500);
  }
};
