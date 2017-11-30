const express = require('express');
const router = express.Router();

router
    .get('/', (req, res, next) => {
        const { wait, unexpected, validation } = req.query;

        if(wait) {
            setTimeout(() => res.json({ answer: `waited for ${wait}ms`}), wait);
        }
        else if(unexpected) {
            throw new Error(unexpected);
        }
        else if(validation) {
            next({ code: 400, error: validation });
        }
        else {
            res.json({ answer: 'vanilla response' });
        }
    });

module.exports = router;