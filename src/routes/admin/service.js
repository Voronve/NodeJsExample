import express from 'express';
import multer from 'multer';
import {
  addService,
  getServiceList,
  getService,
  editService,
  deleteService,
} from '../../controllers/serviceController';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/enrollment');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage }).fields([{ name: 'icon', maxCount: 1 }]);

router.route('/').get(getServiceList);

router
  .route('/single')
  .post(upload, addService)
  .get(getService)
  .put(upload, editService)
  .delete(deleteService);

export default router;
