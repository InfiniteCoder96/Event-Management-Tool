const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const cors = require('cors');

// boady parser middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));

// enable cors
app.use(cors());


const messagesRouter = require('./messages');
const api = require('./index');



app.use('/api/v1/',api);

// just export the app instead of starting up the server
module.exports = app;