var http = require('http');


module.exports = function (tape, dop, expressServer, config) {


// httpServers
var httpServer = http.createServer(function (){});
httpServer.listen(config.ports[2]);


test('typeof', function (t) {

    t.equal(typeof dop, 'object', "equal(typeof dop, 'object'");
    t.equal(typeof dop.create, 'function', "equal(typeof dop.create, 'function'");

    t.end();
});


test('.create() (ws)', function(t){

    var mydopPlain = dop.create();
    t.equal( mydopPlain.connector.options.port, config.ports[0], "If we dont pass any option will take the dafault port dop.port:"+config.ports[0]);

    var mydopCustomPort = dop.create({port:config.ports[1]});
    t.equal( mydopCustomPort.connector.options.port, config.ports[1], "If we pass option port will take it:"+config.ports[1]);

    var mydopHttp = dop.create({httpServer:httpServer});
    t.equal( mydopHttp.connector.options.server, httpServer, "Passing an http server as httpServer option. Port:"+mydopHttp.connector.options.server.address().port +' == '+ config.ports[2]);

    var mydopExpress = dop.create({httpServer:expressServer});
    t.equal( mydopExpress.connector.options.server, expressServer, "Passing an express server as httpServer option. Port:"+mydopExpress.connector.options.server.address().port +' == '+ config.ports[3] );

    var mydopBoth = dop.create({httpServer:httpServer, port:1111});
    t.notEqual( mydopHttp.connector.options.server.address().port, 1111, "Passing an httpServer and port will pick httpServer. Port:"+mydopHttp.connector.options.server.address().port +' == '+ config.ports[2]);

    t.end();

});


// test('.create() (SockJS)', function(t){

//     try {
//         var mydopPlain = dop.create({connector:dop.SockJS});
//     } catch(e) {
//         t.equal( typeof e, "object", "If we dont pass httpServer will throw error");
//     }
    
//     var mydopHttp = dop.create({connector:dop.SockJS, httpServer:httpServer});
//     t.equal( mydopHttp.connector.options.httpServer, httpServer, "Passing an http server as httpServer option.");

//     var mydopExpress = dop.create({connector:dop.SockJS, httpServer:expressServer});
//     t.equal( mydopExpress.connector.options.httpServer, expressServer, "Passing an express server as httpServer option. Port:"+mydopExpress.connector.options.httpServer.address().port +' == '+ config.ports[3] );

//     t.end();

// });





};
