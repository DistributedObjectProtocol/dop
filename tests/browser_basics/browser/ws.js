

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

    node.on('message', function( socket, message, message_transporter ) {
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




test('subscribe', function(t){

    node.subscribe('PUBLIC_DEEP').then(object => {
        // console.log( 'PUBLIC_DEEP', object )
        t.equal(typeof object, 'object', 'PUBLIC_DEEP object synced');
    })

    node.subscribe('PUBLIC').then(object => {
        // console.log('PUBLIC', object)
        t.equal(typeof object, 'object', 'PUBLIC object synced');
    })

    node.subscribe('RE-PUBLIC_DEEP').then(object => {
        // console.log('RE-PUBLIC_DEEP', object)
        t.equal(typeof object, 'object', 'RE-PUBLIC_DEEP object synced');
    });

    node.subscribe('PRIVATE').then(object => {
        // console.log('PRIVATE', object)
        t.equal(typeof object, 'object', 'PRIVATE object synced');
    });

    node.subscribe('ASYNC').then(object => {
        // console.log('ASYNC', object)
        t.equal(typeof object, 'object', 'ASYNC object synced');
        t.end();
    });

    node.subscribe('REJECT').catch(function(err) {
        t.equal(typeof err, 'object', 'REJECT');
    });

    node.subscribe('NOT DEFINED').catch(function(err) {
        // NEVER CALLED BECAUSE IS AN ERROR ON SERVER
    });
    
    node.subscribe('RESOLVE NO OBJECT').catch(function(err) {
        // NEVER CALLED BECAUSE IS AN ERROR ON SERVER
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

