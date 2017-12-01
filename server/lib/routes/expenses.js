
const express = require('express');
const router = express.Router();
const Expense = require('../models/expense');

router
    .post('/', (req, res, next) => {
        return new Expense(req.body)
            .save()
            .then(saved => res.send(saved))
            .catch(next);
    });

module.exports = router;