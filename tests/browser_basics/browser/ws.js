

test('typeof', function (t) {

    t.equal(typeof dop, 'object', "equal(typeof dop, 'object'");
    t.equal(typeof dop.connect, 'function', "equal(typeof dop.connect, 'function'");

    t.end();
});

var node;
test('.connect()', function(t){

    node = dop.connect({url:'http://localhost:4444/dop'});
    t.equal(node.socket.readyState, 0, 'connecting');
    t.end();

});




var token;
test('onopen onmessage onconnect', function(t){

    node.on('open', function(socket) {
        t.equal(node.socket.readyState, 1, 'onopen');
    });

    node.on('message', function( socket, message, message_adapter ) {
        if (message == 'Hola Mundo') {
            t.equal(message, 'Hola Mundo', 'onmessage: ' + message);
            node.send('Adios Mundo');
            t.end();
        }
    });

    node.on('connect', function( token2 ) {
        token = token2;
        t.equal(typeof token, 'string', 'onconnect');
    });

});





test('sync', function(t){
    
    node.sync('PRIVATE', 'user', 'pass').then(object => {
        console.log(object)
        t.equal(typeof object, 'object', 'PRIVATE object synced');
        t.end();
    });

});



test('onclose ondisconnect', function(t){

    node.on('close', function(socket) {
        t.equal(node.socket.readyState, 3, 'onclose');
    });

    node.on('disconnect', function() {
        t.equal(true,true, 'ondisconnect');
        t.end();
    });

});

