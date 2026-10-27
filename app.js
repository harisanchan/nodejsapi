// Entry point. cPanel's "Setup Node.js App" (Phusion Passenger) loads this
// file as the "Application startup file" and supplies process.env.PORT.
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const apiRoutes = require('./src/routes');
const { notFound, errorHandler } = require('./src/middleware/errors');

const app = express();

// Path the app is mounted on, e.g. "/api" if the cPanel Application URL is
// yourdomain.com/api. Leave empty when the app is served from the domain root.
const BASE_PATH = (process.env.BASE_PATH || '').replace(/\/+$/, '');

app.set('trust proxy', true);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(`${BASE_PATH}/`, (req, res) => {
  res.json({
    name: 'nodejsapi',
    status: 'running',
    environment: process.env.NODE_ENV || 'development',
  });
});

app.use(`${BASE_PATH}/v1`, apiRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
