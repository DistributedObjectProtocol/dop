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
server.on('connect', function(node) {
    nodeClient = node;
})


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
        else if (name === 'NOOBJECT') {
            req.resolve('NOOBJECT');
            setTimeout(t.end.bind(t), 10);
        }
    })

    var objClient, objectDataServer, objectDataClient;
    client.subscribe('DATA').then(function(obj){
        objClient = obj;
        objectDataServer = dopServer.data.object[1];
        objectDataClient = dopClient.data.object[1];
        t.deepEqual(obj, DATA, 'deepEqual data received from server');
        t.deepEqual(objectDataServer.object, dopServer.getObjectProxy(DATA), 'Same object stored in server');
        t.equal(objectDataServer.node[nodeClient.token].subscribed, true, 'Client subscribed');
        t.equal(objectDataServer.node[nodeClient.token].owner, false, 'Client is not owner');
        t.equal(objectDataClient.node[client.token].subscribed, false, 'Server is not subscribed');
        t.equal(objectDataClient.node[client.token].owner, true, 'Server is owner');
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
        return client.subscribe('NOOBJECT');
    })
    // .catch(function(err){
    //     console.log( 123131, typeof err );
    //     t.end();        
    // })

});


test('Client subscribe asynchronously same object', function(t) {
    var objectServer = {test:1234};
    dopServer.onsubscribe(function() {
        return objectServer;
    });

    var objectClient;
    client.subscribe().then(function(obj){
        objectClient = obj;
    });
    client.subscribe().then(function(obj){
        t.equal(obj, objectClient, 'Same object');
        t.deepEqual(objectServer, objectClient, 'deepEqual to objectServer');
        t.end();
    });
});


test('Client subscribe asynchronously different objects', function(t) {

    dopServer.onsubscribe(function() {
        return {test:Math.random()};
    });

    var objectClient1, objectClient2;
    client.subscribe().then(function(obj){
        objectClient1 = obj;
    });
    client.subscribe().then(function(obj){
        objectClient2 = obj;
    });
    client.subscribe().then(function(obj){
        var objectClient3 = obj;
        var objectId1 = dopClient.getObjectId(objectClient1);
        var objectId2 = dopClient.getObjectId(objectClient2);
        var objectId3 = dopClient.getObjectId(objectClient3);
        t.equal(objectId1, objectId2-1, 'Correct ID order');
        t.equal(objectId2, objectId3-1, 'Correct ID order2');
        t.equal(objectClient1.hasOwnProperty('test'), true, 'objectClient1 hasOwnProperty test');
        t.equal(objectClient2.hasOwnProperty('test'), true, 'objectClient2 hasOwnProperty test');
        t.equal(objectClient3.hasOwnProperty('test'), true, 'objectClient3 hasOwnProperty test');
        t.notDeepEqual(objectClient1, objectClient2);
        t.notDeepEqual(objectClient2, objectClient3);
        t.notDeepEqual(objectClient1, objectClient3);
        t.end();
    });
});

test('Server subscribe client object', function(t) {
    var objClient = {test:Math.random()};
    dopClient.onsubscribe(function() {
        return objClient;
    });
    nodeClient.subscribe().then(function(objServer){
        var objectDataServer = dopServer.data.object[dopServer.getObjectId(objServer)];
        var objectDataClient = dopClient.data.object[dopServer.getObjectId(objClient)];
        t.equal(objServer.hasOwnProperty('test'), true, 'obj hasOwnProperty test');
        t.deepEqual(objServer, objClient);
        t.equal(objectDataClient.node[client.token].subscribed, true, 'Server is subscribed');
        t.equal(objectDataClient.node[client.token].owner, false, 'Server is not owner');
        t.equal(objectDataServer.node[nodeClient.token].subscribed, false, 'Client is not subscribed');
        t.equal(objectDataServer.node[nodeClient.token].owner, true, 'Client is owner');

    })
});

// test('Server subscribe client object that is from server', function(t) {

// });



// test('Into...', function(t) {});






    // dopClient.observeProperty(o, 'paco', function(mutation){
    //     console.log( mutation );
    // })

    // dopClient.observe(o, function(mutations){
    //     console.log( mutations );
    // })
