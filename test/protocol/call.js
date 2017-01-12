var test = require('tape');
var dopServer = require('../../dist/nodejs').create();
var dopClient = require('../../dist/nodejs').create();
var dopClientClient = require('../../dist/nodejs').create();
dopServer.env = 'SERVER';
dopClient.env = 'CLIENT';
dopClientClient.env = 'CLIENTCLIENT';
dopServer.data.object_inc = 7;


var transportName = process.argv[2] || 'local';
var transportListen = require('dop-transports').listen[transportName];
var transportConnect = require('dop-transports').connect[transportName];

var server = dopServer.listen({transport:transportListen})
var client = dopClient.connect({transport:transportConnect, listener:server})
var clientlisten = dopClient.listen({transport:transportListen, port:5555})
var clientclient = dopClientClient.connect({transport:transportConnect, url:'ws://localhost:5555/dop', listener:clientlisten})


var objServer = dopServer.register({
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
        tglobal.equal(objServer, this, 'Scope when calling remote is the same that calling locally')
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
});


dopServer.onsubscribe(function() {
    return objServer;
})


var objClient = dopClient.register({});
dopClient.onsubscribe(function() {
    return objClient;
})






test('TESTING RESOLVE AN REJECTS', function(t) {

client.subscribe().into(objClient).then(function(obj) {
    tglobal=t;
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
        return objServer.resolveAsync(dopClient.createAsync())
    })
    .then(function(value){
        t.equal(value, 'resolveAsync', 'Resolved async local');
        return obj.reject();
    })
    .catch(function(value){
        t.equal(value, 'rejected', 'req.reject');
        return obj.reject0();
    })
    .catch(function(value){
        t.equal(value, 0, 'Rejecting cero value');
        delete objServer.sum;
        return obj.sum();
    })
    .catch(function(value){
        t.equal(value, dopClient.core.error.reject_remote[3], dopClient.core.error.reject_remote.FUNCTION_NOT_FOUND);
        t.end()
    })
})

})


test('CALLING A FUNCTIONS BY TWO LEVELS', function(t) {

objClient.sum = function(a,b){
    return a+a+b+b;
};

clientclient.subscribe().then(function(obj){
    tglobal=t;
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
        return obj.sum(1, 1);
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
    .catch(function(value){
        t.equal(value, 0, 'Rejecting cero value');
        delete objClient.sum;
        return obj.sum();
    })
    .catch(function(value){
        t.equal(value, dopClient.core.error.reject_remote[3], dopClient.core.error.reject_remote.FUNCTION_NOT_FOUND);
        t.end();
        server.listener.close()
        clientlisten.listener.close()
    })
})

})
