
const express = require('express');
const router = express.Router({mergeParams: true});
const Expense = require('../models/expense');

router
    .post('/', (req, res, next) => {
        new Expense({...req.body, category: req.params.id})
            .save()
            .then(saved => res.send(saved))
            .catch(next);
    });

module.exports = router;