const express = require('express');
const messagesRouter = require('./messages');
const api = require('./index');

const app = express();

app.use('/api/v1/',api);

// just export the app instead of starting up the server
module.exports = app;