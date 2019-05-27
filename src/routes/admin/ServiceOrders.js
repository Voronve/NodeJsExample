import express from 'express';
import multer from 'multer';
import { getOrderList } from '../../controllers/serviceOrderController';

const upload = multer();
const router = express.Router();

router.route('/').get(getOrderList);

/* router
  .route('/single')
  .post(upload, addService)
  .get(getService)
  .put(upload, editService)
  .delete(deleteService); */

export default router;
