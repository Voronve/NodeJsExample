/* eslint-disable */
import express from 'express';
import multer from 'multer';
import { authJWT } from '../../helpers';

import {
  addMaster,
  getMasterList,
  getMaster,
  editMaster,
  deleteMaster,
  deleteImage,
} from '../../controllers/MasterAdultController';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/enrollment');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage }).fields([
  { name: 'icon', maxCount: 1 },
  { name: 'img1', maxCount: 1 },
  { name: 'img2', maxCount: 1 },
  { name: 'img3', maxCount: 1 },
  { name: 'img4', maxCount: 1 },
  { name: 'img5', maxCount: 1 },
  { name: 'img6', maxCount: 1 },
  { name: 'img7', maxCount: 1 },
  { name: 'img8', maxCount: 1 },
]);
//const upload = multer({ storage }).any();

router.route('/').get(getMasterList);

router
  .route('/single')
  .post(upload, addMaster)
  .get(getMaster)
  .put(upload, editMaster)
  .delete(deleteMaster);

router.route('/image').delete(deleteImage);

export default router;
