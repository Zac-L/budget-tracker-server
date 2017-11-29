const express = require('express');
const app = express();

/* middleware */
const morgan = require('morgan');
const redirectHttp = require('./redirect-http')();
const cors = require('cors')();
const checkDb = require('./check-connection')();
const errorHandler = require('./error-handler')();

app.use(morgan('dev'));
app.use(cors);


// Redirect http to https in production
if(process.env.NODE_ENV === 'production') {
    app.use(redirectHttp);
}
app.use(express.static('./public'));

/* routes */
const category = require('./routes/categories');


app.use(checkDb);
app.use('/api/categories', category);

app.use(errorHandler);

module.exports = app;