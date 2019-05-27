/* eslint-disable import/named */
import multer from 'multer';
import express from 'express';
import { login, logout } from '../controllers/adminController';

const router = express.Router();
const upload = multer();

// router.route('/register').post(upload.none(), register);

router.route('/login').put(login);

router.route('/logout').put(logout);

module.exports = router;
