/* eslint-disable import/named */
import express from 'express';
import multer from 'multer';
import {
  addClient,
  getClientList,
  getClient,
  deleteClient,
  editClient,
} from '../../controllers/clientController';

import { authJWT } from '../../helpers';

const upload = multer();
// from '../../controllers/adminController';

const router = express.Router();

router
  .route('/')
  .get(getClientList)
  .post(upload.none(), addClient);

router
  .route('/:id')
  .put(upload.none(), editClient)
  .get(getClient)
  .delete(deleteClient);

export default router;
