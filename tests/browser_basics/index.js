
// require
var tape = require('tape');
var tabe = require('tabe');
var port = 9999;
var synko = require('../../server/dist/synko');
var typeConnector = (typeof process.argv[2] == 'undefined' ) ? 'ws' : process.argv[2];




// express
var express = require('express');
var app = express();
// app.use("/static", express.static(__dirname + '/../../'));
app.use("/static", express.static('./'));
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});
var httpServer = app.listen(port, function () {
    console.log('Test is running at http://localhost:'+port, '\n\n\n');
});




// tests
tabe.createStream( tape );
test = tape;
require('./server/create');


