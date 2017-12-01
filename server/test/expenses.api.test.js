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