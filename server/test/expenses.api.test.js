const { assert } = require('chai');
const db = require('./db');
const request = require('./request');

describe('expenses route testing', () => {

    beforeEach(() => db.drop());

    let category = null; // eslint-disable-line
    beforeEach(() => request
        .post('/api/categories')
        .send({ name: 'Mark', budget: 7000 })
        .then(({ body }) => {
            assert.ok(body._id);
            category = body;
        })
    );

    it('cannot /POST without category id', () => {
        return request.post('/api/categories/badid939393/expenses')
            .send({ name: 'Subway', cost: 5 })
            .then(
                () => { throw new Error('unexpected successful response'); },
                res => assert.equal(res.status, 400)
            );
    });

    let expense = {
        name: 'Food',
        cost: 400
    };

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
            category: 'Mark'
        }
    ];

    it('/GET all expenses', () => {
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
                console.log('I am saved: ', saved);
                console.log('I am res.body: ', res.body);
                assert.deepEqual(res.body[1].name, saved[1].name);
                // assert.equal(res.body[1].name, 'Gas');
            });
    });
});