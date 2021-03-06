
const PORT = process.env.PORT || 5000;
const DATABASE = process.env.MONGODB || 'mongodb://localhost/vehicleBooking';

// ---------------------------------------------------------------------

const mongoose = require('mongoose');
const express = require('express');

// ---------------------------------------------------------------------

const app = express();
app.use( (req, res, next) => {
    let ignore = ['/favicon.ico', '/banana'];
    if (ignore.indexOf(req.path) === -1)
        console.log('@', new Date().toLocaleString(), req.ip, req.method, req.originalUrl);
    next();
});
app.use( (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use('/', express.static('build'));
app.use('/api', require('./routes/api')); // beware! middleware without next()
app.listen(PORT, () => {
    console.log('*** Server listening on %d @ %s', PORT, new Date().toLocaleString());
});

// ---------------------------------------------------------------------

mongoose.connect(DATABASE, {useMongoClient: true}, (err) => {
    if (err) console.log('*** Error connecting to server: %s', err) || process.exit(); //hacky
    else console.log('*** Server connected to database: %s', mongoose.connection.name);
});

// ---------------------------------------------------------------------
