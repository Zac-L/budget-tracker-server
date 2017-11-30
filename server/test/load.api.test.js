const { assert } = require('chai');
const db = require('./db');
const request = require('./request');

describe('test route for simulated errors and loading', () => {
    beforeEach(() => db.drop());
    
        
    it('/GET all', () => request
        .get('/api/test')
        .then(res => {
            assert.deepEqual(res.body, { answer: 'vanilla response' });
        })
    );
});