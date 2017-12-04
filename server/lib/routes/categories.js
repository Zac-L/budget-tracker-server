const express = require('express');
const router = express.Router();
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
                    throw { code: 404, error: `id: '${req.params.id}' does not exist` };
                }
                else res.json(category);
            })
            .catch(next);

    })

    .post('/', (req, res, next) => {
        new Category(req.body)
            .save()
            .then(saved => res.send(saved))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        Category.findByIdAndRemove(req.params.id, {
            select: '-name -budget -__v'
        })
            .then(result => {
                res.json(result);
                // const exists = result != null;
                // res.json({
                //     removed: exists
                // });
            })
            .catch(next);
    })

    .patch('/:id', (req, res, next) => {
        Category.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        )
            .lean()
            .then(mongoRes => res.send(mongoRes))
            .catch(next);
    });

module.exports = router;