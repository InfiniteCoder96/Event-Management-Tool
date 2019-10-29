const express = require('express');
const Joi = require('joi');
const bodyparser = require('body-parser');

require('../database');

const Message = require('../message');

const schema = Joi.object().keys({
    name: Joi.string().regex(/^[a-zA-Z0-9 ]{3,30}$/).required(),
    message: Joi.string().min(10).max(30).required(),
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required()
});

const router = express.Router();

router.get('/', (req, res) => {
  try{

    Message
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
  
    // add current date time
    // insert into DB
    

    const userMessage = {
      name: req.body.name,
      message: req.body.message,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      date: new Date()
    }

  new Message(userMessage).save().then(insertedMessage => {
    res.json(insertedMessage);
  });

});

module.exports = router;
