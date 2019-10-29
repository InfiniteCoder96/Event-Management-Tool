const mongoose = require('mongoose');

// Map global mongoose 
mongoose.Promise = global.Promise;

// Mongoose connect
mongoose.connect('mongodb+srv://pasindu:KBtkrOC6uM2hFCI0@cluster0-bgpuf.mongodb.net/guestmap?retryWrites=true&w=majority')
.then(() => console.log('MongoDb Connected'))
.catch(err => console.log(err));