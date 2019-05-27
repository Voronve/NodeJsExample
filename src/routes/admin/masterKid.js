/* eslint-disable */
import express from 'express';
import multer from 'multer';
import { upload } from '../../helpers';
import {
  addMaster,
  getMasterList,
  getMaster,
  editMaster,
  deleteMaster,
} from '../../controllers/MasterKidController';

const router = express.Router();

/*const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/enrollment');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage }).fields([{ name: 'icon', maxCount: 1 }, { name: 'img', maxCount: 8 }])*/

router.route('/').get(getMasterList);

router
  .route('/single')
  .post(upload, addMaster)
  .get(getMaster)
  .put(upload, editMaster)
  .delete(deleteMaster);

export default router;
