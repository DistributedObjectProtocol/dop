var http = require('http');


module.exports = function (tape, dop, expressServer, config) {


// httpServers
var httpServer = http.createServer(function (){});
httpServer.listen(config.ports[2]);


test('typeof', function (t) {

    t.equal(typeof dop, 'object', "equal(typeof dop, 'object'");
    t.equal(typeof dop.listen, 'function', "equal(typeof dop.listen, 'function'");

    t.end();
});


test('.listen() (ws)', function(t){

    var mydopPlain = dop.listen();
    t.equal( mydopPlain.listener.options.port, config.ports[0], "If we dont pass any option will take the dafault port dop.port:"+config.ports[0]);

    // var mydopCustomPort = dop.listen({port:config.ports[1]});
    // t.equal( mydopCustomPort.listener.options.port, config.ports[1], "If we pass option port will take it:"+config.ports[1]);

    // var mydopHttp = dop.listen({httpServer:httpServer});
    // t.equal( mydopHttp.listener.options.server, httpServer, "Passing an http server as httpServer option. Port:"+mydopHttp.listener.options.server.address().port +' == '+ config.ports[2]);

    // var mydopExpress = dop.listen({httpServer:expressServer});
    // t.equal( mydopExpress.listener.options.server, expressServer, "Passing an express server as httpServer option. Port:"+mydopExpress.listener.options.server.address().port +' == '+ config.ports[3] );

    // var mydopBoth = dop.listen({httpServer:httpServer, port:1111});
    // t.notEqual( mydopHttp.listener.options.server.address().port, 1111, "Passing an httpServer and port will pick httpServer. Port:"+mydopHttp.listener.options.server.address().port +' == '+ config.ports[2]);

    t.end();

});


// test('.listen() (SockJS)', function(t){

//     try {
//         var mydopPlain = dop.listen({listener:dop.SockJS});
//     } catch(e) {
//         t.equal( typeof e, "object", "If we dont pass httpServer will throw error");
//     }
    
//     var mydopHttp = dop.listen({listener:dop.SockJS, httpServer:httpServer});
//     t.equal( mydopHttp.listener.options.httpServer, httpServer, "Passing an http server as httpServer option.");

//     var mydopExpress = dop.listen({listener:dop.SockJS, httpServer:expressServer});
//     t.equal( mydopExpress.listener.options.httpServer, expressServer, "Passing an express server as httpServer option. Port:"+mydopExpress.listener.options.httpServer.address().port +' == '+ config.ports[3] );

//     t.end();

// });





};
