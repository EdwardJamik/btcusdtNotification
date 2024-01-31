const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const Route = require('./route/route');


const app = express();

//middlewares
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(cors({
    origin: true,
    credentials: true,
}));

app.use('/api/v1/', Route);
app.use('*', (req, res) => res.status(404).json({ error: 'not found' }));

module.exports = app;
