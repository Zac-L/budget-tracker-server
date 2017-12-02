
const express = require('express');
const router = express.Router({mergeParams: true});
const Expense = require('../models/expense');

router
    .post('/', (req, res, next) => {
        new Expense({...req.body, category: req.params.id})
            .save()
            .then(saved => res.send(saved))
            .catch(next);
    })
    // TODO: need to tdd this get route
    .get('/', (req, res, next) => {
        Expense.find(req.query)
            .populate('category', 'name')
            .lean()
            .then(mongRes => res.send(mongRes))
            .catch(next);
    })
    
;

module.exports = router;