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

    it('/GET all', () => request
        .get('/api/categories')
        .then(res => assert.deepEqual(res.body, []))
    );
});