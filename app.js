'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const { sequelize } = require('./models'); // imports instance of sequelize from models/index.js

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

app.use(express.json()); // parse incoming objects to json

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// sets up dedicated routes 
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);

//test db connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database successful!');
  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }
})();

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
