const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const Category = require('../models/category');

router
    .get('/', (req, res, next) => {
        Category.find()
            .lean()
            .then(categories => res.send(categories))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Category.findById(req.params.id)
            .lean()
            .then( category => {
                if(!category) {
                    throw { code: 404, error: `id ${req.params.id} does not exist` };
                }
                else res.json(category);
            })
            .catch(next);

    })

    .post('/', bodyParser, (req, res, next) => {
        new Category(req.body)
            .save()
            .then(saved => res.send(saved))
            .catch(next);
    })
;

module.exports = router;