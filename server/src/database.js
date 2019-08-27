const monk = require('monk');

require('dotenv').config();
const db = monk(process.env.DATABASE_URL);

module.exports = db;