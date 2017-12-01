const { assert } = require('chai');
const db = require('./db');
const request = require('./request');

describe.only('expenses route testing', () => {

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
                // err => console.log(err),
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
});