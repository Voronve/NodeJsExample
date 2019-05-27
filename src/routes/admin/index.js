import express from 'express';
import jwt from 'jsonwebtoken';
import logreg from './logreg';
import client from './client';
import coursesMain from './coursesMain';
import masterKid from './masterKid';
import masterAdult from './masterAdult';
import service from './service';
import serviceOrders from './ServiceOrders';

const app = express();
const router = express.Router();
var multer  = require('multer');
var upload = multer();


//app.use('/logreg', logreg);

app.use('/client', client);

app.use('/coursesMain', coursesMain);

app.use('/masterKid', masterKid);

app.use('/masterAdult', masterAdult);

app.use('/service', service);

app.use('/serviceOrder', serviceOrders);

router.use('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'../../../buildAdmin/index.html'));
  });

export default app;
