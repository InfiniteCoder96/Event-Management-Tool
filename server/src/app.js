const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
var cors = require('cors');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(express.json()); 
app.use(cors());

require('dotenv').config();

const middlewares = require('./middlewares');
const api = require('./api');

app.get('/', function(req,res){
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄'
  });
});

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
