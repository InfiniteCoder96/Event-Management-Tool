const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

app.use(morgan('dev'));
app.use(helmet());
app.use(express.json()); 
app.use(cors());


require('dotenv').config();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://guestmap.inofinitylabs.com/");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


const middlewares = require('./middlewares');
const api = require('./api');

const app = express();




app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄'
  });
});

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
