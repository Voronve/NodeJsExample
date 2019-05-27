/* eslint-disable import/named */
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
// import session from 'express-session';
import passport from 'passport';
import cors from 'cors';

import { notfound, handler } from './handlers/errorHandlers';
import { authJWT } from './helpers';
import adminRouter from './routes/admin/index';
import userRouter from './routes/logreg';

const jwt = require('jsonwebtoken');

// const RedisStore = require('connect-redis')(session);
require('./config/database');

const app = express();
// app.use(
//   session({
//     store: new RedisStore(),
//     cookie: { secure: false, maxAge: 86400000 },
//     secret: "keyboard cat",
//     resave: false,

//     saveUninitialized: true
//   })
// );

// view engine setup
// app.set('views', path.join(__dirname, '../views'));
// app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

/* user */
// app.use('', indexRouter);
app.use(express.static('public'));
app.use(express.static(path.join(`${__dirname}../../../build/`)));
app.use(express.static(path.join(`${__dirname}../../../build/static`)));

/* admin */
app.use('/admin', adminRouter);
app.use(userRouter);
app.use(express.static(path.join(`${__dirname}../../../buildAdmin/`)));
app.use(express.static(path.join(`${__dirname}../../../buildAdmin/static`)));

// app.use('*', indexRouter);
app.use(express.static('public'));
app.use(express.static(path.join(`${__dirname}../../../build/`)));
app.use(express.static(path.join(`${__dirname}../../../build/static`)));
/* errors */
app.use(notfound);
app.use(handler);

module.exports = app;
