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

// ## Used Routes ###
app.use(checkDb);
app.use('/api/categories', category);

// ### Catchers ###
app.use(errorHandler);

module.exports = app;