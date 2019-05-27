/* eslint-disable no-underscore-dangle */
import fs from "fs";
import Admin from "../models/Admin";
const jwt = require("jsonwebtoken");

require("dotenv").config({ path: "../variables.env" });

/* admin page */

exports.login = async (req, res, next) => {
  const {login, password} = req.body;
  console.log('req.body', req.body);
  if(!login || !password){
    res.status(400).send('Будь ласка, введіть логін і пароль');
    return;
  }
  const admin = await Admin.findOne({name: login, password});
  console.log('admin', admin);
  if(!admin){
    console.log(login, password);
    res.status(403).send('Логін або пароль введені неправильно');
    return;
  }

  jwt.sign({admin}, "top_secret", (err, token) =>{
    if(err){
      res.send(err);
      return;
    }else{
      res.cookie("jwt", token, { expiresIn: "1h"});
      res.status(200).json(token);
      return; 
    }
  });
}

exports.logout = (req, res) => {
  req.logout();
  res.clearCookie("jwt");
  res.status(200).send('До побачення )');
};


