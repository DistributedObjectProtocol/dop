var test = require('tape');
var dopServer = require('../../dist/nodejs').create();
var dopClient = require('../../dist/nodejs').create();
dopServer.env = 'SERVER';
dopClient.env = 'CLIENT';

var transportName = process.argv[2] || 'local';
var transportListen = require('dop-transports').listen[transportName];
var transportConnect = require('dop-transports').connect[transportName];

var server = dopServer.listen({transport:transportListen});
var client = dopClient.connect({transport:transportConnect, listener:server});



test('Client subscribe synchronously', function(t) {

    var DATA = {
        string: 'string',
        boolean: true,
        number: -123,
        Infinity: -Infinity,
        float: 1.234153454354341,
        long: 12313214234312324353454534534,
        undefined: undefined,
        null: null,
        regexp:  /molamazo/g,
        date: new Date(),
        "~DOP": [],
        und: "~U",
        inf: '~I',
        fun: '~F',
        nan: '~N',
        reg: '~R',
        deep:{
            deeper:{the:'end'}
        }
    };
    var nodeClient;
    dopServer.onsubscribe(function(name, req) {
        if (name === 'DATA') {
            nodeClient = req.node;
            t.equal(dopServer.isTarget(DATA), false, 'Is not registered yet');
            return DATA;
        }
        else if (name === 'DATA_DEEP') {
            t.equal(dopServer.isRegistered(DATA), true, 'Is registered');
            t.equal(dopServer.isTarget(DATA), true, 'Is target');
            t.equal(dopServer.isProxy(DATA.deep), true, 'Is proxy');
            return DATA.deep;
        }
        else if (name === 'DATA_DEEPER') {
            return dopServer.getObjectTarget(DATA.deep.deeper);
        }
        else if (name === 'ASYNC') {
            setTimeout(function(){
                req.resolve(dopServer.getObjectProxy(DATA));
            },10)
            return req;
        }
        else if (name === 'INNER-COPY') {
            return [Math.random(), DATA];
        }
        else if (name === 'REJECT') {
            req.reject({message:'Subscription rejected'})
        }
        else if (name === 'RESOLVING STRING') {
            req.resolve('')
        }

    })

    var objClient, objectDataServer, objectDataClient;
    client.subscribe('DATA').then(function(obj){
        objClient = obj;
        objectDataServer = dopServer.data.object[1];
        objectDataClient = dopClient.data.object[1];
        t.deepEqual(obj, DATA, 'deepEqual data received from server');
        t.deepEqual(objectDataServer.object, dopServer.getObjectProxy(DATA), 'Same object stored in server');
        t.deepEqual(objectDataServer.node[nodeClient.token].subscribed, true, 'Client subscribed');
        t.deepEqual(objectDataServer.node[nodeClient.token].owner, false, 'Client is not owner');
        t.deepEqual(objectDataClient.node[client.token].subscribed, false, 'Server is not subscribed');
        t.deepEqual(objectDataClient.node[client.token].owner, true, 'Server is owner');
        return client.subscribe('DATA_DEEP');
    })
    .then(function(obj_deep){
        t.equal(obj_deep, objClient.deep, 'DATA_DEEP is the same object');
        t.deepEqual(obj_deep, DATA.deep, 'DATA_DEEP is deepEqual to original data');
        return client.subscribe('DATA_DEEPER');
    })
    .then(function(obj_deeper){
        t.equal(obj_deeper, objClient.deep.deeper, 'DATA_DEEPER is the same object');
        t.deepEqual(obj_deeper, DATA.deep.deeper, 'DATA_DEEPER is deepEqual to original data');
        return client.subscribe('ASYNC');
    })
    .then(function(obj){
        t.equal(obj, objClient, 'DATA is the same object');
        t.deepEqual(obj, DATA, 'DATA is deepEqual to original data');
        return client.subscribe('INNER-COPY');
    })
    .then(function(obj){
        objectDataServer2 = dopServer.data.object[2];
        objectDataClient2 = dopClient.data.object[2];
        t.notEqual(objectDataServer.object, objectDataServer2.object[1], 'Not equal to DATA');
        t.deepEqual(objectDataServer.object, objectDataServer2.object[1], 'deepEqual to DATA');
        t.deepEqual(dopClient.getObjectId(obj), 2, 'Correct objectId');
        t.deepEqual(obj[1], DATA, 'deepEqual data received from server');
        t.deepEqual(objectDataServer2.node[nodeClient.token].subscribed, true, 'Client subscribed');
        t.deepEqual(objectDataServer2.node[nodeClient.token].owner, false, 'Client is not owner');
        t.deepEqual(objectDataClient2.node[client.token].subscribed, false, 'Server is not subscribed');
        t.deepEqual(objectDataClient2.node[client.token].owner, true, 'Server is owner');
        return client.subscribe('REJECT');
    })
    .catch(function(err){
        t.equal(err.message, 'Subscription rejected', 'Subscription rejected');
        t.end();
        return client.subscribe('RESOLVING STRING');
    })
    // .catch(function(err){
    //     console.log( 123131, typeof err );
    //     t.end();        
    // })

});


// test('Client subscribe asynchronously same object', function(t) {});
// test('Client subscribe asynchronously different objects', function(t) {});
// test('Multiple Clients subscribe Same object', function(t) {});
// test('Multiple Clients subscribe different objects', function(t) {});

// test('Into...', function(t) {});

// test('Server subscribe...', function(t) {});





    // dopClient.observeProperty(o, 'paco', function(mutation){
    //     console.log( mutation );
    // })

    // dopClient.observe(o, function(mutations){
    //     console.log( mutations );
    // })
