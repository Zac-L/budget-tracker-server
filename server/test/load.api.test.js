const { assert } = require('chai');
const db = require('./db');
const request = require('./request');

describe.skip('test route for simulated errors and loading', () => {
    beforeEach(() => db.drop());
    
        
    it('/GET test response', () => request
        .get('/api/test')
        .then(res => {
            assert.deepEqual(res.body, { answer: 'vanilla response' });
        })
    );

    // TODO: need to figure out how to dynamically account for wait time.
    it('/GET wait response', () => request
        .get('/api/test?wait=1500')
        .then(res => {
            assert.deepEqual(res.body, { answer: 'waited for 1500ms' });
        })
    );
});