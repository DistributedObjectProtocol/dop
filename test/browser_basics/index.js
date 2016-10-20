
// require
var tape = require('tape');
var tabe = require('tabe');
global.dop = require('../../dist/nodejs');
var typeConnector = (typeof process.argv[2] == 'undefined' ) ? 'ws' : process.argv[2];


var config = {ports:[4444, 5555, 6666, 7777], typeConnector:typeConnector};





// express
var express = require('express');
var app = express();
app.use("/static", express.static('./'));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
var expressServer = app.listen(config.ports[3], function () {
    console.log('Test is running at http://localhost:'+config.ports[3], '\n\n\n');
});







// tests
tabe.createStream( tape );
require('./server/')( tape, dop, expressServer, config );




    


