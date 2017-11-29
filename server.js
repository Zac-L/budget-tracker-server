const app = require('./server/lib/app');
const http = require('http');
const port = process.env.PORT || 3001;
require('./server/lib/setup-mongoose');

const server = http.createServer(app);
server.listen(port, () => {
    console.log('server running at', server.address());
});