var http = require('http');


module.exports = function (tape, synko, expressServer, config) {


// httpServers
var httpServer = http.createServer(function (){});
httpServer.listen(config.ports[2]);


test('typeof', function (t) {

    t.equal(typeof synko, 'object', "equal(typeof synko, 'object'");
    t.equal(typeof synko.create, 'function', "equal(typeof synko.create, 'function'");

    t.end();
});


test('.create() (ws)', function(t){

    var mysynkoPlain = synko.create();
    t.equal( mysynkoPlain.connector.options.port, config.ports[0], "If we dont pass any option will take the dafault port synko.port:"+config.ports[0]);

    var mysynkoCustomPort = synko.create({port:config.ports[1]});
    t.equal( mysynkoCustomPort.connector.options.port, config.ports[1], "If we pass option port will take it:"+config.ports[1]);

    var mysynkoHttp = synko.create({httpServer:httpServer});
    t.equal( mysynkoHttp.connector.options.server, httpServer, "Passing an http server as httpServer option. Port:"+mysynkoHttp.connector.options.server.address().port +' == '+ config.ports[2]);

    var mysynkoExpress = synko.create({httpServer:expressServer});
    t.equal( mysynkoExpress.connector.options.server, expressServer, "Passing an express server as httpServer option. Port:"+mysynkoExpress.connector.options.server.address().port +' == '+ config.ports[3] );

    var mysynkoBoth = synko.create({httpServer:httpServer, port:1111});
    t.notEqual( mysynkoHttp.connector.options.server.address().port, 1111, "Passing an httpServer and port will pick httpServer. Port:"+mysynkoHttp.connector.options.server.address().port +' == '+ config.ports[2]);

    t.end();

});


// test('.create() (SockJS)', function(t){

//     try {
//         var mysynkoPlain = synko.create({connector:synko.SockJS});
//     } catch(e) {
//         t.equal( typeof e, "object", "If we dont pass httpServer will throw error");
//     }
    
//     var mysynkoHttp = synko.create({connector:synko.SockJS, httpServer:httpServer});
//     t.equal( mysynkoHttp.connector.options.httpServer, httpServer, "Passing an http server as httpServer option.");

//     var mysynkoExpress = synko.create({connector:synko.SockJS, httpServer:expressServer});
//     t.equal( mysynkoExpress.connector.options.httpServer, expressServer, "Passing an express server as httpServer option. Port:"+mysynkoExpress.connector.options.httpServer.address().port +' == '+ config.ports[3] );

//     t.end();

// });





};
