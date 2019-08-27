const express = require('express');
const Joi = require('joi');
const db = require('../database');

const messages = db.get('messages');

const schema = Joi.object().keys({
    name: Joi.string().regex(/^[a-zA-Z0-9 ]{3,30}$/).required(),
    message: Joi.string().min(10).max(30).required(),
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required()
});

const router = express.Router();

router.get('/', (req, res) => {
  try{

    messages
    .find()
    .then(allMessages => {
      res.json(allMessages);
    });
  }
  catch(error){
     console.error(error);
  }
  
});

router.post('/', (req, res, next) => {
  
  const result = Joi.validate(req.body, schema);

  if(result.error === null){
    // add current date time
    // insert into DB
    const { name, message, latitude, longitude } = req.body;

    const userMessage = {
      name,
      message,
      latitude,
      longitude,
      date: new Date()
    };

    messages
    .insert(userMessage)
    .then(insertedMessage => {
      res.json(insertedMessage);
    });
  }
  else{
    next(result.error);
  }
  
});

module.exports = router;
