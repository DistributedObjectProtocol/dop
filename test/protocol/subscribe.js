var test = require('tape');
var dopServer = require('../../dist/nodejs').create();
var dopClient = require('../../dist/nodejs').create();
var dopClient2 = require('../../dist/nodejs').create();
var dopClientClient = require('../../dist/nodejs').create();
dopServer.env = 'SERVER';
dopClient.env = 'CLIENT';
dopClient2.env = 'CLIENT2';
dopClientClient.env = 'CLIENTCLIENT';

test('SUBSCRIBE TESTS', function(tt) {

    var test = function(name, cb){
        tt.test(name, {}, cb);
    };

var transportName = process.argv[2] || 'local';
var transportListen = require('dop-transports').listen[transportName];
var transportConnect = require('dop-transports').connect[transportName];
var serverClient;
var server = dopServer.listen({transport:transportListen})
var client = dopClient.connect({transport:transportConnect, listener:server})
var client2 = dopClient2.connect({transport:transportConnect, listener:server})
server.on('connect', function(node) {
    if (typeof serverClient == 'undefined')
        serverClient = node;
})
var clientlistening = dopClient.listen({transport:transportListen, port:5555})
var clientclient = dopClientClient.connect({transport:transportConnect, url:'ws://localhost:5555/dop', listener:clientlistening})
clientlistening.on('connect', function(node) {
    if (typeof clientClient == 'undefined')
        clientClient = node;
})

test('Before onsubscribe is defined', function(t) {
    client.subscribe('DATA').catch(function(err){
        t.equal(err, dopClient.core.error.reject_remote[1], 'Object not found');
        t.end()
    })
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
    var serverClient;
    dopServer.onsubscribe(function(name, req) {
        if (name === 'DATA') {
            serverClient = req.node;
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
        else if (name === 'RESOLVESTRING') {
            req.resolve('RESOLVESTRING');
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
        t.equal(objectDataServer.node[serverClient.token].subscriber, 1, 'Client subscriber');
        t.equal(objectDataServer.node[serverClient.token].owner, 0, 'Client is not owner');
        t.equal(objectDataClient.node[client.token].subscriber, 0, 'Server is not subscriber');
        t.equal(objectDataClient.node[client.token].owner, 1, 'Server is owner');
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
        t.deepEqual(objectDataServer2.node[serverClient.token].subscriber, 1, 'Client subscriber');
        t.deepEqual(objectDataServer2.node[serverClient.token].owner, 0, 'Client is not owner');
        t.deepEqual(objectDataClient2.node[client.token].subscriber, 0, 'Server is not subscriber');
        t.deepEqual(objectDataClient2.node[client.token].owner, 2, 'Server is owner');
        return client.subscribe('REJECT');
    })
    .catch(function(err){
        t.equal(err.message, 'Subscription rejected', 'Subscription rejected');
        return client.subscribe();
    })
    .catch(function(err){
        t.equal(err, dopClient.core.error.reject_remote[1], 'Object not found subscription rejected');
        return client.subscribe('RESOLVESTRING');
    })
    // .catch(function(err){
    //     console.log( 123131, typeof err );
    //     t.end();        
    // })

})


test('Client subscribe asynchronously same object', function(t) {
    var objectServer = {test:Math.random()};
    dopServer.onsubscribe(function() {
        return objectServer;
    })

    var objectClient;
    client.subscribe().then(function(obj){
        objectClient = obj;
    })
    client.subscribe().then(function(obj){
        t.equal(obj, objectClient, 'Same object');
        t.deepEqual(objectServer, objectClient, 'deepEqual to objectServer');
        t.end();
    })
})


test('Client subscribe asynchronously different objects', function(t) {

    dopServer.onsubscribe(function() {
        return {test:Math.random()};
    })

    var objectClient1, objectClient2;
    client.subscribe().then(function(obj){
        objectClient1 = obj;
    })
    client.subscribe().then(function(obj){
        objectClient2 = obj;
    })
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
    })
})

test('Server subscribe client object', function(t) {
    var objClient = {test:Math.random()};
    dopClient.onsubscribe(function() {
        return objClient;
    })
    serverClient.subscribe().then(function(objServer){
        var objectDataServer = dopServer.data.object[dopServer.getObjectId(objServer)];
        var objectDataClient = dopClient.data.object[dopServer.getObjectId(objClient)];
        t.equal(objServer.hasOwnProperty('test'), true, 'obj hasOwnProperty test');
        t.deepEqual(objServer, objClient);
        t.equal(objectDataClient.node[client.token].subscriber, 1, 'Server is subscriber');
        t.equal(objectDataClient.node[client.token].owner, 0, 'Server is not owner');
        t.equal(objectDataServer.node[serverClient.token].subscriber, 0, 'Client is not subscriber');
        t.equal(objectDataServer.node[serverClient.token].owner>0, true, 'Client is owner');
        t.end();
    })
})

test('Server subscribe client object that is from server', function(t) {
    var objServer = {test:Math.random()},
        objClient;
    dopServer.onsubscribe(function() {
        return objServer;
    })
    dopClient.onsubscribe(function() {
        return objClient;
    })
    client.subscribe().then(function(obj){
        objClient = obj;
        serverClient.subscribe().then(function(objServer2){
            t.notEqual(objServer2, dopServer.getObjectProxy(objServer));
            t.equal(dopServer.getObjectId(objServer2), dopServer.getObjectId(objServer)+1, 'Different ids');
            t.equal(objServer2.hasOwnProperty('test'), true, 'obj hasOwnProperty test');
            t.deepEqual(objServer, objClient);
            t.deepEqual(objServer, objServer2);
            t.deepEqual(objClient, obj);

            var objectDataServer = dopServer.data.object[dopServer.getObjectId(objServer)];
            var objectDataServer2 = dopServer.data.object[dopServer.getObjectId(objServer2)];
            var objectDataClient = dopClient.data.object[dopServer.getObjectId(objClient)];
            t.equal(objectDataServer.node[serverClient.token].subscriber, 1, 'Client is subscriber');
            t.equal(objectDataServer.node[serverClient.token].owner, 0, 'Client is not owner');
            t.equal(objectDataServer2.node[serverClient.token].subscriber, 0, 'Client is not subscriber');
            t.equal(objectDataServer2.node[serverClient.token].owner>0, true, 'Client is owner');
            t.equal(objectDataClient.node[client.token].subscriber, 1, 'Server is subscriber');
            t.equal(objectDataClient.node[client.token].owner>0, true, 'Server is not owner');

            t.end();
        })
    })
})



test('Client subscribe into object that is not register yet', function(t) {
    var objServer = {test:Math.random()},
        objClient = {test:Math.random()},
        objClientSnap = dopClient.util.merge({}, objClient);
    
    t.deepEqual(objClient, objClientSnap, 'Are equivalent before subcribe');
    t.equal(dopClient.isRegistered(objClient), false, 'Is not registered');
    
    dopServer.onsubscribe(function() {
        return objServer;
    })
    client.subscribe().into(objClient).then(function(obj){
        t.equal(dopClient.isRegistered(objClient), true, 'Is registered');
        t.notDeepEqual(objClient, objClientSnap, 'Are not equivalent before subcribe');
        t.deepEqual(objClient, objServer, 'Are equivalent with server objetc');
        t.equal(obj, dopClient.getObjectProxy(objClient), 'objClient and obj are the same object');
        t.end();
    })
})



test('Client subscribe into object that is already registered', function(t) {
    var objServer = {test:Math.random()},
        objClient = dopClient.register({test:Math.random()}),
        objClientSnap = dopClient.util.merge({}, objClient);
    
    t.deepEqual(objClient, objClientSnap, 'Are equivalent before subcribe');
    t.equal(dopClient.isRegistered(objClient), true, 'Is registered');
    
    dopServer.onsubscribe(function() {
        return objServer;
    })
    client.subscribe().into(objClient).then(function(obj){
        t.equal(dopClient.isRegistered(obj), true, 'Is registered');
        t.notDeepEqual(objClient, objClientSnap, 'Are not equivalent before subcribe');
        t.deepEqual(objClient, objServer, 'Are equivalent with server objetc');
        t.equal(obj, objClient, 'objClient and obj are the same object');
        t.end();
    })
})



test('Server <-> Client subscribe into the same object', function(t) {
    var objServer = {test:Math.random()},
        objClient = {test:Math.random()};

    dopServer.onsubscribe(function() {
        return objServer;
    })
    dopClient.onsubscribe(function() {
        return objClient;
    })

    client.subscribe().into(objClient).then(function(obj) {
        t.equal(obj, dopClient.getObjectProxy(objClient), 'Same object client');
        serverClient.subscribe().into(objServer).then(function(obj2) {
            t.equal(obj2, dopServer.getObjectProxy(objServer), 'Same object server');
            t.deepEqual(objClient, objServer);
            var objectDataServer = dopServer.data.object[dopServer.getObjectId(objServer)];
            var objectDataClient = dopClient.data.object[dopServer.getObjectId(objClient)];
            t.equal(objectDataServer.node[serverClient.token].subscriber, 1, 'Client is subscriber');
            t.equal(objectDataServer.node[serverClient.token].owner>0, true, 'Client is owner');
            t.equal(objectDataClient.node[client.token].subscriber, 1, 'Server is subscriber');
            t.equal(objectDataClient.node[client.token].owner>0, true, 'Server is owner');
            t.end();
        })
    })
})




test('Multiple Clients subscribe Same object', function(t) {
    var objectServer = {test:Math.random()};
    dopServer.onsubscribe(function() {
        return objectServer;
    })

    var objectClient;
    client.subscribe().then(function(obj){
        objectClient = obj;
        t.deepEqual(objectClient, objectServer, 'deepEqual to objectServer');
    })
    client2.subscribe().then(function(obj){
        t.deepEqual(obj, objectClient, 'deepEqual to objectClient1');
        t.deepEqual(obj, objectServer, 'deepEqual to objectServer');
        t.end();
    })
})



test('Multiple Clients subscribe different objects', function(t) {
    dopServer.onsubscribe(function() {
        return {test:Math.random()};
    })
    var objectClient;
    client.subscribe().then(function(obj){
        objectClient = obj;
    })
    client2.subscribe().then(function(obj){
        t.notDeepEqual(obj, objectClient, 'notDeepEqual to objectClient1');
        t.end();
    })
})



test('Server -> Client -> ClientClient', function(t) {
    var objServer = {test:Math.random()},
        objClient;
    dopServer.onsubscribe(function() {
        return objServer;
    })
    dopClient.onsubscribe(function() {
        return objClient;
    })
    client.subscribe().then(function(obj){
        objClient = obj;
        clientclient.subscribe().then(function(obj2) {
            t.deepEqual(obj2, objServer, 'deepEqual to objServer');

            var objectDataServer = dopServer.data.object[dopServer.getObjectId(objServer)];
            var objectDataClient = dopClient.data.object[dopClient.getObjectId(objClient)];
            var objectDataClientClient = dopClientClient.data.object[dopClient.getObjectId(obj2)];
            t.equal(objectDataServer.node[serverClient.token].subscriber, 1, 'Client is subscriber');
            t.equal(objectDataServer.node[serverClient.token].owner, 0, 'Client is not owner');
            t.equal(objectDataClient.node[client.token].subscriber, 0, 'Server is not subscriber');
            t.equal(objectDataClient.node[client.token].owner>0, true, 'Server is owner');


            t.equal(objectDataClient.node[clientClient.token].subscriber, 1, 'ClientClient is subscriber');
            t.equal(objectDataClient.node[clientClient.token].owner, 0, 'ClientClient is not owner');
            t.equal(objectDataClientClient.node[clientclient.token].subscriber, 0, 'Client is not subscriber');
            t.equal(objectDataClientClient.node[clientclient.token].owner>0, true, 'Client is owner');

            t.end();
        })
    })
})



test('Server <-> Client <-> ClientClient into the same object', function(t) {
        var objServer = {test:Math.random()},
            objClient = {test:Math.random()},
            objClientClient = {test:Math.random()};

    dopServer.onsubscribe(function() {
        return objServer;
    })
    dopClient.onsubscribe(function() {
        return objClient;
    })
    dopClientClient.onsubscribe(function() {
        return objClientClient;
    })


    clientclient.subscribe().into(objClientClient).then(function(obj) {
        t.equal(obj, dopClientClient.getObjectProxy(objClientClient), 'Same object clientclient');
        client.subscribe().into(objClient).then(function(obj) {
            t.equal(obj, dopClient.getObjectProxy(objClient), 'Same object client');
            serverClient.subscribe().into(objServer).then(function(obj) {
                t.equal(obj, dopServer.getObjectProxy(objServer), 'Same object server');
                clientClient.subscribe().into(objClient).then(function(obj) {
                    t.equal(obj, dopClient.getObjectProxy(objClient), 'Same object client');
                    t.deepEqual(objServer, objClient, 'deepEqual to objServer objClient');
                    t.deepEqual(objClient, objClientClient, 'deepEqual to objServer objClientClient');
                    
                    var objectDataServer = dopServer.data.object[dopServer.getObjectId(objServer)];
                    var objectDataClient = dopClient.data.object[dopServer.getObjectId(objClient)];
                    var objectDataClientClient = dopClientClient.data.object[dopServer.getObjectId(objClientClient)];
                    t.equal(objectDataServer.node[serverClient.token].subscriber, 1, 'Client is subscriber');
                    t.equal(objectDataServer.node[serverClient.token].owner>0, true, 'Client is owner');
                    t.equal(objectDataClient.node[client.token].subscriber, 1, 'Server is subscriber');
                    t.equal(objectDataClient.node[client.token].owner>0, true, 'Server is owner');
                    t.equal(objectDataClient.node[clientClient.token].subscriber, 1, 'ClientClient is subscriber');
                    t.equal(objectDataClient.node[clientClient.token].owner>0, true, 'ClientClient is owner');
                    t.equal(objectDataClientClient.node[clientclient.token].subscriber, 1, 'Client is subscriber');
                    t.equal(objectDataClientClient.node[clientclient.token].owner>0, true, 'Client is owner');
                    t.end()
                    server.listener.close()
                    clientlistening.listener.close()
                })
            })
        })
    })


})


// test("Server -> Client -> ClientClient -> Server", function(t) {
    // to do...
// })




})
