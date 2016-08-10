var http = require('http');


module.exports = function (tape, dop, expressServer, config) {





test('typeof', function (t) {

    t.equal(typeof dop, 'object', "equal(typeof dop, 'object'");
    t.equal(typeof dop.listen, 'function', "equal(typeof dop.listen, 'function'");

    t.end();
});


// httpServers
var myListener;
var httpServer = http.createServer(function (){})
httpServer.listen(config.ports[2]);

test('.listen()', function(t){

    myListener = dop.listen();
    t.equal( myListener.transport.options.port, config.ports[0], "If we dont pass any option will take the dafault port dop.port:"+dop.port);
    t.end();

});

var first_socket;
test('onopen onmessage', function(t){

    myListener.on('open', function( socket ) {
        first_socket = socket;
        socket.send('Hola Mundo');
    });
    myListener.transport.on('connection', function( socket ) {
        t.equal(first_socket, socket, 'onopen');
    });


    myListener.on('message', function( socket, message ) {
        if (message.substr(0,1) != '[') {
            t.equal(message, 'Adios Mundo', 'onmessage: ' + message);
            t.end();
        }
        if (message.substr(8,6) == 'PUBLIC') {
            node.subscribe('PRIVATE','user','pass');
        }
    });

});


var token;
var node;
test('onconnect', function(t){

    myListener.on('connect', function( nod, tok ) {
        node = nod;
        token = tok;
        t.equal(typeof token, 'string', 'listener.on');
        node.on('connect', function( token2 ) {
            t.equal(token, token2, 'node.on');
            t.end();
        });
    });


});


var PUBLIC_PROXY;
var PUBLIC = {
    string:'string',
    boolean:true,
    number:-123,
    NaN:NaN,
    Infinity:-Infinity,
    float:1.234153454354341,
    long:12313214234312324353454534534,
    undefined:undefined,
    null:null,
    symbol:Symbol('sym'),
    date: new Date(),
    regexp: /molamazo/g,
    function: function(){console.log(arguments)},
    deep:{
        moreFun:function(){}
    }
};
test('onsubscribe', function(t){

    dop.onsubscribe('PRIVATE',function(user, pass, req){
        PUBLIC_PROXY = req.resolve(PUBLIC,{makeProxy:false});
        // console.log(PUBLIC_PROXY, PUBLIC)
        t.equal(true, true, 'onsubscribe');
        // t.end();
    });
});




test('onclose ondisconnect', function(t){

    myListener.on('close', function( socket ) {
        t.equal(first_socket, socket, 'onclose');
    });

    myListener.on('disconnect', function( node ) {
        t.equal(node.token, token, 'ondisconnect');
        t.end();
    });

});






};
