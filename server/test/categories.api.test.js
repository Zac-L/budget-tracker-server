const { assert } = require('chai');
const db = require('./db');
const request = require('./request');

describe('categories', () => {

    beforeEach(() => db.drop());

    
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

    let deleteCategory = { name: 'Zach', budget: '100' };
    it('/DELETE by id', () => {
        let categories = null;
        return request.post('/api/categories')
            .send(deleteCategory)
            .then(res => {
                categories = res.body;
                return request.delete(`/api/categories/${categories._id}`);
            })
            .then(res => {
                assert.deepEqual(res.body, { _id: categories._id });
                return request.get(`/api/categories/${categories._id}`);
            })
            .then(
                () => { throw new Error('Unexpected successful response'); },
                err => {
                    assert.equal(err.status, 404);
                }
            );

    });

    // Built this test out, have not written the route for it yet. Not sure if I will since I have patch route working 
    let putCategory = { name: 'Zach', budget: '100' };
    it.skip('/PUT updates entire object', () => {
        return request.post('/api/categories')
            .send(putCategory)
            .then(({ body: resPut }) => {
                assert.ok(resPut._id);
                resPut.name = 'Mary';
                return request.put(`/api/categories/${resPut._id}`)
                    .send({ name: 'Mary' })
                    .then(({ body: putRes }) => {
                        assert.deepEqual(resPut.name, putRes.name);
                    });
            });
    });

    let patchCategory = { name: 'Zach', budget: '100' };
    it('patches by id', () => {
        return request.post('/api/categories')
            .send(patchCategory)
            .then(({ body: resUpdate }) => {
                assert.ok(resUpdate._id);
                resUpdate.name = 'Bob';
                return request.patch(`/api/categories/${resUpdate._id}`)
                    .send({ name: 'Bob' })
                    .then(({ body: updatedRes }) => {
                        assert.deepEqual(resUpdate.name, updatedRes.name);
                    });
            });
    });

});