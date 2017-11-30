const http = require('http');
const app = require('./server/lib/app');
const connect = require('./server/lib/connect');

connect();

const server = http.createServer(app);
const port = process.env.PORT || 3001;

server.listen(port, () => {
    // eslint-disable-next-line
    console.log('server running on', server.address().port);
});