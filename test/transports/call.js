var test = require('tape');
var dopServer = require('../../dist/nodejs').create();
var dopClient = require('../../dist/nodejs').create();
dopServer.env = 'SERVER';
dopClient.env = 'CLIENT';
dopServer.data.object_inc = 7;


var transportName = process.argv[2] || 'local';
var transportListen = require('dop-transports').listen[transportName];
var transportConnect = require('dop-transports').connect[transportName];

var server = dopServer.listen({transport:transportListen})
var client = dopClient.connect({transport:transportConnect, listener:server})
server.on('connect', function(node) {
    if (typeof serverClient == 'undefined')
        serverClient = node;
})

var obj = {
    string: function(){
        return 'Hello world';
    },
    undefined: function(){
        // returning nothing
    },
    object: function() {
        return {hola:"mundo"}
    },
    sum: function(a, b) {
        return a+b;
    },
    resolve: function(req) {
        req.resolve('resolved');
    },
    resolveAsync: function(req) {
        setTimeout(function() {
            req.resolve('resolveAsync');
        }, 100);
        return req;
    },
    reject: function(req) {
        req.reject('rejected');
    },
    reject0: function(req) {
        req.reject(0);
    }
};


dopServer.onsubscribe(function() {
    return obj;
})

test('TESTING RESOLVE AN REJECTS', function(t) {

client.subscribe().then(function(obj) {
    obj.string()
    .then(function(value){
        t.equal('Hello world', value, 'Returning a string');
        return obj.undefined();
    })
    .then(function(value){
        t.equal(undefined, value, 'Returning nothing');
        return obj.object();
    })
    .then(function(value){
        t.equal(value.hola, 'mundo', 'Returning an object');
        return obj.sum(2, 2);
    })
    .then(function(value){
        t.equal(value, 4, 'Passing two parameters');
        return obj.resolve();
    })
    .then(function(value){
        t.equal(value, 'resolved', 'req.resolve instead of return');
        return obj.resolveAsync();
    })
    .then(function(value){
        t.equal(value, 'resolveAsync', 'Resolved async');
        return obj.reject();
    })
    .catch(function(value){
        t.equal(value, 'rejected', 'req.reject');
        return obj.reject0();
    })
    .then(function(value){
        console.log( 'then' );
        // return obj.sum(2, 2);
        t.end();
    })
    .catch(function(value){
        console.log( 'catch' );
        // return obj.sum(2, 2);
    })
})

})


