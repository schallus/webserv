'use strict';

// ----- LOAD ENV VARIABLES -----

require('dotenv').config();

// ----- REQUIREMENTS -----

// vendor
const express = require('express');
// const path = require('path');
const helmet = require('helmet'); // Helps you secure your Express apps
// by setting various HTTP headers
const cors = require('cors'); // Enable All CORS Requests

// custom
const db = require('./modules/database');
const apiRouter = require('./routes/api');

const app = express();

// ----- MIDDLEWARE -----

// app.use(express.static(path.join(__dirname, 'public'))); // Public folder
app.use(cors());
app.use(helmet());

// ----- MIDDLEWARES -----


// ----- ROUTES -----

app.use('/web-api/v1', apiRouter);

app.all('*', (req, res) => {
    res.status(200).send('Hello World!');
});

// ----- ENTRY POINT -----

db.connect().then(() => {
    console.log('Database connection established');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT);
    console.log('Application listening');
}, (err) => {
    console.log('Database connection failed: ' + err);
});