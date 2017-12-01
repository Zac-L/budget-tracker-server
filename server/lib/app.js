const express = require('express');
const app = express();
const errorHandler = require('./error-handler')();
const morgan = require('morgan');
const redirectHttp = require('./redirect-http')();
const cors = require('cors')();
const checkDb = require('./check-connection')();

// ### Middleware ###
app.use(express.json());
app.use(morgan('dev'));
app.use(cors);
app.use(express.static('./public'));


// ### Redirect http to https in production ###
if(process.env.NODE_ENV === 'production') {
    app.use(redirectHttp);
}

// ### Required Routes ###
const category = require('./routes/categories');
const expense = require('./routes/expenses');
const test = require('./routes/test');

// ## Used Routes ###
app.use('/api/categories/:id/expenses', expense);
app.use('/api/categories', category);
app.use('/api/test', test);

// ### Catchers ###
app.use(checkDb);
app.use(errorHandler);

module.exports = app;