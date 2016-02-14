var typeCon

test('typeof', function (t) {

    t.equal(typeof synko, 'object', "equal(typeof synko, 'object'");
    t.equal(typeof synko.create, 'function', "equal(typeof synko.create, 'function'");

    t.end();
});



test('Forming url on create', function(t){

    var mysynko = synko.create({});
    t.equal(mysynko.options.host+'/'+mysynko.options.prefix, 'localhost:7777/synko'+typeConnector, mysynko.options.url);

    var mysynko = synko.create({url:'http://domain.com'});
    t.equal(mysynko.options.host+'/'+mysynko.options.prefix, 'domain.com/synko'+typeConnector, mysynko.options.url);

    var mysynko = synko.create({url:'http://domain.com/'});
    t.equal(mysynko.options.host+'/'+mysynko.options.prefix, 'domain.com/synko'+typeConnector, mysynko.options.url);

    var mysynko = synko.create({url:'http://domain.com/miprefix'});
    t.equal(mysynko.options.host+'/'+mysynko.options.prefix, 'domain.com/miprefix'+typeConnector, mysynko.options.url);

    var mysynko = synko.create({url:'https://domain.com'});
    t.equal(mysynko.options.host+'/'+mysynko.options.prefix, 'domain.com/synko'+typeConnector, mysynko.options.url);
    t.equal(mysynko.options.ssl, true, mysynko.options.url + ' is ssl protocol');



    t.end();

});
