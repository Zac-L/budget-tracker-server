
const express = require('express');
const router = express.Router({mergeParams: true});
const Expense = require('../models/expense');

router
    .post('/', (req, res, next) => {
        new Expense({...req.body, category: req.params.categoryId})
            .save()
            .then(saved => res.send(saved))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Expense.find({
            category: req.params.categoryId
        })
            .populate('category', 'name')
            .lean()
            .then(mongRes => res.send(mongRes))
            .catch(next);
    })

    .get('/:expenseId', (req, res, next) => {
        Expense.findOne({
            _id: req.params.expenseId,
            category: req.params.categoryId
        })
            .lean()
            .then(expense => {
                if(!expense) {
                    throw { code: 404, error: `id${req.params.id} does not exist`};
                }
                else res.json(expense);
            })
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        Expense.findByIdAndRemove(req.params.id)
            .then(result => {
                const exists = result != null;
                res.json({
                    removed: exists
                });
            })
            .catch(next);
    })

    .patch('/:id', (req, res, next) => {
        Expense.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        )
            .lean()
            .then(mongoRes => res.send(mongoRes))
            .catch(next);
    })
    
;

module.exports = router;