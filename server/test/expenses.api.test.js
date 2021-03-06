const { assert } = require('chai');
const db = require('./db');
const request = require('./request');
const Promise = require('bluebird');

describe('expenses route testing', () => {

    beforeEach(() => db.drop());

    let category = null;
    beforeEach(() => request
        .post('/api/categories')
        .send({ name: 'Mark', budget: 7000 })
        .then(({ body }) => {
            assert.ok(body._id);
            category = body;
        })
    );
    let expense = {
        name: 'Food',
        cost: 400
    };

    const expensesArray = [
        {
            name: 'Food',
            cost: 400,
            category: {
                name: 'Mark'
            }
            
        },
        {
            name: 'Gas',
            cost: 100,
            category: {
                name: 'Mark'
            }
        }
    ];

    it('cannot /POST without category id', () => {
        return request.post('/api/categories/badid939393/expenses')
            .send({ name: 'Subway', cost: 5 })
            .then(
                () => { throw new Error('unexpected successful response'); },
                res => assert.equal(res.status, 400)
            );
    });


    it('/POST expense with category id', () => {
        expense.category = category._id;
        return request.post(`/api/categories/${category._id}/expenses`)
            .send(expense)
            .then(({body}) => {
                assert.isOk(body._id);
                for(const key of ['category', 'name', 'cost']) {
                    assert.equal(body[key], expense[key]);
                }
                expense = body;
            });
    });

    it('/GET all expenses from a category', () => {
        let expenseCollection = expensesArray.map(expense => {
            expense.category = category._id;
            return request.post(`/api/categories/${category._id}/expenses`)
                .send(expense)
                .then(res => res.body);
        });

        let saved = null;
        return Promise.all(expenseCollection)
            .then(_saved => {
                saved = _saved;
                return request.get(`/api/categories/${category._id}/expenses`);
            })
            .then(res => {
                assert.deepEqual(res.body[1].name, saved[1].name);
                assert.equal(res.body[1].name, 'Gas');
            });
    });

    it('/GET expenses by category id', () => {
        expense.category = category._id;
        let savedExpense = null;
        return request.post(`/api/categories/${category._id}/expenses`)
            .send(expensesArray[0])
            .then(res => {
                savedExpense = res.body;
                return request.get(`/api/categories/${category._id}/expenses/${savedExpense._id}`);
            })
            .then(res => {
                assert.deepEqual(res.body, savedExpense);
            });
    });

    it('/DELETE expense by id', () => {
        expense.category = category._id;
        let savedExpense = null;
        return request.post(`/api/categories/${category._id}/expenses`)
            .send(expensesArray[0])
            .then(res => {
                savedExpense = res.body;
                return request.delete(`/api/categories/${category._id}/expenses/${savedExpense._id}`);
            })
            .then(res => {
                assert.deepEqual(res.body._id, savedExpense._id);
            });
    });

    it('/PATCH an expense by id', () => {
        expense.category = category._id;
        return request.post(`/api/categories/${category._id}/expenses`)
            .send(expensesArray[0])
            .then(({ body: resPatch }) => {
                assert.ok(resPatch._id);
                resPatch.name = 'Drink';
                return request.patch(`/api/categories/${category._id}/expenses/${resPatch._id}`)
                    .send({ name: 'Drink' })
                    .then(({ body: patchRes }) => {
                        assert.deepEqual(resPatch.name, patchRes.name);
                    });
            });
    });
});