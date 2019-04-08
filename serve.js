'use strict';

const http = require('http');
const open = require('open');
const connect = require('connect');
const livereload = require('connect-livereload');
const serveStatic = require('serve-static');

const app = connect();

app.use(livereload());
app.use(serveStatic('./demo', { 'index': ['index.html'] }));

http.createServer(app).listen(3001, () => {
    console.log(`Local serve running at 3001`);
    open('http://localhost:3001');
});
