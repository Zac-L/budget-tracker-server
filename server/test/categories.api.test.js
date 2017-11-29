const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);

const connection = require('../lib/setup-mongoose');
const db = require('./db');
const app = require('../lib/app');

describe('categories', () => {

    before(db.drop(connection));
    const request = chai.request(app);

    let category = { name: 'Zach', budget: '100' };

    it('/GET all', () => request
        .get('/api/categories')
        .then(res => assert.deepEqual(res.body, []))
    );

    it('/GET by id', () => {
        let categories = null;
        return request.post('/api/categories')
            .send(category)
            .then(res => {
                categories = res.body;
                return request.get(`/api/categories/${categories._id}`);
            })
            .then(res => {
                assert.deepEqual(res.body, categories);
            });
    });

    it('/GET returns 404 for bad id given', () => {
        return request.get('/api/categories/5a1f0513666edce9c5d4be4e')
            .then(
                () => { throw new Error('Unexpected successful response'); },
                err => {
                    assert.equal(err.status, 404);
                }
            );
    });

    it('POST', () => request 
        .post('/api/categories')
        .send(category)
        .then(({ body }) => {
            assert.ok(body._id);
            assert.equal(category.name, body.name);
            category = body;
        })
    );
});