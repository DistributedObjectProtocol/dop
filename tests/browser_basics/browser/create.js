var typeCon

test('typeof', function (t) {

    t.equal(typeof dop, 'object', "equal(typeof dop, 'object'");
    t.equal(typeof dop.create, 'function', "equal(typeof dop.create, 'function'");

    t.end();
});



test('Forming url on create', function(t){

    var mydop = dop.create({});
    t.equal(mydop.options.host+'/'+mydop.options.prefix, 'localhost:7777/dop'+typeConnector, mydop.options.url);

    var mydop = dop.create({url:'http://domain.com'});
    t.equal(mydop.options.host+'/'+mydop.options.prefix, 'domain.com/dop'+typeConnector, mydop.options.url);

    var mydop = dop.create({url:'http://domain.com/'});
    t.equal(mydop.options.host+'/'+mydop.options.prefix, 'domain.com/dop'+typeConnector, mydop.options.url);

    var mydop = dop.create({url:'http://domain.com/miprefix'});
    t.equal(mydop.options.host+'/'+mydop.options.prefix, 'domain.com/miprefix'+typeConnector, mydop.options.url);

    var mydop = dop.create({url:'https://domain.com'});
    t.equal(mydop.options.host+'/'+mydop.options.prefix, 'domain.com/dop'+typeConnector, mydop.options.url);
    t.equal(mydop.options.ssl, true, mydop.options.url + ' is ssl protocol');



    t.end();

});
