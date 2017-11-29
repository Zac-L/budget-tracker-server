const express = require('express');
const router = express.Router();
// const bodyParser = require('body-parser').json();
const Category = require('../models/category');

router
    .get('/', (req, res, next) => {
        Category.find(req.query)
            .lean()
            .then(categories => res.send(categories))
            .catch(next);
    });

module.exports = router;